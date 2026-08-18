'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { SalesOrder, OrderStatus } from '@/types/order.types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { SLACountdown } from '@/components/shared/SLACountdown';
import { OrderDNABar } from '@/components/shared/OrderDNABar';
import { Truck, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

const KANBAN_STAGES: { key: OrderStatus; label: string; href: string }[] = [
  { key: 'created', label: '1. Order Intake', href: '/orders' },
  { key: 'priority_scored', label: '2. Priority Scored', href: '/lifecycle/priority' },
  { key: 'inventory_checked', label: '3. Stock Verified', href: '/lifecycle/inventory-check' },
  { key: 'allocated', label: '4. Stock Locked (FEFO)', href: '/lifecycle/allocation' },
  { key: 'picking', label: '5. Wave Pick Station', href: '/lifecycle/picking' },
  { key: 'packing', label: '6. Packing Station', href: '/lifecycle/packing' },
  { key: 'quality_check', label: '7. QA Inspection', href: '/lifecycle/quality-check' },
  { key: 'dispatched', label: '8. Carrier Dispatch', href: '/lifecycle/dispatch' },
];

export default function KanbanBoardPage() {
  const [orders] = useState<SalesOrder[]>(INITIAL_ORDERS);

  return (
    <div className="space-y-6 font-mono">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
          <Truck className="h-6 w-6 text-sky-400" /> 9-STAGE FULFILLMENT KANBAN & BOTTLENECK RADAR
        </h1>
        <p className="text-xs text-slate-400">Live order progression through warehouse stations</p>
      </div>

      {/* 8-Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {KANBAN_STAGES.map((st) => {
          const stageOrders = orders.filter((o) => o.status === st.key);

          return (
            <div key={st.key} className="flex flex-col gap-3 p-4 rounded-xl border border-slate-800 bg-[#0D131F] min-h-[400px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <Link href={st.href} className="text-xs font-bold text-sky-400 hover:underline">
                  {st.label}
                </Link>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-xs font-bold">
                  {stageOrders.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {stageOrders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-600 italic">No orders in this stage.</div>
                ) : (
                  stageOrders.map((o) => (
                    <Link
                      key={o.id}
                      href={`/orders/${o.id}`}
                      className="flex flex-col gap-2 p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500 transition shadow-md block"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-400">{o.order_number}</span>
                        <PriorityBadge level={o.priority_level} />
                      </div>

                      <OrderDNABar status={o.status} priorityLevel={o.priority_level} />

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-400">{o.customer_name}</span>
                        <span className="font-bold text-emerald-400">{formatCurrency(o.total_value)}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
