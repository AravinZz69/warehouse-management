'use client';

import React from 'react';
import { OrderStatus } from '@/types/order.types';
import { cn } from '@/lib/utils/cn';

interface OrderDNABarProps {
  status: OrderStatus;
  priorityLevel?: string;
  isBreached?: boolean;
  className?: string;
}

const STAGES: { key: OrderStatus; label: string }[] = [
  { key: 'created', label: 'INT' },
  { key: 'priority_scored', label: 'PRI' },
  { key: 'inventory_checked', label: 'STK' },
  { key: 'allocated', label: 'ALC' },
  { key: 'picking', label: 'PCK' },
  { key: 'packing', label: 'PAK' },
  { key: 'quality_check', label: 'QAC' },
  { key: 'dispatched', label: 'DSP' },
];

export const OrderDNABar: React.FC<OrderDNABarProps> = ({ status, priorityLevel, isBreached, className }) => {
  const currentIdx = STAGES.findIndex((s) => s.key === status);
  const activeIndex = currentIdx === -1 ? (status === 'completed' ? 8 : 0) : currentIdx;

  return (
    <div className={cn('flex flex-col gap-1 w-full max-w-xs', className)}>
      <div className="flex items-center gap-1">
        {STAGES.map((st, idx) => {
          let segmentColor = 'bg-slate-800 border-slate-700';

          if (idx < activeIndex) {
            segmentColor = 'bg-emerald-500 border-emerald-400';
          } else if (idx === activeIndex) {
            if (isBreached || priorityLevel === 'critical') {
              segmentColor = 'bg-red-500 border-red-400 animate-pulse';
            } else if (priorityLevel === 'high') {
              segmentColor = 'bg-amber-500 border-amber-400 animate-pulse';
            } else {
              segmentColor = 'bg-sky-500 border-sky-400 animate-pulse';
            }
          }

          return (
            <div
              key={st.key}
              title={`${st.label}: ${idx <= activeIndex ? 'Completed / Active' : 'Pending'}`}
              className={cn('h-3 flex-1 rounded-xs border transition-all duration-300', segmentColor)}
            />
          );
        })}
      </div>
      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
        <span>DNA: {STAGES[activeIndex]?.label || 'CMP'}</span>
        <span className="uppercase text-[9px]">{status.replace(/_/g, ' ')}</span>
      </div>
    </div>
  );
};
