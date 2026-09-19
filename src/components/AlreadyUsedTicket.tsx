import React from 'react';
import { AlertTriangle, History, User, CreditCard, ShieldAlert, Clock } from 'lucide-react';
import type { TicketData } from '../types/ticket';

interface AlreadyUsedTicketProps {
  ticket?: TicketData;
  eventName?: string;
  errorMessage?: string;
  timestamp: string;
  firstScannedAt?: string;
}

export const AlreadyUsedTicket: React.FC<AlreadyUsedTicketProps> = ({
  ticket,
  eventName,
  errorMessage,
  timestamp,
  firstScannedAt,
}) => {
  const displayMsg = errorMessage || (eventName ? `This ticket has already been scanned for ${eventName}.` : 'This ticket has already been scanned.');

  return (
    <div className="w-full max-w-sm mx-auto bg-blue-elevated rounded-3xl border-2 border-warning/70 shadow-2xl shadow-warning/20 p-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="relative mb-4">
        <div className="absolute -inset-3 bg-warning/30 rounded-full blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-full bg-warning/20 border-2 border-warning flex items-center justify-center text-warning shadow-inner">
          <AlertTriangle className="w-12 h-12 stroke-[2.5]" />
        </div>
      </div>

      <h2 className="text-3xl font-black text-warning tracking-wide uppercase">Ticket Already Used</h2>

      {eventName && (
        <div className="mt-2 px-4 py-1.5 rounded-full bg-blue-active border border-warning/40 text-warning text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <span>{eventName}</span>
        </div>
      )}

      <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-warning/20 border border-warning/40 text-warning text-xs font-semibold">
        <ShieldAlert className="w-4 h-4" />
        <span>Duplicate Entry Blocked</span>
      </div>

      <div className="w-full mt-6 space-y-4 bg-blue-surface/90 rounded-2xl p-4 border border-blue-medium text-left">
        <p className="text-base font-semibold text-white">{displayMsg}</p>

        {ticket && (
          <>
            <div className="h-px bg-blue-medium" />

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-full bg-blue-active border border-blue-medium text-warning mt-0.5 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider block">Registered Attendee</span>
                <span className="text-xl font-bold text-white block">{ticket.studentName}</span>
                {ticket.department && (
                  <span className="text-sm text-text-secondary block">{ticket.department}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-blue-active border border-blue-medium text-warning shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider block">Ticket ID</span>
                <span className="text-lg font-mono font-bold text-warning block">{ticket.ticketId}</span>
              </div>
            </div>
          </>
        )}

        <div className="h-px bg-blue-medium" />

        <div className="flex items-start gap-2 text-sm text-text-secondary bg-warning/10 p-3 rounded-2xl border border-warning/30">
          <History className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-semibold">Previous Scan Detected:</span>
            <span>Already scanned for entry into {eventName || 'this event'}. This ticket remains valid for other upcoming events.</span>
            {firstScannedAt && (
              <span className="font-mono text-warning mt-0.5">First scanned: {firstScannedAt}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-text-muted pt-1 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-text-secondary" />
            <span>Re-scanned: {timestamp}</span>
          </div>
          <span className="text-warning font-medium">Gate 1</span>
        </div>
      </div>
    </div>
  );
};