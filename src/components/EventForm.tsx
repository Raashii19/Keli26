import React, { useState } from 'react';
import type { FestivalEvent } from '../types/event';
import { X, Calendar, Clock, MapPin, Tag } from 'lucide-react';

interface EventFormProps {
  initialEvent?: FestivalEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
  }) => void;
}

const EventFormContent: React.FC<EventFormProps> = ({
  initialEvent,
  onClose,
  onSave,
}) => {
  const isEditing = !!initialEvent;

  const [name, setName] = useState(initialEvent ? initialEvent.name : '');
  const [date, setDate] = useState(initialEvent ? initialEvent.date : 'May 20, 2026');
  const [startTime, setStartTime] = useState(initialEvent ? initialEvent.startTime : '10:00 AM');
  const [endTime, setEndTime] = useState(initialEvent ? initialEvent.endTime : '1:00 PM');
  const [venue, setVenue] = useState(initialEvent ? initialEvent.venue : 'Main Hall');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Event Name is required.');
      return;
    }
    if (!date.trim()) {
      setError('Date is required.');
      return;
    }
    if (!startTime.trim()) {
      setError('Start Time is required.');
      return;
    }
    if (!venue.trim()) {
      setError('Venue is required.');
      return;
    }

    onSave({
      name: name.trim(),
      date: date.trim(),
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      venue: venue.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-[#0a152f] border-2 border-blue-600/70 shadow-2xl shadow-blue-950 p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-900/50">
          <h3 className="text-xl font-black text-white">
            {isEditing ? 'Edit Event' : 'Add New Event'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-blue-950/80 text-blue-300 hover:text-white border border-blue-800/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Event Name */}
          <div>
            <label className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Event Name *</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. DJ Night, Tech Workshop"
              className="w-full px-4 py-3 rounded-2xl bg-[#050b18] border border-blue-800/60 text-white placeholder:text-blue-500/50 focus:outline-none focus:border-cyan-400 text-sm"
              autoFocus
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Date *</span>
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. May 20, 2026"
              className="w-full px-4 py-3 rounded-2xl bg-[#050b18] border border-blue-800/60 text-white placeholder:text-blue-500/50 focus:outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          {/* Timing Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Start Time *</span>
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="e.g. 7:00 PM"
                className="w-full px-4 py-3 rounded-2xl bg-[#050b18] border border-blue-800/60 text-white placeholder:text-blue-500/50 focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>End Time</span>
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="e.g. 10:30 PM"
                className="w-full px-4 py-3 rounded-2xl bg-[#050b18] border border-blue-800/60 text-white placeholder:text-blue-500/50 focus:outline-none focus:border-cyan-400 text-sm"
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Venue *</span>
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Main Ground, Seminar Hall"
              className="w-full px-4 py-3 rounded-2xl bg-[#050b18] border border-blue-800/60 text-white placeholder:text-blue-500/50 focus:outline-none focus:border-cyan-400 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-full bg-blue-950 hover:bg-blue-900/60 border border-blue-800 text-blue-300 font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-950 transition-transform active:scale-95"
            >
              {isEditing ? 'Save Changes' : 'Save Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const EventForm: React.FC<EventFormProps> = (props) => {
  if (!props.isOpen) return null;
  return <EventFormContent key={props.initialEvent?.id || 'new'} {...props} />;
};
