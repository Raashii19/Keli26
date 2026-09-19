import React from 'react';
import { Camera, Loader2 } from 'lucide-react';

interface ScanButtonProps {
  onClick: () => void;
  isScanning: boolean;
  disabled?: boolean;
  className?: string;
}

export const ScanButton: React.FC<ScanButtonProps> = ({
  onClick,
  isScanning,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isScanning}
      className={`relative w-full max-w-sm py-4 px-8 rounded-full font-black text-base sm:text-lg tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] ${
        isScanning
          ? 'bg-blue-800 text-blue-200 cursor-wait'
          : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/50 hover:shadow-cyan-600/40 border border-cyan-400/40'
      } ${className}`}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />

      {isScanning ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin text-cyan-300" />
          <span>Verifying Ticket...</span>
        </>
      ) : (
        <>
          <Camera className="w-6 h-6 text-cyan-300" />
          <span>Scan Ticket</span>
        </>
      )}
    </button>
  );
};
