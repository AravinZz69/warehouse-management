'use client';

import React from 'react';
import { ARIAHealthGauges } from '@/components/aria/ARIAHealthGauges';
import { ARIAChatConsole } from '@/components/aria/ARIAChatConsole';
import { ARIADecisionCard } from '@/components/aria/ARIADecisionCard';
import { ARIASummaryPanel } from '@/components/aria/ARIASummaryPanel';
import { useARIAStore } from '@/stores/aria.store';
import { Cpu, RefreshCw, Zap } from 'lucide-react';

export default function ARIAIntelligenceHQPage() {
  const { decisions, isAnalyzing, setAnalyzing } = useARIAStore();

  const handleTriggerAnalysis = async () => {
    setAnalyzing(true);
    try {
      await fetch('/api/aria/analyze', { method: 'POST' });
    } catch (err) {
      console.error('Trigger analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-900/40 pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase text-purple-300 flex items-center gap-2">
            <Cpu className="h-6 w-6 text-purple-400 animate-pulse" /> ARIA AUTONOMOUS INTELLIGENCE HQ
          </h1>
          <p className="text-xs text-slate-400">4-Stage Autonomous Engine (Detect → Decide → Recommend/Trigger → Summarize)</p>
        </div>

        <button
          type="button"
          disabled={isAnalyzing}
          onClick={handleTriggerAnalysis}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 px-4 py-2.5 text-xs font-bold text-white transition shadow-lg disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 text-amber-300" />}
          <span>TRIGGER AUTONOMOUS ANALYTICS LOOP</span>
        </button>
      </div>

      {/* Composite Health Gauges */}
      <ARIAHealthGauges />

      {/* Interactive Operational Terminal Console */}
      <ARIAChatConsole />

      {/* Live Autonomous Decision Stream & Shift Handover Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-100 uppercase text-sm flex items-center gap-2">
            <Cpu className="h-5 w-5 text-purple-400" /> ACTIVE AUTONOMOUS DECISION STREAM ({decisions.length})
          </h3>
          <div className="space-y-4">
            {decisions.map((dec) => (
              <ARIADecisionCard key={dec.id} decision={dec} />
            ))}
          </div>
        </div>

        <div>
          <ARIASummaryPanel />
        </div>
      </div>
    </div>
  );
}
