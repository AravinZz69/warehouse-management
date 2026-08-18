import { create } from 'zustand';

export type ScannerMode = 'single' | 'continuous';

interface ScannerState {
  isScanning: boolean;
  mode: ScannerMode;
  lastScannedCode: string | null;
  scanHistory: string[];
  audioBeepEnabled: boolean;
  setScanning: (active: boolean) => void;
  setMode: (mode: ScannerMode) => void;
  recordScan: (code: string) => void;
  setAudioBeepEnabled: (enabled: boolean) => void;
  playBeep: () => void;
}

export const useScannerStore = create<ScannerState>((set, get) => ({
  isScanning: false,
  mode: 'single',
  lastScannedCode: null,
  scanHistory: [],
  audioBeepEnabled: true,
  setScanning: (active) => set({ isScanning: active }),
  setMode: (mode) => set({ mode }),
  recordScan: (code) => {
    const state = get();
    if (state.audioBeepEnabled) {
      state.playBeep();
    }
    set({
      lastScannedCode: code,
      scanHistory: [code, ...state.scanHistory.slice(0, 49)],
    });
  },
  setAudioBeepEnabled: (enabled) => set({ audioBeepEnabled: enabled }),
  playBeep: () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime); // High pitch beep
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio context block safeguard
    }
  },
}));
