import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-extrabold mt-2 text-[var(--text-primary)]">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
