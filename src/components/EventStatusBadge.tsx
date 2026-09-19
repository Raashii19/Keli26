import React from 'react';
import type { EventStatus } from '../types/event';

interface EventStatusBadgeProps {
  status: EventStatus;
}

export const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({ status }) => {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-800/80 border border-slate-700/60 text-slate-400">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
      Archived
    </span>
  );
};
