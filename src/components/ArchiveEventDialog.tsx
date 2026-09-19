import React from 'react';
import type { FestivalEvent } from '../types/event';
import { Archive, AlertTriangle } from 'lucide-react';

interface ArchiveEventDialogProps {
  event: FestivalEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (eventId: string) => void;
}

export const ArchiveEventDialog: React.FC<ArchiveEventDialogProps> = ({
  event,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-[#0a152f] border-2 border-amber-500/50 shadow-2xl shadow-blue-950 p-6 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
          <Archive className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-black text-white uppercase tracking-wide">
          Archive this event?
        </h3>

        <div className="my-3 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-cyan-300 text-xs font-bold">
          {event.name}
        </div>

        <p className="text-xs text-blue-200/80 leading-relaxed max-w-xs">
          This event will no longer be available for new scans, but its ticket usage history will be preserved.
        </p>

        <div className="w-full mt-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-600/30 flex items-start gap-2 text-left text-[11px] text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>You can restore or view this event at any time from the Event Management screen.</span>
        </div>

        {/* Buttons */}
        <div className="w-full mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl bg-blue-950 hover:bg-blue-900/60 border border-blue-800 text-blue-200 font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(event.id);
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-950 transition-transform active:scale-95"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
};
