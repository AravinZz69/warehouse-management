'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Boxes, ArrowRight, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export default function InventoryCheckStationPage() {
  const orders = INITIAL_ORDERS.filter((o) => o.status === 'priority_scored' || o.status === 'inventory_checked');

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
          <Boxes className="h-6 w-6 text-sky-400" /> STOCK VERIFICATION & AI SUBSTITUTION STATION
        </h1>
        <p className="text-xs text-slate-400">Automated stock availability check & intelligent SKU substitute analyzer</p>
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-[#0D131F] shadow-lg">
            <div>
              <strong className="text-sm font-bold text-sky-400 block">{o.order_number}</strong>
              <span className="text-slate-400">{o.item_count} Items | Consignee: {o.customer_name}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-emerald-400 font-bold">{formatCurrency(o.total_value)}</span>
              <StatusBadge status={o.status} />
              <Link
                href={`/orders/${o.id}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 font-bold text-white transition"
              >
                Verify Stock <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
