import React, { useState } from 'react';
import type { FestivalEvent } from '../types/event';
import { EventCard } from './EventCard';
import { EventForm } from './EventForm';
import { ArchiveEventDialog } from './ArchiveEventDialog';
import { Plus, ArrowLeft, Calendar, Archive } from 'lucide-react';

interface EventManagementProps {
  events: FestivalEvent[];
  currentEvent: FestivalEvent;
  onBack: () => void;
  onAddEvent: (data: {
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
  }) => void;
  onEditEvent: (
    id: string,
    data: {
      name: string;
      date: string;
      startTime: string;
      endTime: string;
      venue: string;
    }
  ) => void;
  onArchiveEvent: (id: string) => void;
  onUnarchiveEvent: (id: string) => void;
  onSelectCurrentEvent: (id: string) => void;
}

export const EventManagement: React.FC<EventManagementProps> = ({
  events,
  currentEvent,
  onBack,
  onAddEvent,
  onEditEvent,
  onArchiveEvent,
  onUnarchiveEvent,
  onSelectCurrentEvent,
}) => {
  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FestivalEvent | null>(null);
  const [archivingEvent, setArchivingEvent] = useState<FestivalEvent | null>(null);

  const activeList = events.filter((e) => e.status === 'active');
  const archivedList = events.filter((e) => e.status === 'archived');
  const displayedList = tab === 'active' ? activeList : archivedList;

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (evt: FestivalEvent) => {
    setEditingEvent(evt);
    setIsFormOpen(true);
  };

  const handleSaveForm = (data: {
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
  }) => {
    if (editingEvent) {
      onEditEvent(editingEvent.id, data);
    } else {
      onAddEvent(data);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[85vh] flex flex-col p-4 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-blue-900/50">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 py-2 px-3 rounded-full bg-blue-950/80 hover:bg-blue-900/60 border border-blue-800 text-xs font-semibold text-blue-200 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <h2 className="text-xl font-black text-white uppercase tracking-wider">
          Event Management
        </h2>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-1 py-2 px-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-950 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-2xl bg-[#0a152f] border border-blue-900/60">
        <button
          type="button"
          onClick={() => setTab('active')}
          className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            tab === 'active'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
              : 'text-blue-300 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Active ({activeList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('archived')}
          className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            tab === 'archived'
              ? 'bg-slate-700 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Archived ({archivedList.length})</span>
        </button>
      </div>

      {/* Event Cards List */}
      <div className="flex-1 mt-4 space-y-3 overflow-y-auto pb-6">
        {displayedList.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-[#0a152f]/50 border border-dashed border-blue-900/60 text-blue-300/70">
            <p className="text-sm font-semibold">
              {tab === 'active' ? 'No active events found.' : 'No archived events.'}
            </p>
            {tab === 'active' && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 text-xs font-bold text-white hover:bg-blue-500"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Your First Event</span>
              </button>
            )}
          </div>
        ) : (
          displayedList.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              isCurrent={evt.id === currentEvent.id}
              onEdit={handleOpenEdit}
              onArchive={(item) => setArchivingEvent(item)}
              onUnarchive={(item) => onUnarchiveEvent(item.id)}
              onMakeCurrent={(id) => onSelectCurrentEvent(id)}
            />
          ))
        )}
      </div>

      {/* Add / Edit Form Modal */}
      <EventForm
        isOpen={isFormOpen}
        initialEvent={editingEvent}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveForm}
      />

      {/* Archive Confirmation Dialog */}
      <ArchiveEventDialog
        isOpen={!!archivingEvent}
        event={archivingEvent}
        onClose={() => setArchivingEvent(null)}
        onConfirm={(id) => onArchiveEvent(id)}
      />
    </div>
  );
};
