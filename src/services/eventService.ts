import type {
  FestivalEvent,
  TicketUsageRecord,
  EventUsageStats,
  TicketData,
  ScanResult,
} from '../types/event';
import { getRegistry, getTotalAttendees } from './registryService';
import { normalizeId } from './ticketParser';

// Initial Mock Events
const DEFAULT_EVENTS: FestivalEvent[] = [
  {
    id: 'event-inauguration',
    name: 'Inauguration',
    date: 'May 20, 2026',
    startTime: '10:00 AM',
    endTime: '12:30 PM',
    venue: 'Main Hall',
    status: 'active',
    createdAt: new Date('2026-05-01').toISOString(),
  },
  {
    id: 'event-workshop',
    name: 'Workshop',
    date: 'May 20, 2026',
    startTime: '2:00 PM',
    endTime: '5:00 PM',
    venue: 'Seminar Hall',
    status: 'active',
    createdAt: new Date('2026-05-01').toISOString(),
  },
  {
    id: 'event-dj-night',
    name: 'DJ Night',
    date: 'May 20, 2026',
    startTime: '7:00 PM',
    endTime: '10:30 PM',
    venue: 'Main Ground',
    status: 'active',
    createdAt: new Date('2026-05-01').toISOString(),
  },
  {
    id: 'event-gaming',
    name: 'Gaming Event',
    date: 'May 21, 2026',
    startTime: '11:00 AM',
    endTime: '4:00 PM',
    venue: 'Indoor Arena',
    status: 'active',
    createdAt: new Date('2026-05-02').toISOString(),
  },
  {
    id: 'event-cultural',
    name: 'Cultural Program',
    date: 'May 21, 2026',
    startTime: '6:00 PM',
    endTime: '9:30 PM',
    venue: 'Open Air Theatre',
    status: 'active',
    createdAt: new Date('2026-05-02').toISOString(),
  },
];

// Mock Attendee Database (Students who purchased festival passes)
export const MOCK_TICKETS: Record<string, TicketData> = {
  'KELI26-001': {
    ticketId: 'KELI26-001',
    studentName: 'Muhammed Rashid',
    department: 'Computer Science & Engineering',
    collegeId: 'CS2026-042',
    passType: 'General',
    paidStatus: 'Paid',
  },
  'KELI26-0001': {
    ticketId: 'KELI26-0001',
    studentName: 'Muhammed Rashid',
    department: 'Computer Science & Engineering',
    collegeId: 'CS2026-042',
    passType: 'General',
    paidStatus: 'Paid',
  },
  'KELI26-002': {
    ticketId: 'KELI26-002',
    studentName: 'Ananya Sharma',
    department: 'Electronics & Communication',
    collegeId: 'EC2026-118',
    passType: 'VIP',
    paidStatus: 'Paid',
  },
  'KELI26-0002': {
    ticketId: 'KELI26-0002',
    studentName: 'Ananya Sharma',
    department: 'Electronics & Communication',
    collegeId: 'EC2026-118',
    passType: 'VIP',
    paidStatus: 'Paid',
  },
  'KELI26-003': {
    ticketId: 'KELI26-003',
    studentName: 'Aditya Varma',
    department: 'Mechanical Engineering',
    collegeId: 'ME2026-089',
    passType: 'Standard',
    paidStatus: 'Paid',
  },
  'KELI26-004': {
    ticketId: 'KELI26-004',
    studentName: 'Sneha Patel',
    department: 'Biotechnology',
    collegeId: 'BT2026-015',
    passType: 'All-Access',
    paidStatus: 'Paid',
  },
};

// Keys for local persistence
const STORAGE_EVENTS_KEY = 'keli26_events_registry';
const STORAGE_USAGE_KEY = 'keli26_ticket_usage_map';
const STORAGE_CURRENT_EVENT_KEY = 'keli26_current_event_id';

class EventService {
  private events: FestivalEvent[] = [];
  private usageMap: Map<string, TicketUsageRecord> = new Map();
  private currentEventId: string = 'event-dj-night';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedEvents = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (storedEvents) {
        const parsed = JSON.parse(storedEvents);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.events = parsed;
        } else {
          this.events = [...DEFAULT_EVENTS];
          this.saveEvents();
        }
      } else {
        this.events = [...DEFAULT_EVENTS];
        this.saveEvents();
      }

      const storedUsage = localStorage.getItem(STORAGE_USAGE_KEY);
      if (storedUsage) {
        const parsed = JSON.parse(storedUsage);
        if (Array.isArray(parsed)) {
          this.usageMap = new Map(parsed);
        } else {
          this.usageMap = new Map();
        }
      } else {
        this.usageMap = new Map();
      }

      const storedCurrent = localStorage.getItem(STORAGE_CURRENT_EVENT_KEY);
      if (storedCurrent && this.events.some((e) => e.id === storedCurrent && e.status === 'active')) {
        this.currentEventId = storedCurrent;
      } else {
        const firstActive = this.events.find((e) => e.status === 'active');
        this.currentEventId = firstActive ? firstActive.id : (this.events[0]?.id || DEFAULT_EVENTS[0].id);
      }
    } catch {
      this.events = [...DEFAULT_EVENTS];
      this.usageMap = new Map();
      this.currentEventId = DEFAULT_EVENTS[0].id;
    }
  }

  private saveEvents() {
    try {
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(this.events));
    } catch {
      // safe fallback
    }
  }

  private saveUsage() {
    try {
      const entries = Array.from(this.usageMap.entries());
      localStorage.setItem(STORAGE_USAGE_KEY, JSON.stringify(entries));
    } catch {
      // safe fallback
    }
  }

  private saveCurrentEventId() {
    try {
      localStorage.setItem(STORAGE_CURRENT_EVENT_KEY, this.currentEventId);
    } catch {
      // safe fallback
    }
  }

  /**
   * Helper to generate unique composite key: TICKET + EVENT
   */
  private getUsageKey(ticketId: string, eventId: string): string {
    const normalizedTicket = ticketId.trim().toUpperCase();
    return `${normalizedTicket}::${eventId}`;
  }

  // ================= EVENT CRUD =================

  public getEvents(includeArchived = true): FestivalEvent[] {
    if (includeArchived) {
      return [...this.events];
    }
    return this.events.filter((e) => e.status === 'active');
  }

  public getActiveEvents(): FestivalEvent[] {
    return this.events.filter((e) => e.status === 'active');
  }

  public getEventById(eventId: string): FestivalEvent | undefined {
    return this.events.find((e) => e.id === eventId);
  }

  public getCurrentEvent(): FestivalEvent {
    if (!this.events || this.events.length === 0) {
      this.events = [...DEFAULT_EVENTS];
      this.saveEvents();
    }

    let current = this.events.find((e) => e.id === this.currentEventId);
    if (!current || current.status !== 'active') {
      const fallback = this.getActiveEvents()[0] || this.events[0] || DEFAULT_EVENTS[0];
      if (fallback) {
        this.currentEventId = fallback.id;
        this.saveCurrentEventId();
        return fallback;
      }
    }
    return current || DEFAULT_EVENTS[0];
  }

  public setCurrentEvent(eventId: string): FestivalEvent {
    const target = this.events.find((e) => e.id === eventId);
    if (!target) {
      throw new Error(`Event with ID ${eventId} does not exist.`);
    }
    this.currentEventId = eventId;
    this.saveCurrentEventId();
    return target;
  }

  public addEvent(eventData: Omit<FestivalEvent, 'id' | 'createdAt' | 'status'>): FestivalEvent {
    if (!eventData.name || !eventData.name.trim()) {
      throw new Error('Event Name is required.');
    }

    const slug = eventData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newId = `event-${slug}-${Date.now()}`;

    const newEvent: FestivalEvent = {
      id: newId,
      name: eventData.name.trim(),
      date: eventData.date.trim(),
      startTime: eventData.startTime.trim(),
      endTime: eventData.endTime.trim(),
      venue: eventData.venue.trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    this.events.push(newEvent);
    this.saveEvents();
    return newEvent;
  }

  public updateEvent(
    eventId: string,
    updates: Partial<Omit<FestivalEvent, 'id' | 'createdAt'>>
  ): FestivalEvent {
    const index = this.events.findIndex((e) => e.id === eventId);
    if (index === -1) {
      throw new Error(`Event with ID ${eventId} not found.`);
    }

    if (updates.name !== undefined && !updates.name.trim()) {
      throw new Error('Event Name cannot be empty.');
    }

    this.events[index] = {
      ...this.events[index],
      ...updates,
      name: updates.name ? updates.name.trim() : this.events[index].name,
    };

    this.saveEvents();
    return this.events[index];
  }

  public archiveEvent(eventId: string): FestivalEvent {
    const updated = this.updateEvent(eventId, { status: 'archived' });
    // If the archived event was current, auto-switch to next active event
    if (this.currentEventId === eventId) {
      const remainingActive = this.getActiveEvents();
      if (remainingActive.length > 0) {
        this.currentEventId = remainingActive[0].id;
        this.saveCurrentEventId();
      }
    }
    return updated;
  }

  public unarchiveEvent(eventId: string): FestivalEvent {
    return this.updateEvent(eventId, { status: 'active' });
  }

  // ================= USAGE & VERIFICATION =================

  /**
   * Checks if a ticket was already used for a specific event
   */
  public isTicketUsedForEvent(ticketId: string, eventId: string): { used: boolean; record?: TicketUsageRecord } {
    const key = this.getUsageKey(ticketId, eventId);
    const record = this.usageMap.get(key);
    return {
      used: !!record && record.used,
      record,
    };
  }

  /**
   * Verifies a ticket ID strictly against the given or current event.
   * Concept: TICKET + EVENT -> USAGE
   */
  public async verifyTicketForEvent(ticketId: string, eventId?: string): Promise<ScanResult> {
    // Realistic UI feedback delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    const activeEvent = eventId ? this.getEventById(eventId) || this.getCurrentEvent() : this.getCurrentEvent();
    const cleanId = ticketId.trim().toUpperCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // 1. Check if attendee/ticket exists - try imported registry first, then fallback to mock
    const registry = getRegistry();
    let ticket = registry.get(cleanId);
    
    if (!ticket) {
      // Try normalized lookup for IDs with different formatting
      for (const [, entry] of registry) {
        if (normalizeId(entry.ticketId) === cleanId.replace(/[^A-Z0-9]/g, '')) {
          ticket = entry;
          break;
        }
      }
    }
    
    // Fallback to mock tickets if no registry imported or not found
    if (!ticket) {
      ticket = MOCK_TICKETS[cleanId];
    }
    
    if (!ticket) {
      return {
        status: 'invalid',
        errorMessage: `Ticket ID "${cleanId}" was not found in the festival registry.`,
        eventId: activeEvent.id,
        eventName: activeEvent.name,
        timestamp,
      };
    }

    // 2. Check if already used FOR THIS SPECIFIC EVENT
    const usageCheck = this.isTicketUsedForEvent(cleanId, activeEvent.id);
    if (usageCheck.used) {
      return {
        status: 'already_used',
        ticket,
        eventId: activeEvent.id,
        eventName: activeEvent.name,
        firstScannedAt: usageCheck.record?.scannedAt || 'Earlier today at Main Gate',
        errorMessage: `This ticket has already been scanned for ${activeEvent.name}.`,
        timestamp,
      };
    }

    // 3. Valid! Mark as used FOR THIS SPECIFIC EVENT ONLY
    const newRecord: TicketUsageRecord = {
      ticketId: cleanId,
      eventId: activeEvent.id,
      used: true,
      scannedAt: `${timestamp} at Main Gate`,
      scannedGate: 'Gate 1',
    };

    const key = this.getUsageKey(cleanId, activeEvent.id);
    this.usageMap.set(key, newRecord);
    this.saveUsage();

    return {
      status: 'valid',
      ticket,
      eventId: activeEvent.id,
      eventName: activeEvent.name,
      scannedAt: timestamp,
      timestamp,
    };
  }

  /**
   * Reset ticket usage ONLY for a specific event.
   * Crucial: Does NOT touch usage records belonging to other events!
   */
  public resetEventUsage(eventId: string): { resetCount: number; eventName: string } {
    const event = this.getEventById(eventId);
    const eventName = event ? event.name : 'Selected Event';

    let count = 0;
    const keysToDelete: string[] = [];

    for (const [key, record] of this.usageMap.entries()) {
      if (record.eventId === eventId) {
        keysToDelete.push(key);
        count++;
      }
    }

    for (const key of keysToDelete) {
      this.usageMap.delete(key);
    }

    this.saveUsage();
    return { resetCount: count, eventName };
  }

  /**
   * Get live attendee usage counts for an event
   */
  public getEventStats(eventId: string): EventUsageStats {
    const event = this.getEventById(eventId);
    const eventName = event ? event.name : 'Unknown';

    let usedCount = 0;
    for (const record of this.usageMap.values()) {
      if (record.eventId === eventId && record.used) {
        usedCount++;
      }
    }

    const total = getTotalAttendees();
    const remainingCount = Math.max(0, total - usedCount);

    return {
      eventId,
      eventName,
      usedCount,
      remainingCount,
      totalAttendees: total,
    };
  }
}

export const eventService = new EventService();
