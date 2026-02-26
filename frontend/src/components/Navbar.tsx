import React from 'react';
import { Menu, X, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  user: any;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  mobileMenuOpen,
  setMobileMenuOpen,
  user,
  onLoginClick
}) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  let navItems: string[] = [];

  if (!user) {
    navItems = [];
  } else if (user.role === 'admin') {
    navItems = ['admin-availability', 'admin-bookings', 'admin-rooms', 'admin-blocks', 'admin-users', 'admin-support'];
  } else {
    navItems = ['dashboard', 'room-availability', 'about', 'support'];
  }

  const getLabel = (page: string) => {
    switch (page) {
      case 'dashboard': return 'Home';
      case 'calendar': return 'Schedule';
      case 'room-availability': return 'Room Availability';
      case 'admin-availability': return 'Live Map';
      case 'admin-bookings': return 'Bookings';
      case 'admin-rooms': return 'Rooms';
      case 'admin-blocks': return 'Blocks';
      case 'admin-users': return 'Users';
      case 'admin-support': return 'Support';
      default: return page;
    }
  };

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 bg-[var(--surface)] border-b border-[var(--border)] shadow-sm backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 sm:space-x-3 md:mr-8 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setCurrentPage('dashboard')}
          >
            <img src="/logo.png" alt="RoomSync Logo" className="w-9 h-9 sm:w-12 sm:h-12 object-contain" />
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
              RoomSync
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`capitalize text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-xl whitespace-nowrap ${currentPage === page
                  ? 'bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20 shadow-sm shadow-indigo-500/5 backdrop-blur-md'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                  }`}
              >
                {getLabel(page)}
              </button>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-transparent hover:border-[var(--border)] hover:bg-[var(--bg-secondary)] hover:shadow-sm transition-all text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] relative"
                  onClick={() => setCurrentPage('profile')}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-500/20 dark:to-indigo-500/10 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-500/30 shadow-sm shadow-indigo-500/10 overflow-hidden">
                    {user.avatar ? (
                      <img src={`http://localhost:8000${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-indigo-600" />
                    )}
                  </div>
                  <span className="text-sm font-bold">
                    {user.username} <span className="text-indigo-500 opacity-60">({user.role})</span>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 rounded-xl transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden md:flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all duration-300 font-bold text-white shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5"
              >
                <span>Login</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] transition-all duration-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 animate-in slide-in-from-top-4 duration-300">
            <div className="space-y-1">
              {navItems.map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-xl capitalize transition-all duration-200 ${currentPage === page
                    ? 'bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-500/10'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                >
                  {getLabel(page)}
                </button>
              ))}
            </div>

            {/* Mobile Auth */}
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              {user ? (
                <div className="space-y-4">
                  <div
                    onClick={() => {
                      setCurrentPage('profile');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={`${process.env.REACT_APP_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000'}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} className="text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)] font-bold">{user.username}</p>
                      <p className="text-[var(--text-tertiary)] text-xs uppercase tracking-widest font-bold">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 rounded-xl font-bold transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all duration-200"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
