import React from 'react';
import { XCircle, AlertCircle, HelpCircle, Clock } from 'lucide-react';

interface InvalidTicketProps {
  eventName?: string;
  errorMessage?: string;
  timestamp: string;
}

export const InvalidTicket: React.FC<InvalidTicketProps> = ({
  eventName,
  errorMessage = 'Ticket not found in the festival registry.',
  timestamp,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-blue-elevated rounded-3xl border-2 border-invalid/70 shadow-2xl shadow-invalid/20 p-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="relative mb-4">
        <div className="absolute -inset-3 bg-invalid/30 rounded-full blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-full bg-invalid/20 border-2 border-invalid flex items-center justify-center text-invalid shadow-inner">
          <XCircle className="w-12 h-12 stroke-[2.5]" />
        </div>
      </div>

      <h2 className="text-3xl font-black text-invalid tracking-wide uppercase">Invalid Ticket</h2>

      {eventName && (
        <div className="mt-2 px-4 py-1.5 rounded-full bg-blue-active border border-invalid/40 text-invalid text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <span>{eventName}</span>
        </div>
      )}

      <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-invalid/20 border border-invalid/40 text-invalid text-xs font-semibold">
        <AlertCircle className="w-4 h-4" />
        <span>Access Denied</span>
      </div>

      <div className="w-full mt-6 space-y-4 bg-blue-surface/90 rounded-2xl p-4 border border-blue-medium text-left">
        <div className="space-y-1">
          <span className="text-[11px] font-medium text-invalid uppercase tracking-wider block">Reason</span>
          <p className="text-base font-semibold text-white">{errorMessage}</p>
        </div>

        <div className="h-px bg-blue-medium" />

        <div className="flex items-start gap-2.5 text-sm text-text-secondary bg-invalid/10 p-3 rounded-2xl border border-invalid/30">
          <HelpCircle className="w-5 h-5 text-invalid shrink-0 mt-0.5" />
          <span>
            Ask attendee to check their official KELI26 confirmation email or escort to the Help Desk.
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-text-muted pt-1 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-text-secondary" />
            <span>Attempted: {timestamp}</span>
          </div>
          <span className="text-invalid font-medium">Gate 1</span>
        </div>
      </div>
    </div>
  );
};