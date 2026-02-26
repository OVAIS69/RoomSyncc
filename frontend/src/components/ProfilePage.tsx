import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

interface ProfilePageProps {
    setCurrentPage: (page: string) => void;
    showNotification: (message: string, type?: 'success' | 'error') => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setCurrentPage, showNotification }) => {
    const { user, login } = useAuth();

    const [formData, setFormData] = useState({
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        password: '',
        confirmPassword: '',
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ? `http://localhost:8000${user.avatar}` : null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.first_name || '',
                lastName: user.last_name || '',
            }));
            setAvatarPreview(user.avatar ? `http://localhost:8000${user.avatar}` : null);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            showNotification("Passwords do not match", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = new FormData();
            if (formData.firstName !== user?.first_name) data.append('first_name', formData.firstName);
            if (formData.lastName !== user?.last_name) data.append('last_name', formData.lastName);
            if (formData.password) data.append('password', formData.password);
            if (avatarFile) data.append('avatar', avatarFile);

            let changed = false;
            if (formData.firstName !== user?.first_name ||
                formData.lastName !== user?.last_name ||
                formData.password ||
                avatarFile) {
                changed = true;
            }

            if (!changed) {
                showNotification("No changes to save.", "error");
                setIsSubmitting(false);
                return;
            }

            await authAPI.updateProfile(data);

            showNotification("Profile updated successfully!");
            window.location.reload();

        } catch (error: any) {
            console.error(error);
            showNotification(error.message || "Failed to update profile", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in pb-20">

            {/* Header Area */}
            <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
                    Your Profile
                </h1>
                <p className="text-lg text-[var(--text-secondary)]">Manage your account details and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-xl relative overflow-hidden flex flex-col items-center text-center">

                        <div className="relative group cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-[var(--surface)] shadow-2xl relative">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="User Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-blue-50 flex items-center justify-center">
                                        <User size={48} className="text-indigo-400" />
                                    </div>
                                )}

                                {/* Upload Overlay */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white text-sm font-bold">Upload</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                            {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                        </h2>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold capitalize mb-4">
                            <span>{user.role}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                            <Mail size={16} />
                            <span className="text-sm">{user.email}</span>
                        </div>
                    </div>

                    {/* Admin Specific Action Box */}
                    {user.role === 'admin' && (
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] p-6 text-white shadow-xl shadow-emerald-500/20">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Admin Controls</h3>
                            </div>
                            <p className="text-emerald-50 text-sm mb-6">
                                Access the underlying Django framework dashboard for advanced database management.
                            </p>
                            <a
                                href="http://localhost:8000/admin/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center space-x-2 w-full py-3 bg-white text-emerald-700 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <span>Open Django Admin &rarr;</span>
                            </a>
                        </div>
                    )}
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-[var(--surface)] border border-[var(--border)] rounded-[2rem] p-8 shadow-xl">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
                            <User className="mr-3 text-indigo-500" />
                            Edit Profile details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-secondary)]">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                    placeholder="John"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-secondary)]">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mb-8 opacity-60">
                            <label className="text-sm font-semibold text-[var(--text-secondary)]">Email Address (Read-only)</label>
                            <input
                                type="email"
                                readOnly
                                value={user.email}
                                className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-secondary)] cursor-not-allowed"
                            />
                            <p className="text-xs text-[var(--text-secondary)] mt-1 ml-1">To change your email address, please contact support.</p>
                        </div>

                        <hr className="border-[var(--border)] mb-8" />

                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
                            Update Password
                        </h3>

                        <div className="space-y-6 mb-10">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-secondary)]">New Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-secondary)]">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-[var(--border)]">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center space-x-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:-translate-y-1"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
