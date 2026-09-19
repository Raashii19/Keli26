import { useEffect, useRef, useState, useId } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Zap, ZapOff, RefreshCw, AlertCircle, Loader2, WifiOff } from 'lucide-react';

interface QRScannerFrameProps {
  onDecoded: (text: string) => void;
  isActive: boolean;
  onError?: (message: string) => void;
  className?: string;
}

export const QRScannerFrame: React.FC<QRScannerFrameProps> = ({
  onDecoded,
  isActive,
  onError,
  className = '',
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [hasError, setHasError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [attempt, setAttempt] = useState(0);
  const decodedRef = useRef(false);
  const scannerId = useId();

  useEffect(() => {
    if (!isActive) return;

    let mounted = true;
    decodedRef.current = false;

    const initScanner = async () => {
      try {
        setIsLoading(true);
        setHasError(null);

        const scanner = new Html5Qrcode(scannerId);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode },
          {
            fps: 10,
            qrbox: { width: 240, height: 240 },
          },
          (decodedText: string) => {
            if (!decodedRef.current && mounted) {
              decodedRef.current = true;
              scanner.stop().catch(() => {});
              onDecoded(decodedText);
            }
          },
          () => {}
        );
      } catch (err) {
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : 'Unknown camera error';
        setHasError(msg);
        onError?.(msg);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initScanner();

    return () => {
      mounted = false;
      scannerRef.current?.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, [isActive, facingMode, attempt, onDecoded, onError, scannerId]);

  const handleTorchToggle = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.applyVideoConstraints(
          { advanced: [{ torch: !torchOn }] } as unknown as MediaTrackConstraints
        );
        setTorchOn(!torchOn);
      }
    } catch {
      // Torch not supported on this device/browser
    }
  };

  const handleCameraFlip = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    setTorchOn(false);
  };

  const handleRetry = () => {
    setAttempt((a) => a + 1);
  };

  const isPermissionError = hasError?.includes('permission') || hasError?.includes('denied') || hasError?.includes('NotAllowed');
  const isNotFoundError = hasError?.includes('not found') || hasError?.includes('NotFound') || hasError?.includes('No camera') || hasError?.includes('devices');

  return (
    <div
      id={scannerId}
      className={`relative w-full aspect-square overflow-hidden ${className}`}
      style={{ minHeight: 280 }}
    >
      <div className="w-full h-full bg-[#050b18] rounded-xl border border-blue-800/50 overflow-hidden" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050b18]/95 z-10">
          <div className="text-center text-blue-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-sm">Initializing camera...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050b18]/95 p-4 text-center z-10">
          {isPermissionError ? (
            <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
          ) : isNotFoundError ? (
            <WifiOff className="w-10 h-10 text-rose-400 mb-3" />
          ) : (
            <AlertCircle className="w-10 h-10 text-rose-400 mb-3" />
          )}
          <p className="text-blue-300 text-sm mb-2 max-w-xs px-4">
            {isPermissionError
              ? 'Camera permission denied. Allow camera in browser settings, then retry.'
              : isNotFoundError
                ? 'No camera found on this device.'
                : 'Camera error.'}
          </p>
          <p className="text-xs text-blue-500/70 font-mono mb-4 max-w-xs px-2 break-all">
            {hasError}
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
          >
            Retry Camera
          </button>
        </div>
      )}

      {/* Control buttons overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4 z-20">
        <div className="w-full flex justify-between">
          <button
            onClick={handleTorchToggle}
            disabled={facingMode === 'user'}
            className={`p-2 rounded-full bg-[#0a152f]/90 backdrop-blur-sm border pointer-events-auto ${
              torchOn
                ? 'border-cyan-500/60 text-cyan-400'
                : 'border-blue-700/50 text-blue-400'
            } transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            title={torchOn ? 'Turn off flashlight' : facingMode === 'user' ? 'Flash unavailable on front camera' : 'Turn on flashlight'}
          >
            {torchOn ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
          </button>
          <button
            onClick={handleCameraFlip}
            className="p-2 rounded-full bg-[#0a152f]/90 backdrop-blur-sm border border-blue-700/50 text-blue-400 hover:border-cyan-500/50 hover:text-cyan-300 transition-all pointer-events-auto"
            title="Switch camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2">
          {facingMode === 'environment' && !torchOn && (
            <span className="px-3 py-1 bg-[#0a152f]/90 backdrop-blur-sm border border-blue-700/50 text-blue-400 text-xs rounded-full">
              Tap flashlight for low light
            </span>
          )}
        </div>
      </div>
    </div>
  );
};