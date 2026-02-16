import React from 'react';
import { X, Calendar, Clock, User, Mail, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface BookingDetailsModalProps {
    booking: any | null;
    onClose: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose }) => {
    if (!booking) return null;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'text-green-400 bg-green-400/10';
            case 'pending': return 'text-yellow-400 bg-yellow-400/10';
            case 'rejected': return 'text-red-400 bg-red-400/10';
            case 'cancelled': return 'text-gray-400 bg-gray-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return <CheckCircle className="w-5 h-5" />;
            case 'pending': return <Clock className="w-5 h-5" />;
            case 'rejected': return <AlertCircle className="w-5 h-5" />; // XCircle not available
            case 'cancelled': return <AlertCircle className="w-5 h-5" />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-700 overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="bg-gray-700/50 px-6 py-4 flex justify-between items-start border-b border-gray-700">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            Booking Details
                            <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                                {getStatusIcon(booking.status)}
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">ID: #{booking.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* User Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">User Information</h3>
                            <div className="bg-gray-700/30 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Name</p>
                                        <p className="text-white font-medium">
                                            {booking.faculty_email ? 'Faculty Member' : booking.user_name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Email</p>
                                        <p className="text-white font-medium">
                                            {booking.faculty_email || booking.user_email}
                                        </p>
                                        {booking.faculty_email && (
                                            <p className="text-[10px] text-indigo-400 flex items-center gap-1 mt-0.5">
                                                <AlertCircle className="w-3 h-3" />
                                                Booked by Admin
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Room Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Room Information</h3>
                            <div className="bg-gray-700/30 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Room</p>
                                        <p className="text-white font-medium">
                                            {booking.room_details?.room_number} <span className="text-gray-500 text-sm">({booking.room_details?.room_type})</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                                        <MapPin className="w-5 h-5" /> {/* Building icon not available */}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Block</p>
                                        <p className="text-white font-medium">{booking.room_details?.block}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Time & Purpose */}
                    <div className="bg-gray-700/30 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Date</p>
                                <p className="text-white font-medium">{booking.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Time</p>
                                <p className="text-white font-medium">{booking.start_time} - {booking.end_time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 md:col-span-1">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                <AlertCircle className="w-5 h-5" /> {/* Tag icon not available */}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Purpose</p>
                                <p className="text-white font-medium truncate" title={booking.purpose}>{booking.purpose}</p>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="border-t border-gray-700 pt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                        <p>Created: {new Date(booking.created_at).toLocaleString()}</p>
                        {booking.approved_by && (
                            <p>Approved By: {booking.approved_by_name || 'Admin'}</p>
                        )}
                        {booking.approved_at && (
                            <p>Approved At: {new Date(booking.approved_at).toLocaleString()}</p>
                        )}
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="bg-gray-700/50 px-6 py-4 flex justify-end gap-3 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors font-medium"
                    >
                        Close
                    </button>
                    {/* Add more actions here if needed, like Reject/Approve/Cancel */}
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;
