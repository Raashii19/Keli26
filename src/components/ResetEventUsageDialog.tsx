import React, { useState } from 'react';
import type { FestivalEvent } from '../types/event';
import { RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ResetEventUsageDialogProps {
  event: FestivalEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: (eventId: string) => { resetCount: number; eventName: string };
}

export const ResetEventUsageDialog: React.FC<ResetEventUsageDialogProps> = ({
  event,
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [successInfo, setSuccessInfo] = useState<{ count: number; name: string } | null>(null);

  if (!isOpen || !event) return null;

  const handleReset = () => {
    const res = onConfirmReset(event.id);
    setSuccessInfo({ count: res.resetCount, name: res.eventName });
  };

  const handleClose = () => {
    setSuccessInfo(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-[#0a152f] border-2 border-rose-500/50 shadow-2xl shadow-blue-950 p-6 flex flex-col items-center text-center">
        {successInfo ? (
          /* Success State */
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-4">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h3 className="text-xl font-black text-emerald-400 uppercase tracking-wide">
              Event Usage Reset
            </h3>

            <div className="my-2.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-cyan-300 text-xs font-bold">
              {successInfo.name}
            </div>

            <p className="text-xs text-blue-200/90 leading-relaxed mt-1">
              Tickets are ready to be scanned again for <strong>{successInfo.name}</strong>.
            </p>

            <span className="text-[11px] text-blue-400/80 font-mono mt-2 block">
              {successInfo.count} ticket usage records cleared. Other festival events remain untouched.
            </span>

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 font-black text-sm transition-transform active:scale-95"
            >
              Continue Scanning
            </button>
          </div>
        ) : (
          /* Confirmation Prompt */
          <>
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center text-rose-400 mb-4 shadow-inner">
              <RotateCcw className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-wide">
              Reset Event Usage?
            </h3>

            <div className="my-3 px-3.5 py-1 rounded-full bg-blue-950 border border-blue-800 text-cyan-300 text-xs font-bold">
              Current Event: {event.name}
            </div>

            <p className="text-xs text-blue-200/80 leading-relaxed max-w-xs">
              All ticket usage records for <strong>{event.name}</strong> will be marked as unused. Ticket and student information will <strong>NOT</strong> be deleted.
            </p>

            <div className="w-full mt-3 p-3 rounded-2xl bg-rose-950/40 border border-rose-700/40 flex items-start gap-2 text-left text-[11px] text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                Resetting <strong>{event.name}</strong> will NOT reset Inauguration, Workshop, or any other festival event.
              </span>
            </div>

            {/* Buttons */}
            <div className="w-full mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 px-4 rounded-2xl bg-blue-950 hover:bg-blue-900/60 border border-blue-800 text-blue-200 font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-sm shadow-lg shadow-rose-950 transition-transform active:scale-95"
              >
                Reset Usage
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
