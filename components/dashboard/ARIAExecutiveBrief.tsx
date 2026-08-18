'use client';

import React, { useState } from 'react';
import { useARIAStore } from '@/stores/aria.store';
import { Cpu, AlertTriangle, Sparkles, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { runGeminiJSON } from '@/lib/gemini/client';
import { buildExecutiveSummaryPrompt } from '@/lib/gemini/prompts';
import { ExecutiveSummaryOutputSchema } from '@/lib/gemini/schemas';

export const ARIAExecutiveBrief: React.FC = () => {
  const { pulseScore, summaries, addSummary, isAnalyzing, setAnalyzing } = useARIAStore();
  const [generatedHandover, setGeneratedHandover] = useState<string | null>(null);

  const latestSummary = summaries[0];

  const handleGenerateShiftHandover = async () => {
    setAnalyzing(true);
    try {
      const prompt = buildExecutiveSummaryPrompt({
        period: 'Morning Shift (06:00 - 14:00)',
        total_orders_fulfilled: 184,
        total_revenue: 42850,
        sla_compliance_pct: 99.1,
        health_score: pulseScore,
        decisions_executed: 5,
        stockout_skus: ['SKU-LAPT-001'],
      });

      const res = await runGeminiJSON(prompt, ExecutiveSummaryOutputSchema.parse);
      addSummary({
        id: `sum-${Date.now()}`,
        summary_type: res.summary_type,
        period_start: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        period_end: new Date().toISOString(),
        health_score: res.health_score,
        key_highlights: res.key_highlights,
        critical_blockers: res.critical_blockers,
        actions_taken_count: res.actions_taken_count,
        recommended_priorities: res.recommended_priorities,
        raw_ai_narrative: res.raw_ai_narrative,
        created_at: new Date().toISOString(),
      });
      setGeneratedHandover(res.raw_ai_narrative);
    } catch (err) {
      console.error('Error generating shift handover:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-purple-900/50 bg-white dark:bg-gradient-to-r dark:from-[#0D131F] dark:via-[#131B2B] dark:to-[#120C24] p-6 shadow-sm dark:shadow-2xl">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 dark:bg-purple-600/10 blur-3xl" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left Column: Pulse & AI Brief Title */}
        <div className="flex items-start gap-4">
          <div className="relative flex items-center justify-center h-14 w-14 rounded-xl bg-blue-50 dark:bg-purple-950/80 border border-blue-200 dark:border-purple-800 shrink-0">
            <Cpu className="h-7 w-7 text-blue-600 dark:text-purple-400 animate-pulse" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">ARIA EXECUTIVE BRIEFING</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-purple-950 text-blue-700 dark:text-purple-300 border border-blue-200 dark:border-purple-800 text-[10px] font-bold uppercase">
                Pulse: {pulseScore}/100
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
              {latestSummary?.key_highlights[0] ||
                'Warehouse pulse score is 92/100. Fulfillment velocity healthy at 184 orders/shift. 1 SKU safety stock alert active.'}
            </p>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            type="button"
            disabled={isAnalyzing}
            onClick={handleGenerateShiftHandover}
            className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-purple-600 dark:to-sky-600 px-4 py-2.5 text-xs font-semibold text-white transition shadow-sm disabled:opacity-50"
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>1-Click Shift Handover Report</span>
          </button>
        </div>
      </div>

      {/* Generated Handover Banner */}
      {generatedHandover && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-purple-900/40 text-xs text-slate-800 dark:text-purple-200 bg-slate-50 dark:bg-purple-950/30 p-3 rounded-xl flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="text-blue-600 dark:text-purple-300 block mb-1">Generated Shift Handover Narrative:</strong>
            <p>{generatedHandover}</p>
          </div>
        </div>
      )}
    </div>
  );
};
