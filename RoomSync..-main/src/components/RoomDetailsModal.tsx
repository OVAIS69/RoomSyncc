import React from 'react';
import { X } from 'lucide-react';

interface RoomDetailsModalProps {
  selectedRoom: any;
  setSelectedRoom: (room: any) => void;
  bookings: any[];
  userRole: string;
  setShowBookingModal: (show: boolean) => void;
  getRoomStatus: (roomId: string) => string;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  selectedRoom,
  setSelectedRoom,
  bookings,
  userRole,
  setShowBookingModal,
  getRoomStatus
}) => {
  if (!selectedRoom) return null;

  // Filter for current and upcoming bookings
  const now = new Date();
  const roomBookings = bookings
    .filter(booking => Number(booking.room) === Number(selectedRoom.id))
    .filter(booking => {
      // Create date object for booking end time to compare with now
      const bookingEnd = new Date(`${booking.date}T${booking.end_time}`);
      return bookingEnd >= now;
    })
    .sort((a, b) => {
      // Sort by date then time
      const dateA = new Date(`${a.date}T${a.start_time}`).getTime();
      const dateB = new Date(`${b.date}T${b.start_time}`).getTime();
      return dateA - dateB;
    });
  const status = getRoomStatus(selectedRoom.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedRoom.room_number || selectedRoom.name}</h2>
            <p className="text-gray-300 capitalize">
              {selectedRoom.room_type || selectedRoom.type} • Capacity: {selectedRoom.capacity}
            </p>
          </div>
          <button
            onClick={() => setSelectedRoom(null)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-all duration-200 text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Room Status */}
        <div className={`mb-6 p-4 rounded-xl border-2 ${status === 'available' ? 'border-emerald-200 bg-emerald-900/20' :
          (status === 'pending' || status === 'partially_booked') ? 'border-yellow-200 bg-yellow-900/20' :
            'border-red-200 bg-red-900/20'
          }`}>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${status === 'available' ? 'bg-emerald-500' :
              (status === 'pending' || status === 'partially_booked') ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></div>
            <span className="font-semibold capitalize text-white">{status === 'fully_booked' ? 'Fully Booked' : status.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Current Bookings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Current & Upcoming Bookings</h3>
          {roomBookings.length === 0 ? (
            <p className="text-gray-400 italic">No bookings found for this room.</p>
          ) : (
            <div className="space-y-3">
              {roomBookings.map((booking) => (
                <div key={booking.id} className="p-4 rounded-xl bg-gray-700/50 border border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">{booking.purpose || 'Room Booking'}</p>
                      <p className="text-sm text-gray-400">
                        Booked by: <span className="text-indigo-300">
                          {booking.faculty_email ? `Faculty (${booking.faculty_email})` : (booking.user_full_name || booking.user_name || 'Unknown User')}
                        </span>
                      </p>
                      <p className="text-sm text-indigo-300 mt-1 font-medium">
                        {booking.date} • {booking.start_time} - {booking.end_time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Book Now Button */}
        {userRole === 'admin' && (
          <button
            onClick={() => {
              setShowBookingModal(true);
              // Do not clear selectedRoom so it populates the booking form
            }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Book This Room
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsModal;
