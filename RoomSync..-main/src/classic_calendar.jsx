import React, { useState, useEffect } from "react";
import { getAvailableTimeSlots, getRoomStatus, getBookingsByRoom } from './data';

export default function CalendarPage({ onNavigate, selectedRoom = null }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8)); // September 2025
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filter, setFilter] = useState("all");
  const [timeSlots, setTimeSlots] = useState([]);

  const today = new Date();

  useEffect(() => {
    // Use the enhanced time slots from data.ts
    setTimeSlots(getAvailableTimeSlots().map((slot, index) => ({
      id: index + 1,
      label: slot,
      type: getTimeSlotType(slot)
    })));
  }, []);

  const getTimeSlotType = (timeSlot) => {
    const hour = parseInt(timeSlot.split(':')[0]);
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  // Enhanced booking conflict detection using data.ts utilities
  const isSlotBooked = (day, slotId) => {
    if (!selectedRoom) return false;
    
    const dateKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const roomBookings = getBookingsByRoom(selectedRoom.id, dateKey);
    
    if (roomBookings.length === 0) return false;
    
    const slotTime = timeSlots.find(slot => slot.id === slotId)?.label;
    return roomBookings.some(booking => booking.time === slotTime);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (clickedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return;

    if (selectedDates.length === 0) {
      setSelectedDates([clickedDate]);
    } else if (selectedDates.length === 1) {
      const [first] = selectedDates;
      if (clickedDate < first) {
        setSelectedDates([clickedDate, first]);
      } else {
        setSelectedDates([first, clickedDate]);
      }
    } else {
      setSelectedDates([clickedDate]);
    }
    setSelectedSlot(null);
  };

  const isInRange = (day) => {
    if (selectedDates.length === 2) {
      const [start, end] = selectedDates;
      const check = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      return check >= start && check <= end;
    }
    return false;
  };

  const isAvailable = (day, slotId) => {
    // Check if slot is booked
    if (isSlotBooked(day, slotId)) return false;

    // Additional availability logic based on day patterns
    if (day % 2 !== 0) {
      return slotId !== 3; // Evening slots less available on odd days
    } else {
      return slotId !== 1; // Morning slots less available on even days
    }
  };

  const getSlotStatus = (day, slotId) => {
    if (isSlotBooked(day, slotId)) return "full"; // already booked

    if (!isAvailable(day, slotId)) return "full";
    if (slotId === 2) return "limited";
    return "available";
  };

  const navigateTo = (path) => {
    if (typeof onNavigate === "function") {
      onNavigate(path);
    } else if (typeof window !== "undefined") {
      window.location.href = path;
    } else {
      console.warn("No navigate available — attempted to navigate to:", path);
    }
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDayOfMonth + 6) % 7;

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
    setSelectedDates([]);
    setSelectedSlot(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
    setSelectedDates([]);
    setSelectedSlot(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "limited": return "bg-yellow-500";
      case "full": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available": return "Available";
      case "limited": return "Limited";
      case "full": return "Booked";
      default: return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-start py-8 px-4 md:py-16 md:px-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Room Booking Calendar</h1>
          <p className="text-gray-300">
            {selectedRoom ? `Viewing availability for ${selectedRoom.name}` : 'Select a room to view availability'}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevMonth}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ← Previous
          </button>
          
          <h2 className="text-2xl font-semibold text-white">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          
          <button
            onClick={handleNextMonth}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-700">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {/* Empty cells for offset */}
            {Array.from({ length: startOffset }, (_, i) => (
              <div key={`empty-${i}`} className="p-3 border border-gray-200 bg-gray-50"></div>
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const isToday = date.toDateString() === today.toDateString();
              const isSelected = selectedDates.some(d => d.toDateString() === date.toDateString());
              const isInRangeSelected = isInRange(day);

              return (
                <div
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`
                    p-3 border border-gray-200 cursor-pointer transition-all
                    ${isToday ? 'bg-blue-100 border-blue-300' : ''}
                    ${isSelected ? 'bg-blue-200 border-blue-400' : ''}
                    ${isInRangeSelected ? 'bg-blue-50' : ''}
                    hover:bg-gray-50
                  `}
                >
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    {day}
                    {isToday && <span className="ml-1 text-blue-600">•</span>}
                  </div>

                  {/* Time slots for this day */}
                  <div className="space-y-1">
                    {timeSlots.map(slot => {
                      const status = getSlotStatus(day, slot.id);
                      return (
                        <div
                          key={slot.id}
                          className={`
                            text-xs p-1 rounded text-center text-white
                            ${getStatusColor(status)}
                            ${status === 'full' ? 'opacity-50' : ''}
                          `}
                          title={`${slot.label}: ${getStatusText(status)}`}
                        >
                          {slot.label.split('-')[0]}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-white">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span className="text-white">Limited</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-white">Booked</span>
            </div>
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigateTo('/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
