'use client';

import React from 'react';
import { PriorityLevel } from '@/types/order.types';
import { cn } from '@/lib/utils/cn';

interface PriorityBadgeProps {
  score?: number;
  level: PriorityLevel;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ score, level, className }) => {
  let color = 'text-slate-400 bg-slate-900 border-slate-700';
  let dotColor = 'bg-slate-400';

  if (level === 'critical') {
    color = 'text-red-400 bg-red-950/80 border-red-800 animate-pulse';
    dotColor = 'bg-red-500';
  } else if (level === 'high') {
    color = 'text-amber-400 bg-amber-950/80 border-amber-800';
    dotColor = 'bg-amber-500';
  } else if (level === 'medium') {
    color = 'text-sky-400 bg-sky-950/80 border-sky-800';
    dotColor = 'bg-sky-500';
  } else {
    color = 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    dotColor = 'bg-emerald-500';
  }

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-bold uppercase', color, className)}>
      <span className={cn('h-2 w-2 rounded-full', dotColor)} />
      <span>{level}</span>
      {score !== undefined && <span className="opacity-80">({score.toFixed(1)})</span>}
    </div>
  );
};
