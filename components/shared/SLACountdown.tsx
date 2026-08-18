'use client';

import React, { useState, useEffect } from 'react';
import { calculateSLARisk, SLARiskStatus } from '@/lib/warehouse/sla-calculator';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SLACountdownProps {
  deadlineISO?: string;
  className?: string;
}

export const SLACountdown: React.FC<SLACountdownProps> = ({ deadlineISO, className }) => {
  const [risk, setRisk] = useState<SLARiskStatus>(() => calculateSLARisk(deadlineISO));

  useEffect(() => {
    const timer = setInterval(() => {
      setRisk(calculateSLARisk(deadlineISO));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadlineISO]);

  let badgeStyle = 'bg-slate-900/80 text-sky-400 border-slate-700';
  if (risk.status === 'breached') {
    badgeStyle = 'bg-red-950 text-red-400 border-red-800 animate-bounce';
  } else if (risk.status === 'critical') {
    badgeStyle = 'bg-red-950/90 text-red-300 border-red-800 animate-pulse';
  } else if (risk.status === 'warning') {
    badgeStyle = 'bg-amber-950/80 text-amber-300 border-amber-800';
  }

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold border', badgeStyle, className)}>
      {risk.is_breached ? <AlertTriangle className="h-3.5 w-3.5 text-red-500 animate-pulse" /> : <Clock className="h-3.5 w-3.5" />}
      <span>{risk.formatted_time}</span>
    </div>
  );
};
