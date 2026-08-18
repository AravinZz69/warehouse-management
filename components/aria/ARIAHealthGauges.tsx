'use client';

import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, Activity } from 'lucide-react';

export const ARIAHealthGauges: React.FC = () => {
  const gauges = [
    { label: 'SLA Compliance Rate', value: '99.1%', status: 'optimal', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Inventory Stock Health', value: '96.4%', status: 'good', color: 'text-blue-600 dark:text-sky-400' },
    { label: 'Wave Picking Velocity', value: '142 units/hr', status: 'optimal', color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'QA First-Pass Yield', value: '99.8%', status: 'optimal', color: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {gauges.map((g, idx) => (
        <div key={idx} className="flex flex-col p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F] shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{g.label}</span>
          <span className={`text-2xl font-mono font-black mt-2 ${g.color}`}>{g.value}</span>
          <span className="text-[9px] font-medium text-slate-400 mt-1 uppercase">Target: 95.0% Benchmark</span>
        </div>
      ))}
    </div>
  );
};
