import React from 'react';
import { CheckCircle2, User, CreditCard, Award, Clock, ShieldCheck } from 'lucide-react';
import type { TicketData } from '../types/ticket';

interface ValidTicketProps {
  ticket?: TicketData;
  eventName?: string;
  timestamp: string;
}

export const ValidTicket: React.FC<ValidTicketProps> = ({
  ticket = {
    ticketId: 'KELI26-001',
    studentName: 'Muhammed Rashid',
    department: 'Computer Science & Engineering',
    passType: 'General',
  },
  eventName,
  timestamp,
}) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-blue-elevated rounded-3xl border-2 border-valid/70 shadow-2xl shadow-valid/20 p-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="relative mb-4">
        <div className="absolute -inset-3 bg-valid/30 rounded-full blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-full bg-valid/20 border-2 border-valid flex items-center justify-center text-valid shadow-inner">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>
      </div>

      <h2 className="text-3xl font-black text-valid tracking-wide uppercase">Valid Ticket</h2>

      {eventName && (
        <div className="mt-2 px-4 py-1.5 rounded-full bg-blue-active border border-cyan-primary/40 text-cyan-primary text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <span>{eventName}</span>
        </div>
      )}

      <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-valid/20 border border-valid/40 text-valid text-xs font-semibold">
        <ShieldCheck className="w-4 h-4" />
        <span>Entry Approved</span>
      </div>

      <div className="w-full mt-6 space-y-4 bg-blue-surface/90 rounded-2xl p-4 border border-blue-medium text-left">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-full bg-blue-active border border-blue-medium text-cyan-primary mt-0.5 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider block">Student Name</span>
            <span className="text-xl font-bold text-white block">{ticket.studentName}</span>
            {ticket.department && (
              <span className="text-sm text-text-secondary block">{ticket.department}</span>
            )}
          </div>
        </div>

        <div className="h-px bg-blue-medium" />

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-full bg-blue-active border border-blue-medium text-cyan-primary mt-0.5 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider block">Ticket ID</span>
              <span className="text-lg font-mono font-bold text-cyan-primary block">{ticket.ticketId}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider block">Pass Type</span>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-active border border-blue-medium text-text-primary text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-cyan-primary" />
              <span>{ticket.passType || 'General'}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-blue-medium" />

        <div className="flex items-center justify-between text-xs text-text-muted pt-1 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-text-secondary" />
            <span>Verified: {timestamp}</span>
          </div>
          <span className="text-valid font-medium">Gate 1</span>
        </div>
      </div>
    </div>
  );
};