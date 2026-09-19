import React, { useState } from 'react';
import type { FestivalEvent, EventUsageStats } from '../types/event';
import { useTicketScanner } from '../hooks/useTicketScanner';
import { EventSelectorBar } from './EventSelectorBar';
import { QRScannerFrame } from './QRScannerFrame';
import { ScanButton } from './ScanButton';
import { TicketResult } from './TicketResult';
import { ResetEventUsageDialog } from './ResetEventUsageDialog';
import { resolveTicketId, parseScanText } from '../services/ticketParser';
import { getRegistry } from '../services/registryService';

interface ScannerPageProps {
  currentEvent: FestivalEvent;
  activeEvents: FestivalEvent[];
  stats: EventUsageStats;
  onSelectEvent: (eventId: string) => void;
  onResetEventUsage: (eventId: string) => { resetCount: number; eventName: string };
  onScanComplete?: () => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  currentEvent,
  activeEvents,
  stats: _stats,
  onSelectEvent,
  onResetEventUsage,
  onScanComplete,
}) => {
  const { status, lastResult, isProcessing, scanTicket, resetToScanner } =
    useTicketScanner();

  const [selectedTicketId, setSelectedTicketId] = useState('KELI26-001');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleScanAction = async (ticketId: string) => {
    setSelectedTicketId(ticketId);
    await scanTicket(ticketId, currentEvent.id);
    onScanComplete?.();
  };

  const handleDecoded = async (rawText: string) => {
    const parsed = parseScanText(rawText);
    const registry = getRegistry();
    const resolvedId = resolveTicketId(parsed, registry);

    if (resolvedId) {
      await scanTicket(resolvedId, currentEvent.id);
    } else {
      await scanTicket(rawText.trim().toUpperCase(), currentEvent.id);
    }
    onScanComplete?.();
  };

  return (
    <main className="flex-1 w-full max-w-md mx-auto px-4 py-3 flex flex-col">
      <EventSelectorBar
        currentEvent={currentEvent}
        activeEvents={activeEvents}
        onSelectEvent={onSelectEvent}
      />

      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        {(status === 'idle' || status === 'scanning') ? (
          <div className="w-full flex flex-col items-center gap-6 flex-1">
            <QRScannerFrame
              isActive={status === 'idle'}
              onDecoded={handleDecoded}
              onError={(msg) => console.warn('Scanner error:', msg)}
              className="w-full max-w-[320px] aspect-square"
            />

            <ScanButton
              onClick={() => handleScanAction(selectedTicketId)}
              isScanning={isProcessing}
              className="w-full max-w-sm"
            />
          </div>
        ) : (
          lastResult && (
            <TicketResult result={lastResult} onScanNext={resetToScanner} />
          )
        )}
      </div>

      <ResetEventUsageDialog
        isOpen={isResetModalOpen}
        event={currentEvent}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={onResetEventUsage}
      />
    </main>
  );
};