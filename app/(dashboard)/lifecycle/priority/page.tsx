'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { SLACountdown } from '@/components/shared/SLACountdown';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export default function PriorityStationPage() {
  const orders = INITIAL_ORDERS.filter((o) => o.status === 'created' || o.status === 'priority_scored');

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" /> PRIORITY SCORING & OVERRIDE QUEUE
        </h1>
        <p className="text-xs text-slate-500 font-medium">Pure SLA urgency math, customer tier multipliers & priority queue ranking</p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm gap-4 transition hover:border-blue-500">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <strong className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">{o.order_number}</strong>
                <PriorityBadge score={o.priority_score} level={o.priority_level} />
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium block">
                {o.customer_name} ({o.customer_tier?.toUpperCase()} Tier)
              </span>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <SLACountdown deadlineISO={o.sla_deadline} />
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(o.total_value)}</span>
              <Link
                href={`/orders/${o.id}`}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white text-xs transition shadow-2xs"
              >
                Inspect Order <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
