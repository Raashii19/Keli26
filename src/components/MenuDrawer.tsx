import React, { useEffect } from 'react';
import { X, Calendar, Layers, RotateCcw, Upload, Trash2, HelpCircle, Info, ChevronRight } from 'lucide-react';
import type { FestivalEvent } from '../types/event';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentEvent: FestivalEvent;
  activeEvents: FestivalEvent[];
  onSelectEvent: (eventId: string) => void;
  onOpenManageEvents: () => void;
  onResetEventUsage: (eventId: string) => { resetCount: number; eventName: string };
  onReplaySplash: () => void;
  onImportRegistry: () => void;
  onClearRegistry: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  currentEvent,
  activeEvents: _activeEvents,
  onSelectEvent: _onSelectEvent,
  onOpenManageEvents,
  onResetEventUsage,
  onReplaySplash,
  onImportRegistry,
  onClearRegistry,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm animate-drawer-in bg-blue-surface border-l border-blue-subtle flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-blue-subtle">
          <h2 className="text-lg font-bold text-white">KELI26 Menu</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-blue-elevated text-text-secondary hover:text-white hover:bg-blue-hover transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <div>
            <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
              Event Control
            </h3>
            <div className="space-y-2">
              <div className="bg-blue-elevated rounded-xl p-3 border border-blue-medium">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Current Event</span>
                  <span className="text-xs font-bold text-cyan-primary px-2 py-0.5 rounded-full bg-blue-active border border-cyan-primary/30">
                    Active
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setTimeout(() => onOpenManageEvents(), 100);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-blue-hover hover:bg-blue-active transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-active border border-blue-medium flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-cyan-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-white truncate">{currentEvent.name}</p>
                      <p className="text-xs text-text-secondary">{currentEvent.date} • {currentEvent.venue}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  setTimeout(() => onOpenManageEvents(), 100);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-elevated hover:bg-blue-hover border border-blue-medium transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-active border border-blue-medium flex items-center justify-center">
                  <Layers className="w-5 h-5 text-cyan-primary" />
                </div>
                <span className="font-medium text-white">Manage Events</span>
                <ChevronRight className="w-5 h-5 text-text-muted ml-auto" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
              Actions
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onResetEventUsage(currentEvent.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-elevated hover:bg-blue-hover border border-blue-medium transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-warning/20 border border-warning/30 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-warning" />
                </div>
                <span className="font-medium text-white">Reset Current Event Usage</span>
                <ChevronRight className="w-5 h-5 text-text-muted ml-auto" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onReplaySplash();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-elevated hover:bg-blue-hover border border-blue-medium transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-active border border-blue-medium flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-cyan-primary" />
                </div>
                <span className="font-medium text-white">Replay Intro Animation</span>
                <ChevronRight className="w-5 h-5 text-text-muted ml-auto" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
              Data
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onImportRegistry();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-elevated hover:bg-blue-hover border border-blue-medium transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-cyan-primary/20 border border-cyan-primary/30 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-cyan-primary" />
                </div>
                <span className="font-medium text-white">Import Ticket Registry</span>
                <ChevronRight className="w-5 h-5 text-text-muted ml-auto" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClearRegistry();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-elevated hover:bg-blue-hover border border-blue-medium transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-invalid/20 border border-invalid/30 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-invalid" />
                </div>
                <span className="font-medium text-white">Clear Imported Registry</span>
                <ChevronRight className="w-5 h-5 text-text-muted ml-auto" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
              Info
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-elevated hover:bg-blue-hover border border-blue-medium transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-active border border-blue-medium flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-cyan-primary" />
                </div>
                <span className="font-medium text-white">Help & Support</span>
                <ChevronRight className="w-5 h-5 text-text-muted ml-auto" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-elevated hover:bg-blue-hover border border-blue-medium transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-active border border-blue-medium flex items-center justify-center">
                  <Info className="w-5 h-5 text-cyan-primary" />
                </div>
                <span className="font-medium text-white">About KELI26</span>
                <ChevronRight className="w-5 h-5 text-text-muted ml-auto" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-blue-subtle">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>v2.6 Multi-Event</span>
            <span>Gate 1 • Main Portal</span>
          </div>
        </div>
      </div>
    </>
  );
};