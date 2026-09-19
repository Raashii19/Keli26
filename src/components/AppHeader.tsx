import React from 'react';
import { FestivalLogo } from './FestivalLogo';
import { Menu } from 'lucide-react';

interface AppHeaderProps {
  onOpenMenu: () => void;
  currentEvent?: { name: string };
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenMenu,
  currentEvent: _currentEvent,
}) => {
  return (
    <header className="h-14 px-4 bg-blue-surface/95 backdrop-blur border-b border-blue-subtle flex items-center justify-between">
      <FestivalLogo size="md" showSubtitle={false} />
      <button
        type="button"
        onClick={onOpenMenu}
        className="p-2 rounded-lg bg-blue-elevated text-text-secondary hover:text-white hover:bg-blue-hover transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
};