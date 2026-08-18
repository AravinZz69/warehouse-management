'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const normalized = status.toLowerCase();

  let styleClass = 'bg-slate-800/80 text-slate-300 border-slate-700';

  if (
    ['received', 'dispatched', 'completed', 'paid', 'active', 'shipped', 'delivered', 'fulfilled', 'executed'].includes(
      normalized
    )
  ) {
    styleClass = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60 shadow-[0_0_10px_rgba(16,185,129,0.15)]';
  } else if (
    ['ordered', 'picking', 'packing', 'quality_check', 'partially_received', 'warning', 'medium', 'high', 'in_progress', 'pending'].includes(
      normalized
    )
  ) {
    styleClass = 'bg-amber-950/60 text-amber-400 border-amber-800/60 shadow-[0_0_10px_rgba(245,158,11,0.15)]';
  } else if (
    ['cancelled', 'failed', 'breached', 'critical', 'danger', 'refunded', 'on_hold'].includes(normalized)
  ) {
    styleClass = 'bg-red-950/60 text-red-400 border-red-800/60 shadow-[0_0_10px_rgba(239,68,68,0.15)]';
  } else if (['allocated', 'inventory_checked', 'priority_scored', 'created', 'info'].includes(normalized)) {
    styleClass = 'bg-sky-950/60 text-sky-400 border-sky-800/60 shadow-[0_0_10px_rgba(14,165,233,0.15)]';
  } else if (['auto_triggered', 'recommendation'].includes(normalized)) {
    styleClass = 'bg-purple-950/60 text-purple-400 border-purple-800/60 shadow-[0_0_10px_rgba(139,92,246,0.15)]';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider border font-mono',
        styleClass,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {status.replace(/_/g, ' ')}
    </span>
  );
};
