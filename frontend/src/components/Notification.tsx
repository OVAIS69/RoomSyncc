import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface NotificationProps {
  notification: { message: string; type: string } | null;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  const mountNode = document.getElementById('notification-root') || document.body;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 animate-fade-in custom-alert"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        pointerEvents: 'auto'
      }}
    >
      <div
        className={`w-full max-w-md p-10 rounded-[2.5rem] border-2 shadow-[0_40px_100px_rgba(0,0,0,1)] animate-scale-in text-center ${notification.type === 'success'
          ? 'bg-[#0a1510]/95 border-emerald-500 text-emerald-50'
          : 'bg-[#1a0a0a]/95 border-red-500 text-red-50'
          }`}
      >
        <div className={`mx-auto w-24 h-24 rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-2xl ${notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
          {notification.type === 'success' ? <CheckCircle size={56} /> : <AlertCircle size={56} />}
        </div>

        <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">
          {notification.type === 'success' ? 'Nexus Success' : 'Nexus Alert'}
        </h3>

        <p className="text-xl opacity-90 mb-10 leading-relaxed font-medium">
          {notification.message}
        </p>

        <button
          onClick={onClose}
          className={`w-full py-5 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-2xl ${notification.type === 'success'
            ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 hover:shadow-emerald-500/20'
            : 'bg-red-500 hover:bg-red-400 text-red-950 hover:shadow-red-500/20'
            }`}
        >
          {notification.type === 'success' ? 'Continue' : 'Acknowledge Error'}
        </button>
      </div>
    </div>,
    mountNode
  );
};

export default Notification;
