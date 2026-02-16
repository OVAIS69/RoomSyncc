import React from 'react';

interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  block: string;
}

interface RoomCardProps {
  room: Room;
  status: string;
  onClick: () => void;
  showCapacity?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, status, onClick, showCapacity = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-500';
      case 'booked': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'available': return 'border-emerald-500 bg-emerald-50';
      case 'pending': return 'border-yellow-500 bg-yellow-50';
      case 'booked': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${getStatusStyles(status)} bg-opacity-10 shadow-md hover:shadow-lg`}
    >
      <div className="text-center">
        <p className="font-bold text-gray-900">{room.name}</p>
        <p className="text-sm text-gray-600 capitalize">{room.type}</p>
        {showCapacity && <p className="text-xs text-gray-500">Cap: {room.capacity}</p>}
        <div className={`w-3 h-3 rounded-full mx-auto mt-2 ${getStatusColor(status)}`}></div>
      </div>
    </div>
  );
};

export default RoomCard;
