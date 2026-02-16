import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface NotificationProps {
  notification: { message: string; type: string } | null;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transform transition-all duration-300 ${
      notification.type === 'success' 
        ? 'bg-emerald-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center gap-2">
        {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        <span>{notification.message}</span>
      </div>
    </div>
  );
};

export default Notification;
