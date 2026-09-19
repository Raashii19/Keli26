import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, Check, X } from 'lucide-react';
import type { FestivalEvent } from '../types/event';

interface EventSelectorBarProps {
  currentEvent: FestivalEvent;
  activeEvents: FestivalEvent[];
  onSelectEvent: (eventId: string) => void;
}

export const EventSelectorBar: React.FC<EventSelectorBarProps> = ({
  currentEvent,
  activeEvents,
  onSelectEvent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-blue-surface border border-blue-medium hover:border-cyan-primary/50 transition-colors text-left"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-elevated border border-blue-medium flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5 text-cyan-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{currentEvent.name}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180 text-cyan-primary' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto animate-sheet-in bg-blue-surface border-t-2 border-cyan-primary/50 rounded-t-3xl overflow-hidden">
            <div className="p-4 border-b border-blue-medium flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Select Event</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-blue-elevated text-text-secondary hover:text-white hover:bg-blue-hover transition-colors"
                aria-label="Close event selector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-blue-medium p-2">
              {activeEvents.map((evt) => {
                const isSelected = evt.id === currentEvent.id;
                return (
                  <button
                    key={evt.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelectEvent(evt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-3.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                      isSelected
                        ? 'bg-blue-elevated border border-cyan-primary/50 text-white'
                        : 'hover:bg-blue-elevated text-text-primary'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">{evt.name}</p>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-primary/20 text-cyan-primary border border-cyan-primary/30">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-cyan-primary text-blue-950 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="p-4 border-t border-blue-medium">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-elevated hover:bg-blue-hover border border-blue-medium text-text-secondary font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};