'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useScannerStore } from '@/stores/scanner.store';
import { Camera, Volume2, VolumeX, RefreshCw, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface BarcodeScannerHUDProps {
  onScanSuccess?: (code: string) => void;
  title?: string;
  className?: string;
}

export const BarcodeScannerHUD: React.FC<BarcodeScannerHUDProps> = ({
  onScanSuccess,
  title = 'Hardware Camera Barcode Scanner HUD',
  className,
}) => {
  const { isScanning, mode, lastScannedCode, scanHistory, audioBeepEnabled, setScanning, setMode, recordScan, setAudioBeepEnabled } =
    useScannerStore();

  const [manualCode, setManualCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    setScanning(true);
    setCameraActive(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
    }
  };

  const stopCamera = () => {
    setScanning(false);
    setCameraActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleSimulateScan = (codeToScan?: string) => {
    const targetCode = codeToScan || manualCode || '8901234567890';
    recordScan(targetCode);
    setScanMessage(`Scanned: ${targetCode}`);
    if (onScanSuccess) {
      onScanSuccess(targetCode);
    }
    if (mode === 'single') {
      stopCamera();
    }
    setManualCode('');
    setTimeout(() => setScanMessage(null), 3000);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className={cn('flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F] p-6 text-slate-900 dark:text-slate-100 shadow-sm font-sans', className)}>
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-600 animate-pulse" />
          <h3 className="text-sm font-bold uppercase text-blue-600 dark:text-sky-400 tracking-wider">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAudioBeepEnabled(!audioBeepEnabled)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-blue-600 transition"
            title="Toggle Audio Feedback"
          >
            {audioBeepEnabled ? <Volume2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
          </button>
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-900 text-xs">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={cn('px-3 py-1 rounded-lg font-semibold transition', mode === 'single' ? 'bg-blue-600 text-white font-bold' : 'text-slate-500 dark:text-slate-400')}
            >
              Single
            </button>
            <button
              type="button"
              onClick={() => setMode('continuous')}
              className={cn('px-3 py-1 rounded-lg font-semibold transition', mode === 'continuous' ? 'bg-blue-600 text-white font-bold' : 'text-slate-500 dark:text-slate-400')}
            >
              Continuous
            </button>
          </div>
        </div>
      </div>

      {/* Camera Viewfinder View */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-black flex items-center justify-center">
        {cameraActive ? (
          <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-400 p-6 text-center">
            <Camera className="h-12 w-12 text-slate-600" />
            <p className="text-xs text-slate-400 font-medium">Camera Feed Standby. Click to initialize lens viewfinder.</p>
            <button
              type="button"
              onClick={startCamera}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white transition shadow-sm"
            >
              <Camera className="h-4 w-4" /> Activate Camera HUD
            </button>
          </div>
        )}

        {/* Laser Reticle Overlay */}
        {cameraActive && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-48 w-64 border-2 border-dashed border-blue-400/80 rounded-xl">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)] animate-pulse" />
              <div className="absolute top-2 left-2 text-[10px] font-bold text-blue-400 bg-black/80 px-2 py-0.5 rounded">
                AIM LASER AT BARCODE
              </div>
            </div>
          </div>
        )}

        {/* Scan Toast Message Overlay */}
        {scanMessage && (
          <div className="absolute bottom-4 left-4 right-4 bg-emerald-900/90 border border-emerald-500 text-emerald-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 justify-center shadow-xl animate-fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{scanMessage}</span>
          </div>
        )}
      </div>

      {/* Manual Input Fallback & Action Toolbar */}
      <div className="flex flex-col gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSimulateScan();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter or scan Barcode / SKU (e.g. 8901234567890)..."
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-blue-600 dark:text-sky-400 transition"
          >
            Verify Scan
          </button>
        </form>

        {/* Demo Quick Scan Triggers */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">Simulate Scan:</span>
          <button
            type="button"
            onClick={() => handleSimulateScan('8901234567890')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-blue-600 dark:text-sky-400 hover:border-blue-500 transition shrink-0 font-bold"
          >
            SKU-LAPT-001
          </button>
          <button
            type="button"
            onClick={() => handleSimulateScan('8901234567891')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-blue-600 dark:text-sky-400 hover:border-blue-500 transition shrink-0 font-bold"
          >
            SKU-MONI-4K27
          </button>
          <button
            type="button"
            onClick={() => handleSimulateScan('BIN-A-12-3')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-amber-600 dark:text-amber-400 hover:border-amber-500 transition shrink-0 font-bold"
          >
            BIN: A-12-3
          </button>
        </div>

        {/* Scan Log History */}
        {scanHistory.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Last Scan: <strong className="text-blue-600 dark:text-sky-400 font-mono">{lastScannedCode}</strong></span>
            <span>Total Scans: {scanHistory.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};
