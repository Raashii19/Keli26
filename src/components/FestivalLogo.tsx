import React from 'react';

interface FestivalLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  customLogoUrl?: string; // Replaceable with real KELI26 image when available
  className?: string;
}

export const FestivalLogo: React.FC<FestivalLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  customLogoUrl,
  className = '',
}) => {
  // If an external logo image is supplied later, render it cleanly
  if (customLogoUrl) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <img
          src={customLogoUrl}
          alt="KELI26 Official Logo"
          className={
            size === 'sm'
              ? 'h-8 w-auto'
              : size === 'lg'
              ? 'h-24 w-auto drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]'
              : 'h-16 w-auto'
          }
        />
        {showSubtitle && (
          <span className="text-xs uppercase tracking-widest text-blue-300/80 mt-1 font-medium">
            College Festival 2026
          </span>
        )}
      </div>
    );
  }

  // Modern Vector Logo Component with Blue Aesthetic
  const sizeStyles = {
    sm: {
      container: 'gap-2',
      badge: 'w-7 h-7 text-xs',
      text: 'text-lg',
      subtext: 'text-[9px] tracking-wider',
      number: 'text-blue-400',
    },
    md: {
      container: 'gap-2.5',
      badge: 'w-10 h-10 text-sm',
      text: 'text-2xl',
      subtext: 'text-[11px] tracking-widest',
      number: 'text-blue-400',
    },
    lg: {
      container: 'gap-4',
      badge: 'w-20 h-20 text-2xl',
      text: 'text-4xl sm:text-5xl',
      subtext: 'text-xs sm:text-sm tracking-[0.25em]',
      number: 'text-cyan-400',
    },
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <div className={`flex items-center ${sizeStyles.container}`}>
        {/* Modern Festival Monogram Emblem */}
        <div
          className={`${sizeStyles.badge} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-800 text-white font-black shadow-lg shadow-blue-500/30 border border-blue-400/40`}
        >
          <span className="tracking-tighter">K</span>
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
        </div>

        {/* Wordmark */}
        <div className="flex flex-col">
          <div className={`font-black tracking-tight text-white flex items-center ${sizeStyles.text}`}>
            <span>KELI</span>
            <span className={`${sizeStyles.number} ml-0.5 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent`}>
              26
            </span>
          </div>
        </div>
      </div>

      {showSubtitle && (
        <span
          className={`uppercase font-semibold text-blue-200/70 mt-1.5 ${sizeStyles.subtext}`}
        >
          Annual College Festival • Entry Portal
        </span>
      )}
    </div>
  );
};
