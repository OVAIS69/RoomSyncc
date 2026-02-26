import React, { useState, useEffect } from 'react';
import { bookingAPI, roomAPI } from '../services/api';
import {
    CheckCircle,
    X,
    Building,
    Calendar,
    Clock,
    User
} from 'lucide-react';
import BlueprintView from './BlueprintView';
import BookingModal from './BookingModal';
import RoomDetailsModal from './RoomDetailsModal';
import BookingDetailsModal from './BookingDetailsModal';

// Interfaces match backend
interface Booking {
    id: number;
    room_details: {
        room_number: string;
        room_type: string;
        block: string;
        capacity: number;
    };
    user_name: string;
    user_email: string;
    date: string;
    start_time: string;
    end_time: string;
    purpose: string;
    status: string;
    created_at: string;
}

interface RoomData {
    id: number;
    room_number: string;
    room_type: string;
    capacity: number;
    block: string;
    is_active: boolean;
    features?: string[];
}

interface BlockData {
    id: number;
    name: string;
}

interface AdminDashboardProps {
    activeView?: 'availability' | 'bookings' | 'rooms' | 'blocks';
    showNotification?: (message: string, type: 'success' | 'error') => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeView = 'availability', showNotification }) => {
    // State
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<RoomData[]>([]);
    const [blocks, setBlocks] = useState<BlockData[]>([]);

    const [loading, setLoading] = useState(true);
    const activeTab = activeView;

    // Scroll to top when tab changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    // Modal & Action State
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);
    const [newBlockName, setNewBlockName] = useState('');

    // Booking Integration State
    const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const [selectedTime, setSelectedTime] = useState('09:00-11:00');
    const [eventDetails, setEventDetails] = useState('');
    const [facultyEmail, setFacultyEmail] = useState(''); // New state for admin override

    // UI State
    const [bookingLoading, setBookingLoading] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);


    const [roomForm, setRoomForm] = useState({
        room_number: '',
        room_type: 'Lecture Hall',
        capacity: 30,
        block: '',
        is_active: true
    });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Filter Logic
    const [bookingFilter, setBookingFilter] = useState<'upcoming' | 'past'>('upcoming');

    const getFilteredBookings = () => {
        const now = new Date();
        return bookings.filter(booking => {
            const bookingDateTime = new Date(`${booking.date}T${booking.start_time}`);
            if (bookingFilter === 'upcoming') {
                return bookingDateTime >= now;
            } else {
                return bookingDateTime < now;
            }
        }).sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.start_time}`).getTime();
            const dateB = new Date(`${b.date}T${b.start_time}`).getTime();
            return bookingFilter === 'upcoming' ? dateA - dateB : dateB - dateA;
        });
    };

    const handleExportCSV = () => {
        const filtered = getFilteredBookings();
        const headers = ['Room Number', 'Block', 'Date', 'Start Time', 'End Time', 'User Name', 'User Email', 'Purpose', 'Status'];
        const csvContent = [
            headers.join(','),
            ...filtered.map(b => [
                b.room_details?.room_number,
                b.room_details?.block,
                b.date,
                b.start_time,
                b.end_time,
                b.user_name,
                b.user_email,
                `"${b.purpose.replace(/"/g, '""')}"`,
                b.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Initial Data Fetch
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // We fetch bookings and rooms to support the other tabs AND the blueprint view logic
            const [roomsData, blocksData, allBookingsData] = await Promise.all([
                roomAPI.getAll(),
                roomAPI.getBlocks(),
                bookingAPI.getAll()
            ]);

            setRooms(roomsData);
            setBlocks(blocksData);
            setBookings(allBookingsData);
        } catch (error: any) {
            internalShowNotification('Failed to load dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Specific Fetch based on refresh needs
    const fetchBookings = async () => {
        try {
            const data = await bookingAPI.getAll();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings');
        }
    };

    const fetchRooms = async () => {
        try {
            const data = await roomAPI.getAll();
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms');
        }
    };

    const fetchBlocks = async () => {
        try {
            const data = await roomAPI.getBlocks();
            setBlocks(data);
        } catch (error) {
            console.error('Error fetching blocks');
        }
    };

    const internalShowNotification = (message: string, type: 'success' | 'error' = 'success') => {
        if (showNotification) {
            showNotification(message, type);
        } else {
            setNotification({ message, type });
            setTimeout(() => setNotification(null), 3000);
        }
    };

    // --- Admin Booking Logic (Replica of RoomSync.tsx for Admin Panel) ---
    const getRoomStatus = (roomId: number, checkValue?: string) => {
        // Check if the passed value is a date (YYYY-MM-DD format)
        const isDateOverride = checkValue && /^\d{4}-\d{2}-\d{2}$/.test(checkValue);

        // Determine the date to check: either the override or the selectedDate state
        const dateToCheck = isDateOverride ? checkValue : selectedDate;

        const roomBookings = bookings.filter(
            (booking: any) => Number(booking.room) === roomId && booking.date === dateToCheck
        );

        // If checking a specific time slot (and it's NOT a date override)
        if (checkValue && !isDateOverride && checkValue !== 'All Day') {
            const [slotStart, slotEnd] = checkValue.split('-');
            const overlapping = roomBookings.filter((booking: any) => {
                const bStart = booking.start_time.substring(0, 5);
                const bEnd = booking.end_time.substring(0, 5);
                return bStart < slotEnd && slotStart < bEnd;
            });

            if (overlapping.length === 0) return 'available';
            if (overlapping.some((b: any) => b.status === 'pending')) return 'pending';
            return 'booked';
        }

        // Standard "Whole Day" status logic
        if (roomBookings.length === 0) return 'available';
        if (roomBookings.some((booking: any) => booking.status === 'pending')) return 'pending';

        // Standard "Whole Day" status logic
        if (roomBookings.length === 0) return 'available';

        // Calculate total booked minutes for 'All Day' status
        const totalMinutes = roomBookings.reduce((sum: number, b: any) => {
            // Assuming b.status === 'approved' check is already done or we simply count active ones logic above
            // Wait, duplicated logic filtered pending.
            // If pending is present, it returns 'pending' above.
            // So here we only have approved bookings (or pending if logic falls through, but it returns pending earlier).

            if (b.status === 'pending') return sum;

            const [startH, startM] = b.start_time.split(':').map(Number);
            const [endH, endM] = b.end_time.split(':').map(Number);

            const startInMins = startH * 60 + startM;
            const endInMins = endH * 60 + endM;

            return sum + (endInMins - startInMins);
        }, 0);

        // 5 hours = 5 * 60 = 300 minutes
        if (totalMinutes >= 300) return 'fully_booked';
        return 'partially_booked';
    };

    const handleBookRoom = async () => {
        console.log('DEBUG: handleBookRoom called. State facultyEmail:', facultyEmail);
        if (!selectedRoom || !eventDetails.trim()) {
            internalShowNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            const [startTime, endTime] = selectedTime.split('-');
            const bookingData: any = {
                room: Number(selectedRoom.id),
                date: selectedDate,
                start_time: startTime,
                end_time: endTime,
                purpose: eventDetails,
            };

            if (facultyEmail && facultyEmail.trim()) {
                console.log('DEBUG: facultyEmail is present:', facultyEmail);
                bookingData.faculty_email = facultyEmail.trim();
            } else {
                console.log('DEBUG: facultyEmail is empty or whitespace');
            }

            console.log('DEBUG: Sending booking data:', bookingData); // Debug log

            setBookingLoading(true); // Start loading
            await bookingAPI.create(bookingData);
            await fetchBookings(); // Refresh data

            setShowBookingModal(false);
            setSelectedRoom(null); // Close the details modal
            setEventDetails('');
            setFacultyEmail('');
            internalShowNotification('Room reserved successfully (Admin Override)');
        } catch (error: any) {
            internalShowNotification(error.message || 'Failed to book room', 'error');
        } finally {
            setBookingLoading(false); // Stop loading
        }
    };
    // --------------------------------------------------------------------

    // Booking Actions (Delete)
    const handleDeleteBooking = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this booking record?')) return;

        // Optimistic UI update: Remove immediately from view
        const previousBookings = [...bookings];
        const bookingToDelete = bookings.find(b => b.id === id);

        let successMessage = 'Booking record deleted'; // Default for past
        if (bookingToDelete) {
            const now = new Date();
            const bookingDateTime = new Date(`${bookingToDelete.date}T${bookingToDelete.end_time}`);
            if (bookingDateTime > now) {
                successMessage = 'Room cancelled successfully';
            }
        }

        setBookings(prev => prev.filter(b => b.id !== id));

        try {
            await bookingAPI.delete(id);
            internalShowNotification(successMessage);
            // Re-fetch to ensure sync, though optimistic update handles the visual
            fetchBookings();
        } catch (error: any) {
            // Revert on error
            setBookings(previousBookings);
            internalShowNotification(error.message || 'Failed to delete booking', 'error');
        }
    };

    // Block Actions
    const handleCreateBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBlockName.trim()) return;
        try {
            await roomAPI.createBlock(newBlockName);
            internalShowNotification('Block created successfully');
            setNewBlockName('');
            setShowBlockModal(false);
            fetchBlocks();
        } catch (error: any) {
            internalShowNotification(error.message || 'Failed to create block', 'error');
        }
    };

    const handleDeleteBlock = async (id: number) => {
        if (!window.confirm('Delete this block? Warning: This may affect rooms linked to it.')) return;
        try {
            await roomAPI.deleteBlock(id);
            internalShowNotification('Block deleted successfully');
            fetchBlocks();
        } catch (error: any) {
            internalShowNotification(error.message || 'Failed to delete block', 'error');
        }
    };

    // Room Actions
    const handleSaveRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...roomForm, block: parseInt(roomForm.block) };
            if (editingRoom) {
                await roomAPI.update(editingRoom.id, payload);
                internalShowNotification('Room updated successfully');
            } else {
                await roomAPI.create(payload);
                internalShowNotification('Room created successfully');
            }
            setShowRoomModal(false);
            fetchRooms();
        } catch (error: any) {
            internalShowNotification(error.message || 'Failed to save room', 'error');
        }
    };

    const handleDeleteRoom = async (id: number) => {
        if (!window.confirm('Confirm deletion of this room?')) return;
        try {
            await roomAPI.delete(id);
            internalShowNotification('Room removed successfully');
            fetchRooms();
        } catch (error: any) {
            internalShowNotification(error.message || 'Failed to delete room', 'error');
        }
    };

    const handleOpenRoomModal = (room?: RoomData) => {
        if (room) {
            setEditingRoom(room);
            const blockId = blocks.find(b => b.name === room.block)?.id || '';
            setRoomForm({
                room_number: room.room_number,
                room_type: room.room_type,
                capacity: room.capacity,
                block: blockId.toString(),
                is_active: room.is_active
            });
        } else {
            setEditingRoom(null);
            setRoomForm({
                room_number: '',
                room_type: 'Lecture Hall',
                capacity: 30,
                block: blocks.length > 0 ? blocks[0].id.toString() : '',
                is_active: true
            });
        }
        setShowRoomModal(true);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
            {/* Header */}
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Controls (Add Buttons only) */}
                <div className="flex justify-end mb-6">
                    <div className="flex gap-2">
                        {activeTab === 'blocks' && (
                            <button
                                onClick={() => setShowBlockModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                                Add Block
                            </button>
                        )}
                        {activeTab === 'rooms' && (
                            <button
                                onClick={() => handleOpenRoomModal()}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                                Add Room
                            </button>
                        )}
                    </div>
                </div>

                {/* Notification Toast */}
                {notification && !showNotification && (
                    <div className="fixed inset-0 flex items-center justify-center p-4 custom-alert" style={{ zIndex: 9999 }}>
                        <div className={`p-5 rounded-2xl shadow-2xl border backdrop-blur-md animate-scale-in ${notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600' : 'bg-red-500/10 border-red-500/50 text-red-600'}`}>
                            <div className="flex items-center gap-3 font-bold">
                                {notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <X className="w-6 h-6" />}
                                <span className="text-lg">{notification.message}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-xl min-h-[500px]">

                    {/* LIVE AVAILABILITY (BLUEPRINT) VIEW */}
                    {activeTab === 'availability' && (
                        <div className="p-4">
                            <BlueprintView
                                selectedRoom={selectedRoom}
                                setSelectedRoom={setSelectedRoom}
                                getRoomStatus={(roomId: string, timeSlot?: string) => getRoomStatus(Number(roomId), timeSlot)}
                                selectedDate={selectedDate}
                                setSelectedDate={setSelectedDate}
                            />
                        </div>
                    )}

                    {/* BOOKINGS VIEW */}
                    {activeTab === 'bookings' && (
                        <div className="p-6 space-y-6">
                            {/* Controls */}
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">
                                <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1 border border-[var(--border)]">
                                    <button
                                        onClick={() => setBookingFilter('upcoming')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${bookingFilter === 'upcoming'
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                            }`}
                                    >
                                        Upcoming
                                    </button>
                                    <button
                                        onClick={() => setBookingFilter('past')}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${bookingFilter === 'past'
                                            ? 'bg-indigo-600 text-white shadow-lg'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                            }`}
                                    >
                                        Past History
                                    </button>
                                </div>

                                <button
                                    onClick={handleExportCSV}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                                >
                                    Export Excel
                                </button>
                            </div>

                            {/* Bookings Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {getFilteredBookings().map((booking) => (
                                    <div
                                        key={booking.id}
                                        onClick={() => setSelectedBooking(booking)}
                                        className="group bg-brand-secondary/50 hover:bg-brand-secondary/80 border border-cyber-border hover:border-brand-vibrant-indigo/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 relative overflow-hidden shadow-sm"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Calendar className="w-32 h-32 rotate-12" />
                                        </div>

                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div>
                                                <h3 className="text-2xl font-bold text-text-primary mb-1">
                                                    {booking.room_details?.room_number}
                                                </h3>
                                                <span className="text-xs font-bold text-[var(--accent-indigo)] px-3 py-1 bg-[var(--accent-indigo)]/10 rounded-full border border-[var(--accent-indigo)]/20 uppercase tracking-tighter">
                                                    {booking.room_details?.block}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteBooking(booking.id);
                                                    }}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                                    title="Delete Booking"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3 relative z-10">
                                            <div className="flex items-center gap-3 text-text-secondary">
                                                <Calendar className="w-4 h-4 text-brand-accent" />
                                                <span className="font-medium">
                                                    {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-text-secondary">
                                                <Clock className="w-4 h-4 text-brand-accent" />
                                                <span className="font-bold bg-indigo-500/10 px-2 py-0.5 rounded text-indigo-600">
                                                    {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-text-secondary">
                                                <User className="w-4 h-4 text-brand-accent" />
                                                <span className="truncate">{booking.user_name}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-cyber-border relative z-10">
                                            <p className="text-sm text-text-secondary line-clamp-2 italic">
                                                "{booking.purpose}"
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {getFilteredBookings().length === 0 && (
                                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-[var(--text-tertiary)] border-2 border-dashed border-[var(--border)] rounded-2xl">
                                        <Calendar className="w-12 h-12 mb-4 opacity-50 text-[var(--accent-indigo)]" />
                                        <p className="text-xl font-bold">No {bookingFilter} bookings found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ... (Blocks View and Rooms View remain same) ... */}

                    {/* BLOCKS VIEW */}
                    {activeTab === 'blocks' && (
                        // ... (existing blocks table)
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border)] text-xs uppercase text-[var(--text-tertiary)] font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Block ID</th>
                                        <th className="px-6 py-4">Block Name</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {blocks.map((block) => (
                                        <tr key={block.id} className="hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border)]">
                                            <td className="px-6 py-4 text-[var(--text-secondary)] font-medium">#{block.id}</td>
                                            <td className="px-6 py-4 text-[var(--text-primary)] font-semibold">{block.name}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteBlock(block.id)}
                                                    className="text-red-400 hover:text-red-300 text-sm font-medium inline-flex items-center gap-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {blocks.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-[var(--text-tertiary)]">
                                                No blocks found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ROOMS VIEW */}
                    {activeTab === 'rooms' && (
                        // ... (existing rooms table)
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border)] text-xs uppercase text-[var(--text-tertiary)] font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Room Number</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4">Block</th>
                                            <th className="px-6 py-4">Capacity</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {rooms.map((room) => (
                                            <tr key={room.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                                                <td className="px-6 py-4 font-bold text-[var(--text-primary)]">{room.room_number}</td>
                                                <td className="px-6 py-4 text-[var(--text-secondary)]">{room.room_type}</td>
                                                <td className="px-6 py-4 text-[var(--text-secondary)]">{room.block}</td>
                                                <td className="px-6 py-4 text-[var(--text-secondary)] font-medium">{room.capacity} Seats</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${room.is_active ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                                                        }`}>
                                                        {room.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleOpenRoomModal(room)}
                                                            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteRoom(room.id)}
                                                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* ... (Modals) ... */}

            {/* Block Modal */}
            {showBlockModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center modal z-50 p-4">
                    <div className="bg-[var(--surface)] rounded-2xl p-8 max-w-md w-full border border-[var(--border)] shadow-2xl animate-scale-in">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-[var(--text-primary)]">Add New Block</h3>
                            <button onClick={() => setShowBlockModal(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateBlock} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Block Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newBlockName}
                                    onChange={(e) => setNewBlockName(e.target.value)}
                                    placeholder="e.g. M-Block"
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-[var(--text-tertiary)]"
                                />
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors">
                                    CREATE BLOCK
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Room Modal */}
            {showRoomModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center modal p-4">
                    <div className="bg-[var(--surface)] rounded-2xl p-6 max-w-md w-full border border-[var(--border)] shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
                            <button onClick={() => setShowRoomModal(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveRoom} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Room Number</label>
                                <input
                                    type="text"
                                    required
                                    value={roomForm.room_number}
                                    onChange={(e) => setRoomForm({ ...roomForm, room_number: e.target.value })}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Capacity</label>
                                    <input
                                        type="number"
                                        required
                                        value={roomForm.capacity}
                                        onChange={(e) => setRoomForm({ ...roomForm, capacity: parseInt(e.target.value) })}
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Block</label>
                                    <select
                                        value={roomForm.block}
                                        onChange={(e) => setRoomForm({ ...roomForm, block: e.target.value })}
                                        required
                                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="">Select...</option>
                                        {blocks.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Type</label>
                                <select
                                    value={roomForm.room_type}
                                    onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                                >
                                    <option value="Lecture Hall">Lecture Hall</option>
                                    <option value="Classroom">Classroom</option>
                                    <option value="Lab">Lab</option>
                                    <option value="Meeting Room">Meeting Room</option>
                                    <option value="Seminar Hall">Seminar Hall</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    checked={roomForm.is_active}
                                    onChange={(e) => setRoomForm({ ...roomForm, is_active: e.target.checked })}
                                    className="w-5 h-5 rounded border-[var(--border)] bg-[var(--bg-secondary)] text-indigo-600 focus:ring-indigo-500 transition-all"
                                />
                                <span className="text-sm font-medium text-[var(--text-secondary)]">Room Availability Active</span>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors">
                                    SAVE SETTINGS
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Room Details & Booking Modal (Integrated) */}
            <RoomDetailsModal
                selectedRoom={selectedRoom}
                setSelectedRoom={setSelectedRoom}
                bookings={bookings}
                userRole={'admin'} // Force admin role for this view to enable "Book" button if applicable
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
                rooms={rooms as any}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                facultyEmail={facultyEmail}
                setFacultyEmail={setFacultyEmail}
                userRole={'admin'}
                isLoading={bookingLoading}
            />

            {/* Booking Details Modal */}
            <BookingDetailsModal
                booking={selectedBooking}
                onClose={() => setSelectedBooking(null)}
            />

        </div>
    );
};

export default AdminDashboard;
