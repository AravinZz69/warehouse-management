'use client';

import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Clock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

export default function AnalyticsPage() {
  const throughputData = [
    { shift: 'Shift A (06:00)', picks: 140, packs: 135, dispatches: 130 },
    { shift: 'Shift B (12:00)', picks: 185, packs: 180, dispatches: 175 },
    { shift: 'Shift C (18:00)', picks: 120, packs: 115, dispatches: 110 },
  ];

  const slaData = [
    { day: 'Mon', compliance: 99.4 },
    { day: 'Tue', compliance: 98.8 },
    { day: 'Wed', compliance: 99.1 },
    { day: 'Thu', compliance: 99.5 },
    { day: 'Fri', compliance: 99.2 },
  ];

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-sky-400" /> WAREHOUSE ANALYTICS & SLA COMPLIANCE
        </h1>
        <p className="text-xs text-slate-400">Shift Throughput Velocity, Picking Errors & Demand Forecasts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shift Throughput Chart */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0D131F] space-y-4 shadow-xl">
          <h3 className="font-bold text-slate-200 uppercase text-sm">Shift Fulfillment Throughput</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={throughputData}>
                <XAxis dataKey="shift" stroke="#475569" fontSize={10} fontStyle="mono" />
                <YAxis stroke="#475569" fontSize={10} fontStyle="mono" />
                <Tooltip contentStyle={{ backgroundColor: '#0D131F', borderColor: '#1E293B', color: '#F8FAFC' }} />
                <Bar dataKey="picks" fill="#0EA5E9" name="Picks" />
                <Bar dataKey="packs" fill="#8B5CF6" name="Packs" />
                <Bar dataKey="dispatches" fill="#10B981" name="Dispatches" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Compliance Trend */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0D131F] space-y-4 shadow-xl">
          <h3 className="font-bold text-slate-200 uppercase text-sm">5-Day SLA Compliance Trend (%)</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={slaData}>
                <XAxis dataKey="day" stroke="#475569" fontSize={10} fontStyle="mono" />
                <YAxis domain={[95, 100]} stroke="#475569" fontSize={10} fontStyle="mono" />
                <Tooltip contentStyle={{ backgroundColor: '#0D131F', borderColor: '#1E293B', color: '#F8FAFC' }} />
                <Line type="monotone" dataKey="compliance" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
