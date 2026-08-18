'use client';

import React, { useState } from 'react';
import { ARIADecision } from '@/types/aria.types';
import { useARIAStore } from '@/stores/aria.store';
import { useAlertStore } from '@/stores/alert.store';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Cpu, AlertTriangle, CheckCircle2, Zap, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ARIADecisionCardProps {
  decision: ARIADecision;
}

export const ARIADecisionCard: React.FC<ARIADecisionCardProps> = ({ decision }) => {
  const { updateDecisionStatus } = useARIAStore();
  const { addAlert } = useAlertStore();
  const [executing, setExecuting] = useState(false);

  const isAutoExecuted = decision.execution_mode === 'auto_triggered' || decision.confidence_score >= 85;
  const isExecuted = decision.execution_status === 'executed';

  const handleExecuteAction = async () => {
    setExecuting(true);
    try {
      if (decision.suggested_action?.endpoint) {
        await fetch(decision.suggested_action.endpoint, {
          method: decision.suggested_action.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(decision.suggested_action.body || {}),
        });
      }
      updateDecisionStatus(decision.id, 'executed');
      addAlert({
        type: 'success',
        title: `ARIA Autonomous Action Executed`,
        message: decision.suggested_action.title,
      });
    } catch (err) {
      console.error('Failed to execute ARIA decision:', err);
      updateDecisionStatus(decision.id, 'failed');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl border p-6 transition-all shadow-sm font-sans',
        decision.severity === 'critical'
          ? 'border-rose-200 bg-rose-50/50 dark:border-red-900/60 dark:bg-gradient-to-b dark:from-[#180C14] dark:to-[#0D131F]'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F]'
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-purple-600 dark:text-purple-400 animate-pulse" />
          <span className="text-xs font-bold uppercase text-purple-700 dark:text-purple-300 tracking-wider">
            {decision.decision_type.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={decision.severity} />
          <span
            className={cn(
              'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
              decision.confidence_score >= 85
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800'
            )}
          >
            Conf: {decision.confidence_score}%
          </span>
        </div>
      </div>

      {/* Problem & Cause Block */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{decision.detected_problem.title}</h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{decision.detected_problem.description}</p>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <strong className="text-purple-600 dark:text-purple-400 block mb-1">Root Cause Analysis:</strong>
          {decision.root_cause_analysis}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Mode:</span>
          <strong className="text-slate-900 dark:text-slate-200 uppercase font-bold">{decision.execution_mode}</strong>
        </div>

        {isExecuted ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Executed
          </span>
        ) : (
          <button
            type="button"
            disabled={executing}
            onClick={handleExecuteAction}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            {executing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : isAutoExecuted ? (
              <Zap className="h-4 w-4 text-amber-300" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span>{decision.suggested_action.title}</span>
          </button>
        )}
      </div>
    </div>
  );
};
