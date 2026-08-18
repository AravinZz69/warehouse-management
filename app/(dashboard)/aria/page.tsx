'use client';

import React, { useEffect } from 'react';
import { ARIAHealthGauges } from '@/components/aria/ARIAHealthGauges';
import { ARIAChatConsole } from '@/components/aria/ARIAChatConsole';
import { ARIADecisionCard } from '@/components/aria/ARIADecisionCard';
import { ARIASummaryPanel } from '@/components/aria/ARIASummaryPanel';
import { ARIASuggestionsCard } from '@/components/aria/ARIASuggestionsCard';
import { useARIAStore } from '@/stores/aria.store';
import { Cpu, RefreshCw, Zap, Sparkles } from 'lucide-react';

export default function ARIAIntelligenceHQPage() {
  const { decisions, isAnalyzing, setAnalyzing } = useARIAStore();

  useEffect(() => {
    // Automatically trigger autonomous telemetry analysis on page load
    const autoAnalyze = async () => {
      setAnalyzing(true);
      try {
        await fetch('/api/aria/analyze', { method: 'POST' });
      } catch (err) {
        console.error('Auto analysis on load failed:', err);
      } finally {
        setAnalyzing(false);
      }
    };
    autoAnalyze();
  }, [setAnalyzing]);

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
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-purple-600 dark:text-purple-400 animate-pulse" /> ARIA AUTONOMOUS INTELLIGENCE HQ
          </h1>
          <p className="text-xs text-slate-500 font-medium">4-Stage Autonomous AI Engine (Detect → Decide → Recommend/Trigger → Summarize)</p>
        </div>

        <button
          type="button"
          disabled={isAnalyzing}
          onClick={handleTriggerAnalysis}
          className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2.5 text-xs font-semibold text-white transition shadow-sm disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 text-amber-300" />}
          <span>TRIGGER AUTONOMOUS ANALYTICS LOOP</span>
        </button>
      </div>

      {/* Composite Health Gauges */}
      <ARIAHealthGauges />

      {/* Automated AI Suggestions, Recommendations & Actionable Next Steps */}
      <ARIASuggestionsCard />

      {/* Interactive Operational Terminal Console */}
      <ARIAChatConsole />

      {/* Live Autonomous Decision Stream & Shift Handover Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white uppercase text-sm flex items-center gap-2">
            <Cpu className="h-5 w-5 text-purple-600 dark:text-purple-400" /> ACTIVE AUTONOMOUS DECISION STREAM ({decisions.length})
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
