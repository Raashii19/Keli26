import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] caught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const err = this.state.error;
      return (
        <div className="min-h-screen bg-[#050b18] text-slate-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a152f] border-2 border-rose-500/50 rounded-3xl p-8 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 border-2 border-rose-400/60 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-black text-rose-400 uppercase tracking-wide mb-2">
              Something went wrong
            </h2>

            <p className="text-xs text-blue-300/80 mb-4 max-w-xs mx-auto">
              The app hit an unexpected error. The details below can help debugging.
            </p>

            <div className="mb-6 p-3 rounded-xl bg-[#050b18] border border-rose-900/50 text-left text-[11px] font-mono text-rose-200 max-h-40 overflow-auto">
              {err?.message || 'Unknown error'}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleRetry}
                className="px-5 py-3 rounded-full bg-blue-950 hover:bg-blue-900/60 border border-blue-800 text-blue-300 font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-950 transition-transform active:scale-95 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload App
              </button>
            </div>

            <p className="mt-4 text-[11px] text-blue-500/60 font-mono">
              KELI26 v2.6 • Error Boundary Active
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}