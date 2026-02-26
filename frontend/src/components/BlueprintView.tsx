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
      <h1 className="text-3xl font-bold mb-8 text-center text-[var(--text-primary)]">Interactive Campus Map</h1>

      {/* Time Slot Selector */}
      <div className="flex flex-col items-center mb-10 space-y-6">
        <div className="bg-[var(--surface)] shadow-md p-2 pl-6 pr-2 rounded-2xl border border-[var(--border)] flex flex-col sm:flex-row items-center gap-4">
          <span className="text-[var(--text-secondary)] font-bold whitespace-nowrap text-xs bg-[var(--bg-secondary)] px-4 py-2 rounded-xl border border-[var(--border)] uppercase tracking-widest">Temporal Context</span>

          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1.5 rounded-xl border border-[var(--border)]">
            <input
              type="date"
              className="bg-transparent text-[var(--text-primary)] text-sm px-4 py-2 focus:outline-none appearance-none min-w-[140px] [&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert-[0.8] [&::-webkit-calendar-picker-indicator]:cursor-pointer font-bold"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <div className="w-px h-6 bg-[var(--border)]"></div>
            <button
              onClick={() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                setSelectedDate(`${year}-${month}-${day}`);
              }}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${selectedDate === (() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
              })() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'}`}
            >
              Today
            </button>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-8 px-8 py-3 bg-[var(--surface)] shadow-sm rounded-full border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]"></div>
            <span className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em]">Available</span>
          </div>
          <div className="w-px h-4 bg-[var(--border)]"></div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"></div>
            <span className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em]">Partial</span>
          </div>
          <div className="w-px h-4 bg-[var(--border)]"></div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
            <span className="text-[var(--text-secondary)] text-[10px] font-black uppercase tracking-[0.2em]">Full</span>
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
          <div key={blockName} className="mb-12 bg-[var(--surface)] rounded-3xl p-8 border border-[var(--border)] animate-scale-in shadow-xl overflow-hidden relative group" style={{ animationDelay: `${index * 150}ms` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="flex flex-col lg:flex-row gap-10 items-start relative z-10">

              {/* Block Image / Illustration Placeholder */}
              <div className="w-full lg:w-1/3">
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border)] h-64 lg:h-full">
                  <div className={`bg-[var(--surface)] rounded-xl p-8 text-center text-[var(--text-primary)] border border-[var(--border)] shadow-sm h-full flex flex-col justify-center items-center`}>
                    <Building className={`w-28 h-28 mx-auto mb-6 text-indigo-500 drop-shadow-sm`} />
                    <h3 className="text-3xl font-black mb-1 text-[var(--text-primary)]">{blockName}</h3>
                    <p className={`text-indigo-600 font-bold text-xs uppercase tracking-[0.3em]`}>Structural Node</p>
                  </div>
                </div>
              </div>

              {/* Block Information */}
              <div className="w-full lg:w-2/3 space-y-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold mb-4 flex items-center justify-center lg:justify-start gap-3 text-[var(--text-primary)]">
                    <Building className={`w-8 h-8 text-${themeColor}-600`} />
                    {blockName}
                  </h2>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center border border-[var(--border)] shadow-sm">
                    <Users className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalCapacity}</p>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">Capacity</p>
                  </div>
                  <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center border border-[var(--border)] shadow-sm">
                    <Building className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalRooms}</p>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">Total Rooms</p>
                  </div>
                  <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center border border-[var(--border)] shadow-sm">
                    <ThemeIcon className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.labs}</p>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">Labs</p>
                  </div>
                  <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center border border-[var(--border)] shadow-sm">
                    <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.classrooms}</p>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">Classrooms</p>
                  </div>
                </div>

                {/* NOTE: "Key Features" section removed as per request */}

              </div>
            </div>

            <div className="mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">Available Rooms</h3>
                <div className="text-xs sm:text-sm font-medium text-[var(--text-secondary)]">
                  Total: {stats.totalRooms} rooms | Capacity: {stats.totalCapacity} people
                </div>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-1 sm:gap-2">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-1.5 sm:p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 text-center min-h-[45px] sm:min-h-[55px] md:min-h-[65px] flex flex-col items-center justify-center group/room relative overflow-hidden ${(() => {
                      const status = getRoomStatus(room.id);

                      if (status === 'fully_booked') return 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/50 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 shadow-sm';
                      if (status === 'partially_booked' || status === 'pending') return 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/50 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 shadow-sm';
                      return 'bg-[var(--surface)] border-[var(--border)] hover:border-indigo-500 hover:shadow-md text-[var(--text-primary)] shadow-sm';
                    })()
                      }`}
                  >
                    <div className="absolute inset-0 bg-[var(--text-primary)] opacity-0 group-hover/room:opacity-5 transition-opacity"></div>
                    <div className="text-[10px] sm:text-[11px] font-black truncate w-full relative z-10">{room.room_number || room.name}</div>
                    <div className="text-[8px] sm:text-[10px] opacity-70 mt-1 relative z-10 font-bold">{room.capacity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Campus Overview Footer */}
      <div className="mt-16 bg-[var(--surface)] rounded-[2.5rem] p-10 border border-[var(--border)] animate-slide-up shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
        <h2 className="text-3xl font-black mb-10 text-center text-[var(--text-primary)] tracking-tight">Campus Orchestration Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
          <div className="text-center group">
            <div className="bg-cyan-50 dark:bg-cyan-500/10 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Building className="w-10 h-10 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Total Buildings</h3>
            <p className="text-4xl font-black text-cyan-600 dark:text-cyan-400">{campusTotals.totalBuildings}</p>
            <p className="text-[var(--text-tertiary)] text-xs font-bold uppercase mt-1 tracking-widest">Active Structures</p>
          </div>
          <div className="text-center group">
            <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Users className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Total Capacity</h3>
            <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{campusTotals.totalCapacity}</p>
            <p className="text-[var(--text-tertiary)] text-xs font-bold uppercase mt-1 tracking-widest">Global Occupancy</p>
          </div>
          <div className="text-center group">
            <div className="bg-purple-50 dark:bg-purple-500/10 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Building className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Total Labs</h3>
            <p className="text-4xl font-black text-purple-600 dark:text-purple-400">{campusTotals.totalLabs}</p>
            <p className="text-[var(--text-tertiary)] text-xs font-bold uppercase mt-1 tracking-widest">Research Nodes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintView;
