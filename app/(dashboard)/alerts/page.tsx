'use client';

import React from 'react';
import { useAlertStore } from '@/stores/alert.store';
import { Bell, AlertTriangle, CheckCircle2, Info, Trash2 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/format';

export default function AlertsPage() {
  const { alerts, markAsRead, clearAlerts } = useAlertStore();

  return (
    <div className="space-y-6 font-mono text-xs max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
            <Bell className="h-6 w-6 text-sky-400" /> REALTIME OPERATIONAL ALERT CENTRAL
          </h1>
          <p className="text-xs text-slate-400">Streamed CDC Anomaly Detection & Operational Events</p>
        </div>

        <button
          type="button"
          onClick={clearAlerts}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition"
        >
          <Trash2 className="h-4 w-4" /> Clear All Alerts
        </button>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic rounded-xl border border-slate-800 bg-[#0D131F]">
            No active operational alerts. System operating normally.
          </div>
        ) : (
          alerts.map((a) => (
            <div
              key={a.id}
              onClick={() => markAsRead(a.id)}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 cursor-pointer transition ${
                a.read ? 'bg-slate-900/40 border-slate-800/60 opacity-70' : 'bg-[#0D131F] border-slate-700 shadow-lg'
              }`}
            >
              <div className="flex items-start gap-3">
                {a.type === 'danger' && <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />}
                {a.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />}
                {a.type === 'info' && <Info className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />}
                {a.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />}

                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{a.title}</h4>
                  <p className="text-slate-300 text-xs mt-0.5">{a.message}</p>
                </div>
              </div>

              <span className="text-[10px] text-slate-500 shrink-0">{formatDateTime(a.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
