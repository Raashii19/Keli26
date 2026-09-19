/**
 * Domain types for KELI26 Event Management and Multi-Event Ticket Verification System
 */

export type EventStatus = 'active' | 'archived';

export interface FestivalEvent {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  status: EventStatus;
  createdAt: string;
}

export interface TicketUsageRecord {
  ticketId: string;
  eventId: string;
  used: boolean;
  scannedAt: string;
  scannedGate?: string;
}

export type TicketStatus = 'idle' | 'scanning' | 'valid' | 'invalid' | 'already_used';

export interface TicketData {
  ticketId: string;
  studentName: string;
  department?: string;
  collegeId?: string;
  passType: string;
  paidStatus?: 'Paid' | 'Complimentary';
  phone?: string;
}

export interface ScanResult {
  status: 'valid' | 'invalid' | 'already_used';
  ticket?: TicketData;
  eventName?: string;
  eventId?: string;
  errorMessage?: string;
  scannedAt?: string;
  firstScannedAt?: string;
  timestamp: string;
}

export interface EventUsageStats {
  eventId: string;
  eventName: string;
  usedCount: number;
  remainingCount: number;
  totalAttendees: number;
}

export interface ScannerStats {
  totalScanned: number;
  validCount: number;
  invalidCount: number;
  duplicateCount: number;
}
