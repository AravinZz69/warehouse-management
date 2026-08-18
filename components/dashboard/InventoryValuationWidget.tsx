'use client';

import React from 'react';
import { DollarSign, TrendingUp, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

interface InventoryValuationWidgetProps {
  purchaseValuation: number;
  retailValuation: number;
  grossMargin: number;
  marginPct: number;
}

export const InventoryValuationWidget: React.FC<InventoryValuationWidgetProps> = ({
  purchaseValuation,
  retailValuation,
  grossMargin,
  marginPct,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F] p-6 text-slate-900 dark:text-slate-100 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-slate-200">TOTAL ASSET VALUATION (FIFO)</h3>
        </div>
        <span className="text-[10px] font-bold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-sky-800">
          AUDITED
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Book Asset Cost</span>
          <span className="text-lg font-mono font-bold text-blue-600 dark:text-sky-400 mt-1">{formatCurrency(purchaseValuation)}</span>
          <span className="text-[9px] text-slate-400 mt-0.5 font-medium">FIFO Costing Basis</span>
        </div>

        <div className="flex flex-col p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Potential Gross Margin</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(grossMargin)}</span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              +{marginPct}%
            </span>
          </div>
          <span className="text-[9px] text-slate-400 mt-0.5 font-medium">Retail: {formatCurrency(retailValuation)}</span>
        </div>
      </div>
    </div>
  );
};
