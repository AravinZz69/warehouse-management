'use client';

import React from 'react';
import { useARIAStore } from '@/stores/aria.store';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/format';

export const ARIASummaryPanel: React.FC = () => {
  const { summaries } = useARIAStore();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F] p-6 text-slate-900 dark:text-slate-100 shadow-sm font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-slate-200">SHIFT DEBRIEF & EXECUTIVE HANDOVER REGISTRY</h3>
        </div>
      </div>

      <div className="space-y-4">
        {summaries.map((sum) => (
          <div key={sum.id} className="p-4.5 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase">{sum.summary_type.replace(/_/g, ' ')}</span>
              <span className="text-[10px] text-slate-400 font-mono">{formatDateTime(sum.created_at)}</span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic font-medium">{sum.raw_ai_narrative}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Key Highlights
                </span>
                <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5 list-disc list-inside font-medium">
                  {sum.key_highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Recommended Priorities
                </span>
                <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5 list-disc list-inside font-medium">
                  {sum.recommended_priorities.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
