'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Lock, ArrowRight, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export default function FEFOAllocationStationPage() {
  const orders = INITIAL_ORDERS.filter((o) => o.status === 'inventory_checked' || o.status === 'allocated');

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
          <Lock className="h-6 w-6 text-purple-400" /> FEFO/FIFO STOCK LOCKING STATION
        </h1>
        <p className="text-xs text-slate-400">First-Expired-First-Out automated batch locking & inventory reservation</p>
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between p-4 rounded-xl border border-purple-900/40 bg-purple-950/20 shadow-lg">
            <div>
              <strong className="text-sm font-bold text-purple-300 block">{o.order_number}</strong>
              <span className="text-slate-400">Consignee: {o.customer_name} ({o.customer_tier?.toUpperCase()})</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-emerald-400 font-bold">{formatCurrency(o.total_value)}</span>
              <StatusBadge status={o.status} />
              <Link
                href={`/orders/${o.id}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 font-bold text-white transition"
              >
                Execute FEFO Lock <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
