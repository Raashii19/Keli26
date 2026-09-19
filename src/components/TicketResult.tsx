import React from 'react';
import type { ScanResult } from '../types/ticket';
import { ValidTicket } from './ValidTicket';
import { InvalidTicket } from './InvalidTicket';
import { AlreadyUsedTicket } from './AlreadyUsedTicket';
import { ScanLine } from 'lucide-react';

interface TicketResultProps {
  result: ScanResult;
  onScanNext: () => void;
}

export const TicketResult: React.FC<TicketResultProps> = ({
  result,
  onScanNext,
}) => {
  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      {result.status === 'valid' && (
        <ValidTicket
          ticket={result.ticket}
          eventName={result.eventName}
          timestamp={result.timestamp}
        />
      )}

      {result.status === 'invalid' && (
        <InvalidTicket
          eventName={result.eventName}
          errorMessage={result.errorMessage}
          timestamp={result.timestamp}
        />
      )}

      {result.status === 'already_used' && (
        <AlreadyUsedTicket
          ticket={result.ticket}
          eventName={result.eventName}
          errorMessage={result.errorMessage}
          timestamp={result.timestamp}
          firstScannedAt={result.firstScannedAt}
        />
      )}

      <button
        type="button"
        onClick={onScanNext}
        autoFocus
        className="w-full max-w-sm mx-auto mt-6 py-4 px-6 rounded-full font-bold text-base uppercase tracking-wider text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-xl shadow-cyan-900/50 border border-cyan-400/40 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
      >
        <ScanLine className="w-5 h-5 text-cyan-200" />
        <span>Scan Next Ticket</span>
      </button>
    </div>
  );
};