import { useState, useCallback } from 'react';
import type { TicketStatus, ScanResult, ScannerStats } from '../types/ticket';
import { verifyTicket } from '../services/ticketService';

export function useTicketScanner() {
  const [status, setStatus] = useState<TicketStatus>('idle');
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<ScannerStats>({
    totalScanned: 0,
    validCount: 0,
    invalidCount: 0,
    duplicateCount: 0,
  });

  const scanTicket = useCallback(async (ticketId: string = 'KELI26-001', eventId?: string) => {
    setIsProcessing(true);
    setStatus('scanning');

    // Simulate realistic camera recognition delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = await verifyTicket(ticketId, eventId);
    setLastResult(result);
    setStatus(result.status);
    setIsProcessing(false);

    // Update session metrics
    setStats((prev: ScannerStats) => ({
      totalScanned: prev.totalScanned + 1,
      validCount: result.status === 'valid' ? prev.validCount + 1 : prev.validCount,
      invalidCount: result.status === 'invalid' ? prev.invalidCount + 1 : prev.invalidCount,
      duplicateCount: result.status === 'already_used' ? prev.duplicateCount + 1 : prev.duplicateCount,
    }));

    return result;
  }, []);

  const resetToScanner = useCallback(() => {
    setStatus('idle');
    setLastResult(null);
  }, []);

  return {
    status,
    lastResult,
    isProcessing,
    stats,
    scanTicket,
    resetToScanner,
  };
}
