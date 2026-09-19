import { useState, useCallback } from 'react';
import type { FestivalEvent, EventUsageStats } from '../types/event';
import { eventService } from '../services/eventService';

export function useEventManager() {
  const [events, setEvents] = useState<FestivalEvent[]>(() => eventService.getEvents(true));
  const [currentEvent, setCurrentEventState] = useState<FestivalEvent>(() => eventService.getCurrentEvent());
  const [stats, setStats] = useState<EventUsageStats>(() => eventService.getEventStats(currentEvent.id));

  const refreshState = useCallback(() => {
    const allEvents = eventService.getEvents(true);
    const active = eventService.getCurrentEvent();
    const currentStats = eventService.getEventStats(active.id);
    setEvents(allEvents);
    setCurrentEventState(active);
    setStats(currentStats);
  }, []);

  const switchCurrentEvent = useCallback((eventId: string) => {
    const updated = eventService.setCurrentEvent(eventId);
    setCurrentEventState(updated);
    setStats(eventService.getEventStats(updated.id));
  }, []);

  const addEvent = useCallback(
    (eventData: Omit<FestivalEvent, 'id' | 'createdAt' | 'status'>) => {
      const created = eventService.addEvent(eventData);
      refreshState();
      return created;
    },
    [refreshState]
  );

  const editEvent = useCallback(
    (eventId: string, updates: Partial<Omit<FestivalEvent, 'id' | 'createdAt'>>) => {
      const updated = eventService.updateEvent(eventId, updates);
      refreshState();
      return updated;
    },
    [refreshState]
  );

  const archiveEvent = useCallback(
    (eventId: string) => {
      const archived = eventService.archiveEvent(eventId);
      refreshState();
      return archived;
    },
    [refreshState]
  );

  const unarchiveEvent = useCallback(
    (eventId: string) => {
      const unarchived = eventService.unarchiveEvent(eventId);
      refreshState();
      return unarchived;
    },
    [refreshState]
  );

  const resetEventUsage = useCallback(
    (eventId: string) => {
      const result = eventService.resetEventUsage(eventId);
      refreshState();
      return result;
    },
    [refreshState]
  );

  return {
    events,
    activeEvents: events.filter((e) => e.status === 'active'),
    archivedEvents: events.filter((e) => e.status === 'archived'),
    currentEvent,
    stats,
    switchCurrentEvent,
    addEvent,
    editEvent,
    archiveEvent,
    unarchiveEvent,
    resetEventUsage,
    refreshState,
  };
}
