import React from 'react';
import { AlertCircle } from 'lucide-react';
import { allRooms } from '../data';

interface BookingPageProps {
  userRole: string;
  selectedRoom: any;
  setSelectedRoom: (room: any) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  eventDetails: string;
  setEventDetails: (details: string) => void;
  handleBookRoom: () => void;
  bookings: any[];
}

const BookingPage: React.FC<BookingPageProps> = ({
  userRole,
  selectedRoom,
  setSelectedRoom,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  eventDetails,
  setEventDetails,
  handleBookRoom,
  bookings
}) => {
  // Student check removed

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Book a Room</h1>

      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-lg">
        <div className="space-y-6">
          {/* Room Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Select Room</label>
            <select
              value={selectedRoom?.id || ''}
              onChange={(e) => setSelectedRoom(allRooms.find(r => r.id === e.target.value) || null)}
              className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Choose a room...</option>
              {allRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} - {room.type} (Capacity: {room.capacity})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Time Picker */}
          {/* Time Picker */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Start Time</label>
              <input
                type="time"
                value={selectedTime.split('-')[0] || '09:00'}
                onChange={(e) => {
                  const endTime = selectedTime.split('-')[1] || '10:00';
                  setSelectedTime(`${e.target.value}-${endTime}`);
                }}
                className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">End Time</label>
              <input
                type="time"
                value={selectedTime.split('-')[1] || '10:00'}
                onChange={(e) => {
                  const startTime = selectedTime.split('-')[0] || '09:00';
                  setSelectedTime(`${startTime}-${e.target.value}`);
                }}
                className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Event Details */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Event Details</label>
            <textarea
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              placeholder="Enter event description..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Book Button */}
          <button
            onClick={handleBookRoom}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-4 rounded-xl font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
