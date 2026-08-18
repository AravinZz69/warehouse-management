'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export default function QCQueuePage() {
  const orders = INITIAL_ORDERS.filter((o) => o.status === 'packing' || o.status === 'quality_check');

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" /> QUALITY CONTROL (QA) INSPECTION DESK
        </h1>
        <p className="text-xs text-slate-500 font-medium">7-Point Inspection Protocol & Defect Logger</p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm gap-4 transition hover:border-emerald-500">
            <div>
              <strong className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono block">{o.order_number}</strong>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Inspector: Sarah Jenkins | Items: {o.item_count}</span>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(o.total_value)}</span>
              <Link
                href={`/lifecycle/quality-check/${o.id}`}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-semibold text-white text-xs transition shadow-2xs"
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
