import React, { useEffect, useState, useRef } from 'react';
import { FestivalLogo } from './FestivalLogo';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  durationMs = 2400,
}) => {
  const [stage, setStage] = useState<'enter' | 'glow' | 'exit'>('enter');
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Stage transitions
    const glowTimer = setTimeout(() => {
      setStage('glow');
    }, 400);

    // Progress bar animation interval - drives exit/complete too
    const interval = 20;
    const step = 100 / (durationMs / interval);
    let completed = false;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + step, 100);

        // Drive exit at ~83% (matches old durationMs - 400 timing)
        if (!completed && next >= 83) {
          setStage('exit');
        }

        // Complete at 100%
        if (!completed && next >= 100) {
          completed = true;
          completedRef.current = true;
          onCompleteRef.current();
        }

        return next;
      });
    }, interval);

    return () => {
      clearTimeout(glowTimer);
      clearInterval(progressTimer);
    };
  }, [durationMs]);

  const handleSkip = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onCompleteRef.current();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#050b18] text-white transition-opacity duration-500 ${
        stage === 'exit' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle Background Radial Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl" />
        {/* Decorative Grid Mesh */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top subtle badge */}
      <div className="w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-[11px] text-blue-300">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Official Gate Verification</span>
        </div>
        <button
          onClick={handleSkip}
          className="text-xs text-blue-400/80 hover:text-blue-200 transition-colors px-2 py-1"
        >
          Skip
        </button>
      </div>

      {/* Center Animated Logo Showcase */}
      <div className="flex flex-col items-center justify-center my-auto z-10">
        <div
          className={`relative transition-all duration-700 transform ${
            stage === 'enter'
              ? 'opacity-0 scale-90 translate-y-4'
              : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl opacity-20 blur-xl animate-pulse" />

          {/* Logo with Floating animation */}
          <div className="relative p-6 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-blue-500/20 shadow-2xl shadow-blue-950">
            <FestivalLogo size="lg" showSubtitle={true} />
          </div>
        </div>

        {/* Pulse tagline */}
        <div className="mt-8 flex items-center gap-2 text-xs text-blue-300/80 tracking-widest font-mono uppercase">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>Ticket Verification Protocol</span>
        </div>
      </div>

      {/* Bottom Progress Bar & Version info */}
      <div className="w-full max-w-xs z-10 flex flex-col items-center gap-3">
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden border border-blue-900/30">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] text-blue-400/60 font-mono">
          System Ready • v2.6.0
        </span>
      </div>
    </div>
  );
};