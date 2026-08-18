'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity } from 'lucide-react';

interface WarehousePulseGaugeProps {
  score: number;
}

export const WarehousePulseGauge: React.FC<WarehousePulseGaugeProps> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  let color = '#10B981'; // Emerald
  if (score < 60) color = '#EF4444'; // Red
  else if (score < 80) color = '#F59E0B'; // Amber

  const COLORS = [color, '#1E293B'];

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-[#0D131F] text-slate-100 shadow-xl relative">
      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
        <Activity className="h-4 w-4 text-sky-400" />
        <span>Industrial Pulse Gauge</span>
      </div>

      <div className="h-36 w-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              startAngle={180}
              endAngle={0}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1 text-center">
          <span className="text-2xl font-mono font-black tracking-tight" style={{ color }}>
            {score}
          </span>
          <span className="block text-[9px] font-mono text-slate-500 uppercase">/100 Index</span>
        </div>
      </div>
    </div>
  );
};
