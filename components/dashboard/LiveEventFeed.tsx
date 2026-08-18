'use client';

import React from 'react';
import { useAlertStore } from '@/stores/alert.store';
import { Activity, Bell, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/format';

export const LiveEventFeed: React.FC = () => {
  const { alerts } = useAlertStore();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F] p-6 text-slate-900 dark:text-slate-100 shadow-sm h-full font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600 dark:text-sky-400 animate-pulse" />
          <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-slate-200">REALTIME TELEMETRY FEED</h3>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          CDC SYNC ACTIVE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-72 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 pr-1">
        {alerts.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 italic">No recent events logged.</div>
        ) : (
          alerts.map((alert) => {
            let Icon = Info;
            let iconColor = 'text-blue-600 dark:text-sky-400';
            if (alert.type === 'danger') {
              Icon = AlertTriangle;
              iconColor = 'text-rose-600 dark:text-red-400';
            } else if (alert.type === 'warning') {
              Icon = AlertTriangle;
              iconColor = 'text-amber-600 dark:text-amber-400';
            } else if (alert.type === 'success') {
              Icon = CheckCircle2;
              iconColor = 'text-emerald-600 dark:text-emerald-400';
            }

            return (
              <div
                key={alert.id}
                className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 text-xs transition hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <Icon className={`h-4 w-4 ${iconColor} shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-200 truncate">{alert.title}</span>
                    <span className="text-[9px] text-slate-400 shrink-0 ml-2 font-mono">{formatDateTime(alert.timestamp)}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{alert.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
