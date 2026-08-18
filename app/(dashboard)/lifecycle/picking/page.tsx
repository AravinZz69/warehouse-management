'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { PickingRouteMap } from '@/components/lifecycle/PickingRouteMap';
import { Truck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export default function WavePickingQueuePage() {
  const orders = INITIAL_ORDERS.filter((o) => o.status === 'allocated' || o.status === 'picking');

  const sampleRouteItems = [
    { sku: 'SKU-LAPT-001', product_name: 'ProBook Laptop', bin_code: 'A-12-3', quantity: 2 },
    { sku: 'SKU-MONI-4K27', product_name: 'UltraClear Monitor', bin_code: 'A-12-4', quantity: 1 },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
          <Truck className="h-6 w-6 text-amber-600 dark:text-amber-400" /> WAVE PICKING STATION & ROUTE MAP
        </h1>
        <p className="text-xs text-slate-500 font-medium">Serpentine aisle routing optimization & operator pick HUD</p>
      </div>

      <PickingRouteMap items={sampleRouteItems} activeBinCode="A-12-3" />

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white uppercase text-sm">Active Wave Picking Tasks ({orders.length})</h3>
        {orders.map((o) => (
          <div key={o.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm gap-4 transition hover:border-amber-500">
            <div>
              <strong className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono block">{o.order_number}</strong>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Picker: Dmitri Volkov | Bins: A-12-3, A-12-4</span>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(o.total_value)}</span>
              <Link
                href={`/lifecycle/picking/${o.id}`}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 font-semibold text-white text-xs transition shadow-2xs"
              >
                Open Picker HUD <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
