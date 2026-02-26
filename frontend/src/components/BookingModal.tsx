import React from 'react';
import { X, Calendar, Clock, Mail, MessageSquare } from 'lucide-react';

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

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const startHour = parseInt((selectedTime.split('-')[0] || '09:00').split(':')[0]);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999] bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[var(--surface)] rounded-[2rem] p-6 max-w-2xl w-full max-h-[95vh] overflow-x-hidden overflow-y-auto shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative border border-[var(--border)]">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full">
                Professional Booking
              </span>
            </div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight leading-none">
              Booking <br />
              <span className="text-indigo-600">Room {selectedRoom?.room_number || selectedRoom?.name || ''}</span>
            </h2>
          </div>
          <button
            onClick={() => setShowBookingModal(false)}
            className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <div className="w-full">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date & Time Column */}
              <div className="space-y-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-indigo-600" />
                    <label className="text-sm font-bold text-[var(--text-primary)]">Booking Date</label>
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={18} className="text-indigo-600" />
                    <label className="text-sm font-bold text-[var(--text-primary)]">Time Interval (Start - End)</label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                        className="w-full pl-4 pr-12 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] font-bold">:00</span>
                    </div>
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
                        className="w-full pl-4 pr-12 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] font-bold">:00</span>
                    </div>
                  </div>
                  {(new Date(selectedDate).toDateString() === new Date().toDateString()) &&
                    (startHour < currentHour || (startHour === currentHour && currentMinute > 0)) && (
                      <p className="text-red-500 text-xs font-bold mt-3 animate-pulse">⚠️ Start time is in the past</p>
                    )}
                </div>
              </div>

              {/* Details Column */}
              <div className="space-y-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail size={18} className="text-indigo-600" />
                    <label className="text-sm font-bold text-[var(--text-primary)]">Contact Reference</label>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter email (optional)"
                    value={facultyEmail}
                    onChange={(e) => setFacultyEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-[var(--text-tertiary)]"
                  />
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-indigo-600" />
                    <label className="text-sm font-bold text-[var(--text-primary)]">Purpose of Booking</label>
                  </div>
                  <textarea
                    value={eventDetails}
                    onChange={(e) => setEventDetails(e.target.value)}
                    placeholder="Description..."
                    rows={2}
                    className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-[var(--text-tertiary)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] py-3 rounded-xl font-bold border border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBookRoom}
                disabled={isLoading || (new Date(selectedDate).toDateString() === new Date().toDateString() && (startHour < currentHour || (startHour === currentHour && currentMinute > 0)))}
                className={`flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-black text-lg shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transform transition-all duration-300 ${isLoading ? 'opacity-70 cursor-wait' : 'hover:-translate-y-1'}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Securing Space...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
