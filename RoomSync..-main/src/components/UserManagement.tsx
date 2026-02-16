import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import { Users, CheckCircle, X, User } from 'lucide-react';

interface UserData {
    id: number;
    username: string;
    email: string;
    role: string;
    first_name?: string;
    last_name?: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editRole, setEditRole] = useState<string>('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUserForm, setNewUserForm] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        role: 'faculty',
        first_name: '',
        last_name: ''
    });

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchUsers = async () => {
        try {
            const data = await usersAPI.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
            showNotification('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await usersAPI.delete(id);
            setUsers(users.filter(u => u.id !== id));
            showNotification('User deleted successfully');
        } catch (error: any) {
            showNotification(error.message || 'Failed to delete user', 'error');
        }
    };

    const startEdit = (user: UserData) => {
        setEditingId(user.id);
        setEditRole(user.role);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditRole('');
    };

    const saveRole = async (id: number) => {
        try {
            await usersAPI.updateRole(id, editRole);
            setUsers(users.map(u => u.id === id ? { ...u, role: editRole } : u));
            setEditingId(null);
            showNotification('User role updated successfully');
        } catch (error: any) {
            showNotification(error.message || 'Failed to update role', 'error');
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newUserForm.password !== newUserForm.password_confirm) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        try {
            const response = await usersAPI.create(newUserForm);
            setUsers([...users, response.user]);
            setShowCreateModal(false);
            setNewUserForm({
                username: '',
                email: '',
                password: '',
                password_confirm: '',
                role: 'faculty',
                first_name: '',
                last_name: ''
            });
            showNotification('User created successfully');
        } catch (error: any) {
            const msg = error.message || 'Failed to create user';
            if (typeof error === 'object' && error !== null && !error.message) {
                showNotification('Please check the form for errors', 'error');
            } else {
                showNotification(msg, 'error');
            }
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-400">Loading users...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {notification && (
                <div className={`fixed top-24 right-8 z-50 p-4 rounded-lg shadow-lg border animate-fade-in-down ${notification.type === 'success' ? 'bg-green-900/90 border-green-500 text-white' : 'bg-red-900/90 border-red-500 text-white'
                    }`}>
                    {notification.message}
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Users className="w-8 h-8 text-indigo-500" />
                    User Management
                </h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20"
                >
                    <User className="w-5 h-5" />
                    Add User
                </button>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 border-b border-gray-700 text-xs uppercase text-gray-400 font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-700/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{user.username}</div>
                                                <div className="text-xs text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === user.id ? (
                                            <select
                                                value={editRole}
                                                onChange={(e) => setEditRole(e.target.value)}
                                                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                            >
                                                <option value="faculty">Faculty</option>
                                            </select>
                                        ) : (
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${user.role === 'admin' ? 'bg-purple-900/50 text-purple-400' :
                                                user.role === 'faculty' ? 'bg-blue-900/50 text-blue-400' :
                                                    'bg-gray-700 text-gray-300'
                                                }`}>
                                                <User className="w-3 h-3" />
                                                {user.role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-400">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {editingId === user.id ? (
                                                <>
                                                    <button
                                                        onClick={() => saveRole(user.id)}
                                                        className="p-1.5 text-green-400 hover:bg-green-900/30 rounded-lg transition-colors"
                                                        title="Save"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="p-1.5 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEdit(user)}
                                                        className="p-1.5 text-indigo-400 hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                        title="Edit Role"
                                                    >
                                                        <User className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-1.5 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full border border-gray-700 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Add New User</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUserForm.username}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={newUserForm.email}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={newUserForm.first_name}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, first_name: e.target.value })}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={newUserForm.last_name}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, last_name: e.target.value })}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newUserForm.password}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newUserForm.password_confirm}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, password_confirm: e.target.value })}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                                    <select
                                        value={newUserForm.role}
                                        onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="faculty">Faculty</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors">
                                    CREATE USER
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
