import React from 'react';
import { X } from 'lucide-react';

interface Room {
  id: number;
  room_number: string;
  room_type: string;
  capacity: number;
  block: string;
  features: string[];
  equipment: string[];
  is_active: boolean;
}

interface BookingModalProps {
  showBookingModal: boolean;
  setShowBookingModal: (show: boolean) => void;
  selectedRoom: any;
  setSelectedRoom: (room: any) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  eventDetails: string;
  setEventDetails: (details: string) => void;
  handleBookRoom: () => void;
  rooms: Room[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  facultyEmail: string;
  setFacultyEmail: (email: string) => void;
  userRole: string;
  isLoading?: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({
  showBookingModal,
  setShowBookingModal,
  selectedRoom,
  setSelectedRoom,
  selectedTime,
  setSelectedTime,
  eventDetails,
  setEventDetails,
  handleBookRoom,
  rooms,
  selectedDate,
  setSelectedDate,
  facultyEmail,
  setFacultyEmail,
  userRole,
  isLoading = false
}) => {
  if (!showBookingModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Quick Book Room</h2>
          <button
            onClick={() => setShowBookingModal(false)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-all duration-200 text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Select Room</label>
            <select
              value={selectedRoom?.id || ''}
              onChange={(e) => setSelectedRoom(rooms.find(r => r.id === Number(e.target.value)) || null)}
              className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Choose a room...</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.room_number} - {room.room_type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Time Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Start Hour (07-17)</label>
              <div className="relative">
                <input
                  type="number"
                  min="7"
                  max="17"
                  value={parseInt((selectedTime.split('-')[0] || '09:00').split(':')[0])}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val)) val = 9;
                    if (val < 7) val = 7;
                    if (val > 17) val = 17;

                    const hourStr = val.toString().padStart(2, '0');
                    const currentEnd = selectedTime.split('-')[1] || '10:00';
                    setSelectedTime(`${hourStr}:00-${currentEnd}`);
                  }}
                  className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="9"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  :00
                </div>
              </div>
            </div>

            {/* End Time Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">End Hour (07-17)</label>
              <div className="relative">
                <input
                  type="number"
                  min="7"
                  max="17"
                  value={parseInt((selectedTime.split('-')[1] || '10:00').split(':')[0])}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val)) val = 10;
                    if (val < 7) val = 7;
                    if (val > 17) val = 17;

                    const hourStr = val.toString().padStart(2, '0');
                    const currentStart = selectedTime.split('-')[0] || '09:00';
                    setSelectedTime(`${currentStart}-${hourStr}:00`);
                  }}
                  className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  :00
                </div>
              </div>
            </div>
          </div>

          {(() => {
            const today = new Date();
            const selectedDateObj = new Date(selectedDate);
            const isToday = selectedDateObj.toDateString() === today.toDateString();
            const currentHour = today.getHours();
            const currentMinute = today.getMinutes();

            const startHour = parseInt((selectedTime.split('-')[0] || '09:00').split(':')[0]);

            // Check if start time is in the past (if today)
            const isPastTime = isToday && (startHour < currentHour || (startHour === currentHour && currentMinute > 0));

            if (isPastTime) {
              return <p className="text-red-400 text-sm mt-2">⚠️ Cannot book for a past time.</p>;
            }
            return null;
          })()}

          {/* Faculty Email Field - Only for Admins */}
          {/* Note: We need to pass userRole to this component to check if admin */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-white">Faculty Email (for notification)</label>
            <input
              type="email"
              placeholder="faculty@example.com"
              value={facultyEmail}
              onChange={(e) => setFacultyEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              id="faculty-email-input"
            />
            <p className="text-xs text-gray-400 mt-1">Leave blank to use your own email.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white">Event Details</label>
            <textarea
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              placeholder="Enter event description..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          <button
            onClick={handleBookRoom}
            disabled={isLoading || (() => {
              const today = new Date();
              const selectedDateObj = new Date(selectedDate);
              const isToday = selectedDateObj.toDateString() === today.toDateString();
              const currentHour = today.getHours();
              const currentMinute = today.getMinutes();
              const startHour = parseInt((selectedTime.split('-')[0] || '09:00').split(':')[0]);
              return isToday && (startHour < currentHour || (startHour === currentHour && currentMinute > 0));
            })()}
            className={`w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl ${isLoading || (() => {
              const today = new Date();
              const selectedDateObj = new Date(selectedDate);
              const isToday = selectedDateObj.toDateString() === today.toDateString();
              const currentHour = today.getHours();
              const currentMinute = today.getMinutes();
              const startHour = parseInt((selectedTime.split('-')[0] || '09:00').split(':')[0]);
              return isToday && (startHour < currentHour || (startHour === currentHour && currentMinute > 0));
            })() ? 'opacity-70 cursor-not-allowed hover:scale-100' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Book Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
