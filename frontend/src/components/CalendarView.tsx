import React, { useState } from 'react';
import { allRooms, mockBookings, Booking } from '../data';

interface CalendarViewProps {
  setCurrentPage?: (page: string) => void;
  setSelectedDate?: (date: string) => void;
  setSelectedTime?: (time: string) => void;
  setSelectedRoom?: (room: typeof allRooms[0] | null) => void;
  bookings?: Booking[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  setCurrentPage,
  setSelectedDate: setGlobalSelectedDate,
  setSelectedTime: setGlobalSelectedTime,
  setSelectedRoom,
  bookings = mockBookings
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const today = new Date();

  const timeSlots = [
    { id: '09:00-11:00', label: '09:00 AM - 11:00 AM', type: 'morning' },
    { id: '11:00-13:00', label: '11:00 AM - 01:00 PM', type: 'midday' },
    { id: '13:00-15:00', label: '01:00 PM - 03:00 PM', type: 'afternoon' },
    { id: '15:00-17:00', label: '03:00 PM - 05:00 PM', type: 'evening' },
    { id: '17:00-19:00', label: '05:00 PM - 07:00 PM', type: 'evening' },
  ];

  // Get existing bookings for availability check
  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(booking => booking.date === dateString);
  };

  const isDateBooked = (date: Date, timeSlot: string) => {
    const dateString = date.toISOString().split('T')[0];
    return bookings.some(booking =>
      booking.date === dateString && booking.time === timeSlot
    );
  };

  const getTimeSlotStatus = (date: Date, timeSlot: string) => {
    if (isDateBooked(date, timeSlot)) {
      return 'booked';
    }

    // Simulate availability based on day of week
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      return 'limited';
    }

    return 'available';
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (clickedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return;

    setSelectedDate(clickedDate);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotClick = (timeSlot: string) => {
    if (getTimeSlotStatus(selectedDate!, timeSlot) !== 'booked') {
      setSelectedTimeSlot(timeSlot);
    }
  };

  const handleBookRoom = () => {
    if (selectedDate && selectedTimeSlot) {
      const dateString = selectedDate.toISOString().split('T')[0];

      // Update global state
      if (setGlobalSelectedDate) setGlobalSelectedDate(dateString);
      if (setGlobalSelectedTime) setGlobalSelectedTime(selectedTimeSlot);

      // Navigate to booking page
      if (setCurrentPage) {
        setCurrentPage('booking');
      }
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  // Calendar generation
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adjust for Monday start (0 = Sunday, 1 = Monday, etc.)
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const totalDays = startOffset + daysInMonth;
  const totalWeeks = Math.ceil(totalDays / 7);

  const generateCalendarDays = () => {
    const days = [];

    // Add empty cells for offset
    for (let i = 0; i < startOffset; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true });
    }

    // Fill remaining cells to complete the grid
    const remainingCells = totalWeeks * 7 - days.length;
    for (let i = 0; i < remainingCells; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-start py-4 px-2 sm:py-8 sm:px-4 md:py-16 md:px-6">
      <div className="bg-gray-800 w-full max-w-6xl rounded-lg border border-gray-700 shadow-xl p-3 sm:p-6 md:p-8 flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
        {/* Calendar Section */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center sm:text-left">
              Room Booking Calendar
            </h2>
            <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto justify-center sm:justify-end">
              <button
                onClick={handlePrevMonth}
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 font-medium transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={handleNextMonth}
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base rounded-md bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 font-medium transition-colors"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 text-center text-gray-400 font-semibold mb-3 sm:mb-4 text-xs sm:text-sm md:text-base border-b border-gray-700 pb-2">
            <div className="hidden sm:block">Monday</div>
            <div className="hidden sm:block">Tuesday</div>
            <div className="hidden sm:block">Wednesday</div>
            <div className="hidden sm:block">Thursday</div>
            <div className="hidden sm:block">Friday</div>
            <div className="hidden sm:block">Saturday</div>
            <div className="hidden sm:block">Sunday</div>
            <div className="sm:hidden">Mon</div>
            <div className="sm:hidden">Tue</div>
            <div className="sm:hidden">Wed</div>
            <div className="sm:hidden">Thu</div>
            <div className="sm:hidden">Fri</div>
            <div className="sm:hidden">Sat</div>
            <div className="sm:hidden">Sun</div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm md:text-base">
            {calendarDays.map(({ day, isCurrentMonth }, index) => {
              if (!day || !isCurrentMonth) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="p-3 md:p-4 border-2 border-transparent"
                  />
                );
              }

              const thisDate = new Date(year, month, day);
              const isPast = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isToday =
                thisDate.getDate() === today.getDate() &&
                thisDate.getMonth() === today.getMonth() &&
                thisDate.getFullYear() === today.getFullYear();
              const isSelected = selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`cursor-pointer rounded-md p-2 sm:p-3 md:p-4 border-2 transition-all duration-200 font-medium min-h-[2rem] sm:min-h-[2.5rem] md:min-h-[3rem] flex items-center justify-center
                    ${isPast
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600'
                      : isToday
                        ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-400'
                        : isSelected
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-gray-500 text-gray-300'
                    }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-1/3 bg-gray-700 border border-gray-600 rounded-lg p-3 sm:p-4 md:p-6 shadow-lg">
          {selectedDate ? (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                {selectedDate.toLocaleDateString('default', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {timeSlots.map((slot) => {
                  const status = getTimeSlotStatus(selectedDate, slot.id);
                  const isBooked = status === 'booked';
                  const isLimited = status === 'limited';
                  const isSelected = selectedTimeSlot === slot.id;

                  return (
                    <div
                      key={slot.id}
                      onClick={() => handleTimeSlotClick(slot.id)}
                      className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition text-xs sm:text-sm flex justify-between items-center
                        ${isBooked
                          ? 'bg-red-900/50 border-red-600 text-red-300 cursor-not-allowed'
                          : isSelected
                            ? 'bg-blue-600 text-white border-blue-500'
                            : isLimited
                              ? 'bg-yellow-900/50 border-yellow-600 text-yellow-300 hover:bg-yellow-800/50'
                              : 'bg-green-900/50 border-green-600 text-green-300 hover:bg-green-800/50'
                        }`}
                    >
                      <span className="truncate">{slot.label}</span>
                      <span className="ml-2 flex-shrink-0">
                        {isBooked ? '❌' : isLimited ? '⚠️' : '✅'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Color Legend */}
              <div className="text-xs sm:text-sm text-gray-400 space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 bg-green-600 rounded"></span>
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 bg-yellow-600 rounded"></span>
                  <span>Limited</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-block w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded"></span>
                  <span>Booked</span>
                </div>
              </div>

              {selectedTimeSlot && (
                <button
                  onClick={handleBookRoom}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Book This Time Slot
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-4 sm:py-8">
              <div className="text-blue-400 text-4xl sm:text-6xl mb-2 sm:mb-4">📅</div>
              <p className="text-gray-400 font-medium text-sm sm:text-base">Select a date to view availability</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
