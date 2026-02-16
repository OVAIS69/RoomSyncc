import React, { useState, useEffect } from 'react';
import { Building, Users } from 'lucide-react';
import { roomAPI } from '../services/api';

interface BlueprintViewProps {
  selectedRoom: any;
  setSelectedRoom: (room: any) => void;
  getRoomStatus: (roomId: string, timeSlot?: string) => string;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const BlueprintView: React.FC<BlueprintViewProps> = ({
  selectedRoom,
  setSelectedRoom,
  getRoomStatus,
  selectedDate,
  setSelectedDate
}) => {
  // Local state for blockData, loading, error...

  const [blockData, setBlockData] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlueprintData();
  }, []);

  const fetchBlueprintData = async () => {
    try {
      setLoading(true);
      const data = await roomAPI.getByBlock();
      // data structure expected: { "X-Block": [rooms...], "Y-Block": [rooms...] }
      setBlockData(data);
    } catch (err) {
      setError('Failed to load blueprint data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate stats safely
  const calculateStats = (rooms: any[]) => {
    const totalRooms = rooms.length;
    const totalCapacity = rooms.reduce((sum, room) => sum + (room.capacity || 0), 0);
    const labs = rooms.filter(room => room.room_type?.toLowerCase().includes('lab')).length;
    const classrooms = rooms.filter(room => room.room_type?.toLowerCase().includes('class')).length;
    const seminarHalls = rooms.filter(room => room.room_type?.toLowerCase().includes('seminar')).length;

    return { totalRooms, totalCapacity, labs, classrooms, seminarHalls };
  };

  // Calculate Campus Totals
  const campusTotals = Object.values(blockData).reduce((acc, rooms) => {
    const stats = calculateStats(rooms);
    return {
      totalBuildings: acc.totalBuildings + 1,
      totalCapacity: acc.totalCapacity + stats.totalCapacity,
      totalLabs: acc.totalLabs + stats.labs
    };
  }, { totalBuildings: 0, totalCapacity: 0, totalLabs: 0 });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>Error: {error}</p>
        <button onClick={fetchBlueprintData} className="mt-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-white">Retry</button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Interactive Campus Map</h1>

      {/* Time Slot Selector */}
      <div className="flex flex-col items-center mb-10 space-y-4">
        <div className="bg-gray-800/80 backdrop-blur-md p-2 pl-6 pr-2 rounded-2xl border border-gray-700 flex flex-col sm:flex-row items-center gap-4 shadow-xl">
          <span className="text-gray-300 font-medium whitespace-nowrap text-sm bg-gray-700/50 px-3 py-1.5 rounded-lg border border-gray-600/50">Check Availability For</span>

          <div className="flex items-center gap-2 bg-gray-900/50 p-1 rounded-xl border border-gray-700/50">
            <input
              type="date"
              className="bg-transparent text-white text-sm px-4 py-2 focus:outline-none appearance-none min-w-[140px] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.8] [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <div className="w-px h-6 bg-gray-700"></div>
            <button
              onClick={() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                setSelectedDate(`${year}-${month}-${day}`);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedDate === (() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
              })() ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
            >
              Today
            </button>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-6 px-6 py-2 bg-black/20 rounded-full border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Available</span>
          </div>
          <div className="w-px h-3 bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Partially Booked</span>
          </div>
          <div className="w-px h-3 bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Fully Booked</span>
          </div>
        </div>
      </div>

      {/* Dynamic Blocks Rendering */}
      {Object.keys(blockData).map((blockName, index) => {
        const rooms = blockData[blockName];
        const stats = calculateStats(rooms);
        const isEven = index % 2 === 0;

        // Dynamic styling based on index/block
        const themeColor = isEven ? 'indigo' : 'emerald';
        const ThemeIcon = isEven ? Building : Users;

        return (
          <div key={blockName} className="mb-12 bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-scale-in" style={{ animationDelay: `${index * 150}ms` }}>
            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* Block Image / Illustration Placeholder */}
              <div className="w-full lg:w-1/3">
                <div className="bg-gray-700 rounded-xl p-4 border border-gray-600 h-full">
                  <div className={`bg-gradient-to-br from-${themeColor}-900 to-gray-900 rounded-lg p-8 text-center text-white border-2 border-dashed border-${themeColor}-500 h-full flex flex-col justify-center items-center`}>
                    <Building className={`w-24 h-24 mx-auto mb-4 text-${themeColor}-300`} />
                    <h3 className="text-2xl font-bold mb-2">{blockName}</h3>
                    <p className={`text-${themeColor}-200 mb-4`}>Campus Building</p>
                  </div>
                </div>
              </div>

              {/* Block Information */}
              <div className="w-full lg:w-2/3 space-y-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold mb-4 flex items-center justify-center lg:justify-start gap-3 text-white">
                    <Building className={`w-8 h-8 text-${themeColor}-600`} />
                    {blockName}
                  </h2>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 text-center border border-gray-600">
                    <Users className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
                    <p className="text-2xl font-bold text-white">{stats.totalCapacity}</p>
                    <p className="text-sm text-gray-300">Capacity</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center border border-gray-600">
                    <Building className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                    <p className="text-2xl font-bold text-white">{stats.totalRooms}</p>
                    <p className="text-sm text-gray-300">Total Rooms</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center border border-gray-600">
                    <ThemeIcon className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                    <p className="text-2xl font-bold text-white">{stats.labs}</p>
                    <p className="text-sm text-gray-300">Labs</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center border border-gray-600">
                    <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <p className="text-2xl font-bold text-white">{stats.classrooms}</p>
                    <p className="text-sm text-gray-300">Classrooms</p>
                  </div>
                </div>

                {/* NOTE: "Key Features" section removed as per request */}

              </div>
            </div>

            {/* Room Grid */}
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Available Rooms</h3>
                <div className="text-xs sm:text-sm text-gray-400">
                  Total: {stats.totalRooms} rooms | Capacity: {stats.totalCapacity} people
                </div>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-1 sm:gap-2">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-1 sm:p-2 rounded-md sm:rounded-lg border cursor-pointer transition-all duration-200 text-center min-h-[40px] sm:min-h-[50px] md:min-h-[60px] flex flex-col items-center justify-center ${(() => {
                      const status = getRoomStatus(room.id); // Here selectedDate acts as "All Day" or might be time slot if selectedDate was time? Wait. BlueprintView uses date picker, so it passes YYYY-MM-DD. RoomSync logic now handles this gracefully (returns status for full day).

                      if (status === 'fully_booked') return 'bg-red-900/50 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)] text-red-100';
                      // partially_booked OR pending -> Yellow
                      if (status === 'partially_booked' || status === 'pending') return 'bg-yellow-900/50 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)] text-yellow-100';
                      // available or anything else -> Green
                      return 'bg-emerald-900/50 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] hover:bg-emerald-800/50 text-emerald-100';
                    })()
                      }`}
                  >
                    <div className="text-[10px] sm:text-xs font-medium truncate w-full">{room.room_number || room.name}</div>
                    <div className="text-[8px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">{room.capacity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Campus Overview Footer */}
      <div className="mt-12 bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-slide-up delay-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Campus Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-indigo-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Total Buildings</h3>
            <p className="text-3xl font-bold text-indigo-400">{campusTotals.totalBuildings}</p>
            <p className="text-gray-400 text-sm">Active Blocks</p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Total Capacity</h3>
            <p className="text-3xl font-bold text-emerald-400">{campusTotals.totalCapacity}</p>
            <p className="text-gray-400 text-sm">Students & Staff</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Total Labs</h3>
            <p className="text-3xl font-bold text-purple-400">{campusTotals.totalLabs}</p>
            <p className="text-gray-400 text-sm">Research & Practical</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintView;
