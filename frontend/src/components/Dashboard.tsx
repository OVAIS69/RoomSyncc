import React from 'react';
import { Building, MapPin, MessageSquare, Calendar, Clock, Users, CheckCircle } from 'lucide-react';

interface DashboardProps {
  user: any;
  bookings: any[];
  selectedDate: string;
  setCurrentPage: (page: string) => void;
  setSelectedRoom: (room: any) => void;
  rooms: any[];
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  setCurrentPage,
  bookings,
}) => {
  const userRole = user?.role;
  const displayName = user?.first_name || user?.username || 'User';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/50 via-gray-900 to-black border border-gray-700 shadow-2xl p-8 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">System Operational</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{displayName}</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl leading-relaxed">
            Manage your campus room bookings efficiently.
            {userRole === 'admin'
              ? ' You have full control over rooms, bookings, and user management.'
              : ' Check availability and coordinate with the administration easily.'}
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

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setCurrentPage('room-availability')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-white/20"
            >
              <MapPin className="w-5 h-5" />
              Check Availability
            </button>
            {userRole !== 'admin' && (
              <button
                onClick={() => setCurrentPage('support')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 text-white font-semibold border border-gray-700 hover:border-gray-600 hover:bg-gray-700 transition-all duration-200"
              >
                <MessageSquare className="w-5 h-5" />
                Contact Support
              </button>
            )}
          </div>
        </div>

        {/* Abstract Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Quick Actions Grid */}
      <div className="animate-slide-up delay-100">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Clock className="w-6 h-6 text-yellow-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => setCurrentPage('room-availability')}
            className="group cursor-pointer p-6 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <MapPin className="w-24 h-24 text-indigo-500 rotate-12" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Room Map</h3>
            <p className="text-gray-400 text-sm mb-4">View interactive blueprint and availability.</p>
            <div className="flex items-center text-indigo-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              View Map
            </div>
          </div>

          {userRole === 'admin' && (
            <>
              <div
                onClick={() => setCurrentPage('admin-bookings')}
                className="group cursor-pointer p-6 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 hover:bg-gray-800 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Calendar className="w-24 h-24 text-purple-500 rotate-12" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Bookings</h3>
                <p className="text-gray-400 text-sm mb-4">Manage room reservations and requests.</p>
                <div className="flex items-center text-purple-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Manage
                </div>
              </div>

              <div
                onClick={() => setCurrentPage('admin-users')}
                className="group cursor-pointer p-6 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-emerald-500/50 hover:bg-gray-800 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users className="w-24 h-24 text-emerald-500 rotate-12" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Users</h3>
                <p className="text-gray-400 text-sm mb-4">Manage user roles and permissions.</p>
                <div className="flex items-center text-emerald-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Manage
                </div>
              </div>
            </>
          )}

          {userRole !== 'admin' && (
            <div
              onClick={() => setCurrentPage('support')}
              className="group cursor-pointer p-6 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 hover:bg-gray-800 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <MessageSquare className="w-24 h-24 text-blue-500 rotate-12" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Support</h3>
              <p className="text-gray-400 text-sm mb-4">Need help? Send a message to admins.</p>
              <div className="flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                Contact
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Building className="w-5 h-5 text-gray-400" />
            Facility Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-700/50 border border-gray-600">
              <div className="text-gray-400 text-sm mb-1">Operating Hours</div>
              <div className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                08:00 AM - 07:00 PM
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-700/50 border border-gray-600">
              <div className="text-gray-400 text-sm mb-1">Room Types</div>
              <div className="text-lg font-semibold text-white">
                Classrooms, Labs, Halls
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4">Admin Notice</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
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
