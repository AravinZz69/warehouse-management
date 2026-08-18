'use client';

import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, Activity } from 'lucide-react';

export const ARIAHealthGauges: React.FC = () => {
  const gauges = [
    { label: 'SLA Compliance Rate', value: '99.1%', status: 'optimal', color: 'text-emerald-400' },
    { label: 'Inventory Stock Health', value: '96.4%', status: 'good', color: 'text-sky-400' },
    { label: 'Wave Picking Velocity', value: '142 units/hr', status: 'optimal', color: 'text-emerald-400' },
    { label: 'QA First-Pass Yield', value: '99.8%', status: 'optimal', color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {gauges.map((g, idx) => (
        <div key={idx} className="flex flex-col p-4 rounded-xl border border-slate-800 bg-[#0D131F] shadow-lg">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{g.label}</span>
          <span className={`text-2xl font-mono font-black mt-2 ${g.color}`}>{g.value}</span>
          <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase">Target: 95.0% Benchmark</span>
        </div>
      ))}
    </div>
  );
};
