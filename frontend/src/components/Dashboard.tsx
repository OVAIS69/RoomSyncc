import React from 'react';
import { Building, MapPin, MessageSquare, Calendar, Clock, Users, CheckCircle, Sun, Moon } from 'lucide-react';

interface DashboardProps {
  user: any;
  bookings: any[];
  selectedDate: string;
  setCurrentPage: (page: string) => void;
  setSelectedRoom: (room: any) => void;
  rooms: any[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  setCurrentPage,
  bookings,
  theme,
  toggleTheme
}) => {
  const userRole = user?.role;
  const displayName = user?.first_name || user?.username || 'User';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-secondary via-brand-primary to-brand-primary border border-cyber-border shadow-2xl p-8 md:p-16 group cyber-glow-strong">

        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 z-30">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-xl hover:-translate-y-1 transition-all duration-300"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={24} className="text-indigo-600" /> : <Sun size={24} className="text-amber-400" />}
          </button>
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-vibrant-cyan/10 border border-brand-vibrant-cyan/20 mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-brand-vibrant-cyan animate-pulse"></span>
            <span className="text-xs font-bold text-brand-vibrant-cyan tracking-widest uppercase">System Operational</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-text-primary mb-8 leading-[1.1] tracking-tight">
            Welcome back, <br />
            <span className="bg-gradient-to-r from-brand-vibrant-cyan via-brand-vibrant-blue to-brand-vibrant-indigo bg-clip-text text-transparent">
              {displayName}
            </span>
          </h1>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl leading-relaxed font-light">
            Experience the future of campus management.
            {userRole === 'admin'
              ? ' You have full command over architectural room logic and user orchestration.'
              : ' Streamline your schedule and coordinate with precision.'}
          </p>

          {/* Today's Bookings Summary */}
          {(() => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;

            // Filter bookings for today
            // For Admin: All today's bookings
            // For Faculty: Bookings made by them (if 'bookings' prop contains all, we might need to filter by user.id if available in booking object)
            // However, strictly following the prompt "for the faculty it should shown the room booked by faculties" - assuming "My Dashboard" or generic faculty bookings.
            // Given the context is usually "My Dashboard", I will filter by user name/id if possible, or just show count if the parent passes filtered bookings.
            // The parent 'AdminDashboard' passes 'allBookingsData'. 'bookings' prop likely has everything for Admin.

            let todaysBookings = bookings.filter(b => b.date === todayStr);

            if (userRole !== 'admin') {
              // For non-admin users, we must strictly filter by their email.
              // If user.email is missing, we show 0 bookings (safety default).
              if (user?.email) {
                todaysBookings = todaysBookings.filter((b: any) => b.user_email === user.email || b.faculty_email === user.email);
              } else {
                todaysBookings = []; // No email identified, show nothing
              }
            }

            if (todaysBookings.length > 0) {
              return (
                <p className="text-xl font-semibold text-emerald-400 mb-6">
                  {todaysBookings.length} Room{todaysBookings.length === 1 ? '' : 's'} booked today.
                </p>
              );
            }
            return null;
          })()}

          <div className="flex flex-wrap gap-5">
            <button
              onClick={() => setCurrentPage('room-availability')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-vibrant-cyan to-brand-vibrant-blue text-white font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all duration-300 transform hover:-translate-y-1 shadow-xl"
            >
              <MapPin className="w-5 h-5" />
              Check Availability
            </button>
            {userRole !== 'admin' && (
              <button
                onClick={() => setCurrentPage('support')}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 text-white font-semibold border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
              >
                <MessageSquare className="w-5 h-5" />
                Contact Support
              </button>
            )}
          </div>
        </div>

        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[30rem] h-[30rem] bg-brand-vibrant-cyan/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-[25rem] h-[25rem] bg-brand-vibrant-indigo/15 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>

      {/* Quick Actions Grid */}
      <div className="animate-slide-up delay-100">
        <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
          <Clock className="w-6 h-6 text-yellow-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            onClick={() => setCurrentPage('room-availability')}
            className="group cursor-pointer p-8 rounded-3xl glass border-cyber-border hover:border-brand-vibrant-cyan/30 hover:bg-brand-vibrant-cyan/5 transition-all duration-500 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
              <MapPin className="w-48 h-48 text-brand-vibrant-cyan rotate-12" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-brand-vibrant-cyan/10 flex items-center justify-center mb-6 text-brand-vibrant-cyan group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-500">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">Room Map</h3>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">View interactive blueprint and real-time room availability across campus.</p>
            <div className="flex items-center text-brand-vibrant-cyan text-sm font-bold group-hover:translate-x-2 transition-transform duration-300">
              Explore Map <span className="ml-2">→</span>
            </div>
          </div>

          {userRole === 'admin' && (
            <>
              <div
                onClick={() => setCurrentPage('admin-bookings')}
                className="group cursor-pointer p-8 rounded-3xl glass border-cyber-border hover:border-brand-vibrant-purple/30 hover:bg-brand-vibrant-purple/5 transition-all duration-500 relative overflow-hidden shadow-2xl"
              >
                <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
                  <Calendar className="w-48 h-48 text-brand-vibrant-purple rotate-12" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-brand-vibrant-purple/10 flex items-center justify-center mb-6 text-brand-vibrant-purple group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-500">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">Bookings</h3>
                <p className="text-text-secondary text-sm mb-6 leading-relaxed">Manage room reservations, requests, and archival booking data.</p>
                <div className="flex items-center text-brand-vibrant-purple text-sm font-bold group-hover:translate-x-2 transition-transform duration-300">
                  Access Records <span className="ml-2">→</span>
                </div>
              </div>

              <div
                onClick={() => setCurrentPage('admin-users')}
                className="group cursor-pointer p-8 rounded-3xl glass border-cyber-border hover:border-brand-vibrant-blue/30 hover:bg-brand-vibrant-blue/5 transition-all duration-500 relative overflow-hidden shadow-2xl"
              >
                <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
                  <Users className="w-48 h-48 text-brand-vibrant-blue -rotate-12" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-brand-vibrant-blue/10 flex items-center justify-center mb-6 text-brand-vibrant-blue group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-500">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">Users</h3>
                <p className="text-text-secondary text-sm mb-6 leading-relaxed">Orchestrate user roles, authentication protocols, and access levels.</p>
                <div className="flex items-center text-brand-vibrant-blue text-sm font-bold group-hover:translate-x-2 transition-transform duration-300">
                  Manage Directory <span className="ml-2">→</span>
                </div>
              </div>
            </>
          )}

          {userRole !== 'admin' && (
            <div
              onClick={() => setCurrentPage('support')}
              className="group cursor-pointer p-8 rounded-3xl glass border-cyber-border hover:border-brand-vibrant-blue/30 hover:bg-brand-vibrant-blue/5 transition-all duration-500 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
                <MessageSquare className="w-48 h-48 text-brand-vibrant-blue rotate-12" />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-brand-vibrant-blue/10 flex items-center justify-center mb-6 text-brand-vibrant-blue group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all duration-500">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">Support</h3>
              <p className="text-text-secondary text-sm mb-6 leading-relaxed">Direct channel to administration for queries and technical assistance.</p>
              <div className="flex items-center text-brand-vibrant-blue text-sm font-bold group-hover:translate-x-2 transition-transform duration-300">
                Start Chat <span className="ml-2">→</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-cyber-card rounded-2xl border border-cyber-border p-8 shadow-sm">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Building className="w-5 h-5 text-text-secondary" />
            Facility Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-brand-secondary/50 border border-cyber-border">
              <div className="text-text-secondary text-sm mb-1">Operating Hours</div>
              <div className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                08:00 AM - 07:00 PM
              </div>
            </div>
            <div className="p-4 rounded-xl bg-brand-secondary/50 border border-cyber-border">
              <div className="text-text-secondary text-sm mb-1">Room Types</div>
              <div className="text-lg font-semibold text-text-primary">
                Classrooms, Labs, Halls
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-secondary rounded-2xl border border-cyber-border p-8 shadow-sm">
          <h3 className="text-xl font-bold text-text-primary mb-4">Admin Notice</h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            Please ensure all room bookings are finalized 24 hours in advance. For urgent requests, contact the facility manager directly.
          </p>
          <div className="text-xs text-gray-500 font-medium">
            Last updated: System Policy v2.0
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
