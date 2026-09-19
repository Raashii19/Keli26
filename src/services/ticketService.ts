import type { ScanResult } from '../types/ticket';
import { eventService } from './eventService';

/**
 * Verifies a ticket ID against the festival registry for the current active event.
 * In Phase 2, this will be replaced with Google Sheets Apps Script API or backend REST calls.
 *
 * @param ticketId Scanned QR ticket identifier
 * @param eventId Optional specific event ID; defaults to current active event
 * @returns Promise<ScanResult>
 */
export async function verifyTicket(ticketId: string, eventId?: string): Promise<ScanResult> {
  return eventService.verifyTicketForEvent(ticketId, eventId);
}

/**
 * Preset simulation tickets for quick testing in prototype mode
 */
export const SAMPLE_SIMULATIONS = [
  { label: 'Muhammed Rashid', ticketId: 'KELI26-001', type: 'valid' as const },
  { label: 'Ananya Sharma', ticketId: 'KELI26-002', type: 'valid' as const },
  { label: 'Aditya Varma', ticketId: 'KELI26-003', type: 'valid' as const },
  { label: 'Invalid Pass', ticketId: 'KELI26-999', type: 'invalid' as const },
];
