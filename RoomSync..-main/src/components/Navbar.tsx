import React from 'react';
import { Menu, X, User } from 'lucide-react';
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
    // Guests see no nav items (just the logo for Home)
    navItems = [];
  } else if (user.role === 'admin') {
    // Admins see specific management tabs directly in the navbar
    navItems = ['admin-availability', 'admin-bookings', 'admin-rooms', 'admin-blocks', 'admin-users', 'admin-support'];
  } else {
    // Faculty/Students view (dashboard, room availability, about, support) - REMOVED calendar/schedule
    navItems = ['dashboard', 'room-availability', 'about', 'support'];
  }

  const getLabel = (page: string) => {
    switch (page) {
      case 'dashboard': return 'Home';
      case 'calendar': return 'Schedule';
      case 'room-availability': return 'Room Availability';
      case 'admin-availability': return 'Live Availability';
      case 'admin-bookings': return 'Booking Records';
      case 'admin-rooms': return 'Room Management';
      case 'admin-blocks': return 'Blocks';
      case 'admin-users': return 'User Management';
      case 'admin-support': return 'Support Messages';
      default: return page;
    }
  };

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 bg-gray-900/95 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 mr-8 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setCurrentPage('dashboard')}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-sm border-2 border-white"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
              RoomSync
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`capitalize transition-all duration-200 hover:scale-105 ${currentPage === page
                  ? 'text-indigo-600 font-semibold'
                  : 'text-gray-300 hover:text-white'
                  }`}
              >
                {getLabel(page)}
              </button>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div
                  className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => setCurrentPage('dashboard')}
                >
                  <User size={18} />
                  <span className="text-sm">
                    {user.username} <span className="text-indigo-400">({user.role})</span>
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-500 hover:scale-105 rounded-lg transition-all duration-200"
              >
                <span>Login</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-all duration-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 bg-gray-900">
            {navItems.map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 capitalize transition-all duration-200 ${currentPage === page
                  ? 'text-indigo-600 font-semibold'
                  : 'text-gray-300 hover:text-white'
                  }`}
              >
                {getLabel(page)}
              </button>
            ))}

            {/* Mobile Auth */}
            <div className="mt-4 px-4 pt-4 border-t border-gray-700">
              {user ? (
                <>
                  <div
                    className="flex items-center space-x-2 text-gray-300 cursor-pointer hover:text-white transition-colors"
                    onClick={() => setCurrentPage('dashboard')}
                  >
                    <User size={18} />
                    <span className="text-sm">
                      {user.username} <span className="text-indigo-400">({user.role})</span>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200"
                  >
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-lg transition-all duration-200"
                >
                  <span>Login</span>
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
