import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { roomAPI, bookingAPI } from '../services/api';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import BookingPage from './BookingPage';
import BlueprintView from './BlueprintView';
import AboutPage from './AboutPage';
import SupportPage from './SupportPage';
import CalendarView from './CalendarView';
import RoomDetailsModal from './RoomDetailsModal';
import BookingModal from './BookingModal';
import Notification from './Notification';
import Footer from './Footer';
import TermsPage from './TermsPage';
import PrivacyPage from './PrivacyPage';
import CookiePage from './CookiePage';
import LoginModal from './LoginModal';
import AdminDashboard from './AdminDashboard';
import AdminSupportPanel from './AdminSupportPanel';
import UserManagement from './UserManagement';

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

interface Booking {
  id: number;
  room: number;
  room_details?: any;
  user: number;
  user_name?: string;
  date: string;
  start_time: string;
  end_time: string;
  purpose: string;
  status: string;
}

const RoomSync = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('09:00-11:00');
  const [eventDetails, setEventDetails] = useState('');
  const [facultyEmail, setFacultyEmail] = useState(''); // New state for admin override
  const [loading, setLoading] = useState(true);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, user]);

  // Fetch rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomAPI.getAll();
        setRooms(data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        showNotification('Failed to load rooms', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Fetch bookings on mount and when date changes, with polling
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingAPI.getAll();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    fetchBookings(); // Initial fetch

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchBookings, 30000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBookRoom = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedRoom || !eventDetails.trim()) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }


    // Restrict booking to Admin only
    if (user.role !== 'admin') {
      showNotification('Only Admins can book rooms.', 'error');
      return;
    }

    try {
      // Parse time slot (e.g., "09:00-11:00")
      const [startTime, endTime] = selectedTime.split('-');

      // Add faculty_email to payload if provided
      const bookingData: any = {
        room: Number(selectedRoom.id), // Ensure it's a number
        date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        purpose: eventDetails,
      };

      if (facultyEmail.trim()) {
        bookingData.faculty_email = facultyEmail.trim();
      }

      await bookingAPI.create(bookingData);

      // Refresh bookings
      const updatedBookings = await bookingAPI.getAll();
      setBookings(updatedBookings);

      setShowBookingModal(false);
      setSelectedRoom(null); // Close the details modal to return to map
      setEventDetails('');
      setFacultyEmail(''); // Reset email
      showNotification('Room booked and confirmed! Confirmation email sent.');
    } catch (error: any) {
      showNotification(error.message || 'Failed to book room', 'error');
    }
  };

  const getRoomStatus = (roomId: number, timeSlot?: string) => {
    const roomBookings = bookings.filter(
      (booking) => booking.room === roomId && booking.date === selectedDate
    );

    // Filter out cancelled or rejected bookings
    const activeBookings = roomBookings.filter(b => b.status === 'approved' || b.status === 'pending');

    if (timeSlot && timeSlot !== 'All Day') {
      // NOTE: BlueprintView might pass a date string here by mistake if not updated, but we handle "HH:MM-HH:MM"
      // Check if timeSlot actually looks like a timeslot (must contain a colon)
      if (!timeSlot.includes(':')) return 'available';

      const [slotStart, slotEnd] = timeSlot.split('-');
      // Check for overlap: Start1 < End2 && Start2 < End1
      const overlapping = activeBookings.filter(booking => {
        const bStart = booking.start_time.substring(0, 5);
        const bEnd = booking.end_time.substring(0, 5);
        return bStart < slotEnd && slotStart < bEnd;
      });

      if (overlapping.length === 0) return 'available';
      if (overlapping.some(b => b.status === 'pending')) return 'pending';
      return 'booked';
    }

    if (activeBookings.length === 0) return 'available';

    // Calculate total booked minutes for 'All Day' status
    const totalMinutes = activeBookings.reduce((sum, b) => {
      // Assuming b.status === 'approved' check is already done or we simply count active ones logic above
      if (b.status !== 'approved') return sum;

      const [startH, startM] = b.start_time.split(':').map(Number);
      const [endH, endM] = b.end_time.split(':').map(Number);

      const startInMins = startH * 60 + startM;
      const endInMins = endH * 60 + endM;

      const duration = endInMins - startInMins;
      console.log(`[RoomSync Debug] Booking ${b.id}: ${b.start_time}-${b.end_time} (${duration} mins)`);
      return sum + duration;
    }, 0);

    console.log(`[RoomSync Debug] Room ${roomId} Total Minutes: ${totalMinutes}`);

    // 5 hours = 5 * 60 = 300 minutes
    if (totalMinutes >= 300) return 'fully_booked';
    return 'partially_booked'; // Yellow
  };

  const renderPage = () => {
    if (loading || authLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      );
    }

    // Guest Access Control
    // If user is not logged in, they can ONLY see 'dashboard'
    if (!user && currentPage !== 'dashboard' && currentPage !== 'about') {
      // Optional: You could redirect to 'dashboard' here or show restricted view
      // For now, let's show the Restricted View so they know why
      return (
        <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
          <div className="text-center p-8 rounded-2xl bg-gray-800/50 backdrop-blur-md border border-gray-700">
            <h2 className="text-2xl font-bold mb-2 text-white">Access Restricted</h2>
            <p className="text-gray-300 mb-4">You need to log in to access this page.</p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
            >
              Login Now
            </button>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            setCurrentPage={setCurrentPage}
            bookings={bookings}
            selectedDate={selectedDate}
            setSelectedRoom={setSelectedRoom}
            rooms={rooms}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'booking':
        // Double check login just in case
        if (!user) return null;
        return (
          <BookingPage
            userRole={user?.role || ''}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom as any}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            eventDetails={eventDetails}
            setEventDetails={setEventDetails}
            handleBookRoom={handleBookRoom}
            bookings={bookings as any}
          />
        );
      case 'room-availability':
        // Available to logged in users (Faculty/Student/Admin)
        return (
          <BlueprintView
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom as any}
            getRoomStatus={(roomId: string, timeSlot?: string) => getRoomStatus(Number(roomId), timeSlot)}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        );
      case 'support':
        // Available to logged in users
        return <SupportPage showNotification={showNotification} />;
      case 'admin-users':
        if (user?.role !== 'admin') return <Dashboard user={user} setCurrentPage={setCurrentPage} bookings={bookings} selectedDate={selectedDate} setSelectedRoom={setSelectedRoom} rooms={rooms} />;
        return <UserManagement />;
      case 'admin-support':
        if (user?.role !== 'admin') return <Dashboard user={user} setCurrentPage={setCurrentPage} bookings={bookings} selectedDate={selectedDate} setSelectedRoom={setSelectedRoom} rooms={rooms} />;
        return <AdminSupportPanel />;
      case 'calendar':
        // RESTRICTED: Faculty should NOT see this if they can't book
        // If requirement is "Faculty only can view different room avail", they use 'room-availability'
        // So 'calendar' might be effectively Admin only or removed for Faculty
        if (user?.role === 'faculty') {
          return (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center p-8 rounded-2xl bg-gray-800/50 backdrop-blur-md border border-gray-700">
                <h2 className="text-2xl font-bold mb-2 text-white">Access Denied</h2>
                <p className="text-gray-300">Faculty members use the 'Room Availability' view.</p>
                <button onClick={() => setCurrentPage('room-availability')} className="mt-4 text-indigo-400 hover:text-indigo-300 underline">Go to Room Availability</button>
              </div>
            </div>
          );
        }
        return (
          <CalendarView
            setCurrentPage={setCurrentPage}
            setSelectedDate={setSelectedDate}
            setSelectedTime={setSelectedTime}
            setSelectedRoom={setSelectedRoom as any}
            bookings={bookings as any}
          />
        );
      case 'terms':
        return <TermsPage setCurrentPage={setCurrentPage} />;
      case 'privacy':
        return <PrivacyPage setCurrentPage={setCurrentPage} />;
      case 'cookies':
        return <CookiePage setCurrentPage={setCurrentPage} />;
      case 'admin':
      case 'admin-availability':
      case 'admin-bookings':
      case 'admin-rooms':
      case 'admin-blocks':
        if (user?.role !== 'admin') {
          return (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center p-8 rounded-2xl bg-gray-800/50 backdrop-blur-md border border-gray-700">
                <h2 className="text-2xl font-bold mb-2 text-white">Access Denied</h2>
                <p className="text-gray-300">Only administrators can access this page.</p>
              </div>
            </div>
          );
        }
        const view = currentPage.startsWith('admin-') ? currentPage.replace('admin-', '') : 'availability';
        return <AdminDashboard activeView={view as any} />;
      default:
        return (
          <Dashboard
            user={user}
            setCurrentPage={setCurrentPage}
            bookings={bookings}
            selectedDate={selectedDate}
            setSelectedRoom={setSelectedRoom}
            rooms={rooms}
          />
        );
    }
  };

  return (
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        user={user}
        onLoginClick={() => setShowLoginModal(true)}
      />

      <main className="pb-8">
        <div key={currentPage} className="animate-fade-in">
          {renderPage()}
        </div>
      </main>

      {/* Modals */}
      <RoomDetailsModal
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        bookings={bookings}
        userRole={user?.role || ''}
        setShowBookingModal={setShowBookingModal}
        getRoomStatus={(roomId: string) => getRoomStatus(Number(roomId))}
      />
      <BookingModal
        showBookingModal={showBookingModal}
        setShowBookingModal={setShowBookingModal}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        eventDetails={eventDetails}
        setEventDetails={setEventDetails}
        handleBookRoom={handleBookRoom}
        rooms={rooms}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        facultyEmail={facultyEmail}
        setFacultyEmail={setFacultyEmail}
        userRole={user?.role || ''}
      />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* Notifications */}
      <Notification notification={notification} />

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default RoomSync;
