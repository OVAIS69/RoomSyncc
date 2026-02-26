import React from 'react';
import { X } from 'lucide-react';

interface RoomDetailsModalProps {
  selectedRoom: any;
  setSelectedRoom: (room: any) => void;
  bookings: any[];
  userRole: string;
  setShowBookingModal: (show: boolean) => void;
  getRoomStatus: (roomId: string) => string;
  isBookingOpen?: boolean;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({
  selectedRoom,
  setSelectedRoom,
  bookings,
  userRole,
  setShowBookingModal,
  getRoomStatus,
  isBookingOpen = false
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
    <div className={`fixed inset-0 flex items-center justify-center p-4 modal transition-all duration-500 ${isBookingOpen ? 'bg-transparent backdrop-blur-0 pointer-events-none opacity-0' : 'bg-black/60 backdrop-blur-sm'}`}>
      <div className="bg-[var(--surface)] rounded-[2.5rem] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[var(--border)]">
        <div className="absolute top-0 right-0 p-10 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none rounded-[2.5rem]"></div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">{selectedRoom.room_number || selectedRoom.name}</h2>
            <p className="text-[var(--text-tertiary)] font-bold capitalize mt-1">
              {selectedRoom.room_type || selectedRoom.type} • Capacity: {selectedRoom.capacity}
            </p>
          </div>
          <button
            onClick={() => setSelectedRoom(null)}
            className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-all duration-200 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            <X size={24} />
          </button>
        </div>

        {/* Room Status */}
        <div className={`mb-8 p-6 rounded-2xl border-2 backdrop-blur-sm ${status === 'available' ? 'border-emerald-200 bg-emerald-500/10' :
          (status === 'pending' || status === 'partially_booked') ? 'border-yellow-200 bg-yellow-500/10' :
            'border-red-200 bg-red-500/10'
          }`}>
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full shadow-sm ${status === 'available' ? 'bg-emerald-500' :
              (status === 'pending' || status === 'partially_booked') ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></div>
            <span className={`font-bold text-lg capitalize ${status === 'available' ? 'text-emerald-700' :
              (status === 'pending' || status === 'partially_booked') ? 'text-yellow-700' :
                'text-red-700'
              }`}>{status === 'fully_booked' ? 'Fully Booked' : status.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Current Bookings */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Current & Upcoming Bookings</h3>
          {roomBookings.length === 0 ? (
            <p className="text-[var(--text-tertiary)] italic p-8 text-center border-2 border-dashed border-[var(--border)] rounded-2xl font-medium">No bookings found for this room.</p>
          ) : (
            <div className="space-y-4">
              {roomBookings.map((booking) => (
                <div key={booking.id} className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-sm hover:border-indigo-500/30 transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-lg">{booking.purpose || 'Room Booking'}</p>
                      <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
                        Booked by: <span className="text-indigo-600 font-bold">
                          {booking.faculty_email ? `Faculty (${booking.faculty_email})` : (booking.user_full_name || booking.user_name || 'Unknown User')}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 text-indigo-600 mt-2 bg-indigo-50 px-3 py-1 rounded-lg w-fit text-sm font-bold border border-indigo-100">
                        {booking.date} • {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                      </div>
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
            }}
            className="w-full bg-gradient-to-r from-brand-vibrant-cyan to-brand-vibrant-blue text-white py-4 rounded-2xl font-bold hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] transform transition-all duration-300 hover:-translate-y-1 mt-4"
          >
            Initiate Rapid Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsModal;
