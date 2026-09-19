import React from 'react';
import type { FestivalEvent } from '../types/event';
import { EventStatusBadge } from './EventStatusBadge';
import { Calendar, Clock, MapPin, Edit3, Archive, CheckCircle2 } from 'lucide-react';

interface EventCardProps {
  event: FestivalEvent;
  isCurrent: boolean;
  onEdit: (event: FestivalEvent) => void;
  onArchive: (event: FestivalEvent) => void;
  onUnarchive: (event: FestivalEvent) => void;
  onMakeCurrent?: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isCurrent,
  onEdit,
  onArchive,
  onUnarchive,
  onMakeCurrent,
}) => {
  return (
    <div
      className={`w-full rounded-2xl p-4 transition-all duration-200 border-2 ${
        isCurrent
          ? 'bg-gradient-to-br from-[#0f2759] to-[#0a152f] border-cyan-400/80 shadow-xl shadow-cyan-950/30'
          : 'bg-[#0a152f] border-blue-900/60 hover:border-blue-700/60 shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base sm:text-lg font-black text-white truncate">
              {event.name}
            </h4>
            <EventStatusBadge status={event.status} />
            {isCurrent && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-950">
                Selected for Scan
              </span>
            )}
          </div>

          <div className="mt-2 space-y-1 text-xs text-blue-200/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{event.date}</span>
              <span className="text-blue-600">•</span>
              <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                {event.startTime} {event.endTime ? `– ${event.endTime}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(event)}
            title="Edit Event"
            className="p-2.5 rounded-full bg-blue-900/50 hover:bg-blue-800/60 border border-blue-600/50 text-blue-200 hover:text-white transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Archive / Unarchive Button */}
          {event.status === 'active' ? (
            <button
              type="button"
              onClick={() => onArchive(event)}
              title="Archive Event"
              className="p-2.5 rounded-full bg-slate-800/60 hover:bg-rose-950/70 border border-slate-700 hover:border-rose-600/60 text-slate-300 hover:text-rose-300 transition-all"
            >
              <Archive className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onUnarchive(event)}
              title="Restore / Unarchive Event"
              className="p-2.5 rounded-full bg-emerald-950/70 hover:bg-emerald-900/70 border border-emerald-600/50 text-emerald-300 hover:text-emerald-100 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Select as Current Event Button if not current and active */}
      {!isCurrent && event.status === 'active' && onMakeCurrent && (
        <div className="mt-3 pt-2.5 border-t border-blue-900/40 flex justify-end">
          <button
            type="button"
            onClick={() => onMakeCurrent(event.id)}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-200 transition-colors flex items-center gap-1"
          >
            <span>Set as Current Scanning Event →</span>
          </button>
        </div>
      )}
    </div>
  );
};
