import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { AppHeader } from './components/AppHeader';
import { ScannerPage } from './components/ScannerPage';
import { EventManagement } from './components/EventManagement';
import { MenuDrawer } from './components/MenuDrawer';
import { useEventManager } from './hooks/useEventManager';

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [viewMode, setViewMode] = useState<'scanner' | 'events'>('scanner');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    events,
    activeEvents,
    currentEvent,
    stats,
    switchCurrentEvent,
    addEvent,
    editEvent,
    archiveEvent,
    unarchiveEvent,
    resetEventUsage,
    refreshState,
  } = useEventManager();

  const handleOpenManageEvents = () => {
    setIsMenuOpen(false);
    setViewMode('events');
  };

  const handleImportRegistry = () => {
    const url = prompt('Enter Google Sheets CSV URL:');
    if (url) {
      // Import logic would go here
      console.log('Import from:', url);
    }
  };

  const handleClearRegistry = () => {
    if (confirm('Clear all imported ticket registry data? This cannot be undone.')) {
      // Clear logic would go here
      console.log('Registry cleared');
    }
  };

  return (
    <div className="min-h-screen bg-blue-deep text-text-primary flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white">
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <div className="flex-1 flex flex-col animate-in fade-in duration-300">
          <MenuDrawer
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            currentEvent={currentEvent}
            activeEvents={activeEvents}
            onSelectEvent={switchCurrentEvent}
            onOpenManageEvents={handleOpenManageEvents}
            onResetEventUsage={resetEventUsage}
            onReplaySplash={() => setShowSplash(true)}
            onImportRegistry={handleImportRegistry}
            onClearRegistry={handleClearRegistry}
          />

          <AppHeader
            onOpenMenu={() => setIsMenuOpen(true)}
            currentEvent={currentEvent}
          />

          {viewMode === 'scanner' ? (
            <ScannerPage
              currentEvent={currentEvent}
              activeEvents={activeEvents}
              stats={stats}
              onSelectEvent={switchCurrentEvent}
              onResetEventUsage={resetEventUsage}
              onScanComplete={refreshState}
            />
          ) : (
            <EventManagement
              events={events}
              currentEvent={currentEvent}
              onBack={() => setViewMode('scanner')}
              onAddEvent={addEvent}
              onEditEvent={editEvent}
              onArchiveEvent={archiveEvent}
              onUnarchiveEvent={unarchiveEvent}
              onSelectCurrentEvent={(id) => {
                switchCurrentEvent(id);
                setViewMode('scanner');
              }}
            />
          )}

          <footer className="w-full text-center py-2.5 pb-safe text-[11px] text-text-muted select-none border-t border-blue-medium/40">
            KELI26 College Festival • Multi-Event Volunteer Terminal
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;