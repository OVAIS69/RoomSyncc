import React, { useState, useEffect } from 'react';
import { supportAPI } from '../services/api';
import { Mail, CheckCircle, Clock, X } from 'lucide-react';

interface SupportMessage {
    id: number;
    name: string;
    email: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

const AdminSupportPanel = () => {
    const [messages, setMessages] = useState<SupportMessage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const data = await supportAPI.getAll();
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch support messages', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await supportAPI.markAsRead(id);
            setMessages(messages.map(msg =>
                msg.id === id ? { ...msg, is_read: true } : msg
            ));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            await supportAPI.delete(id);
            setMessages(messages.filter(msg => msg.id !== id));
        } catch (error) {
            console.error('Failed to delete message', error);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-text-secondary italic">Loading messages...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-text-primary flex items-center gap-3">
                <Mail className="w-8 h-8 text-indigo-500" />
                Support Messages
            </h1>

            <div className="grid gap-4">
                {messages.length === 0 ? (
                    <div className="text-center py-12 bg-cyber-card rounded-xl border border-cyber-border">
                        <p className="text-text-secondary">No support messages found.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-6 rounded-2xl border transition-all duration-300 ${msg.is_read
                                ? 'bg-[var(--surface)] border-[var(--border)] opacity-80'
                                : 'bg-[var(--surface)] border-indigo-500 shadow-lg shadow-indigo-500/10'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">{msg.name}</h3>
                                    <p className="text-indigo-600 font-medium text-sm">{msg.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-text-secondary text-xs flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(msg.created_at).toLocaleString()}
                                    </span>
                                    {!msg.is_read && (
                                        <button
                                            onClick={() => markAsRead(msg.id)}
                                            className="px-3 py-1 bg-brand-vibrant-indigo hover:bg-opacity-90 text-white text-xs rounded-full transition-colors flex items-center gap-1 shadow-sm"
                                        >
                                            <CheckCircle className="w-3 h-3" />
                                            Mark as Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                                        title="Delete Message"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-[var(--bg-secondary)] p-5 rounded-xl text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap border border-[var(--border)]">
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminSupportPanel;
