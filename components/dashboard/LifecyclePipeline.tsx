'use client';

import React from 'react';
import Link from 'next/link';
import { SalesOrder, OrderStatus } from '@/types/order.types';
import { STAGE_LABELS } from '@/lib/warehouse/constants';
import { Truck, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface LifecyclePipelineProps {
  orders: SalesOrder[];
}

const PIPELINE_STAGES: { key: OrderStatus; label: string; href: string }[] = [
  { key: 'created', label: '1. Intake', href: '/orders' },
  { key: 'priority_scored', label: '2. Priority', href: '/lifecycle/priority' },
  { key: 'inventory_checked', label: '3. Stock Check', href: '/lifecycle/inventory-check' },
  { key: 'allocated', label: '4. Allocated', href: '/lifecycle/allocation' },
  { key: 'picking', label: '5. Wave Pick', href: '/lifecycle/picking' },
  { key: 'packing', label: '6. Packing', href: '/lifecycle/packing' },
  { key: 'quality_check', label: '7. QA Check', href: '/lifecycle/quality-check' },
  { key: 'dispatched', label: '8. Dispatched', href: '/lifecycle/dispatch' },
  { key: 'completed', label: '9. Delivered', href: '/orders' },
];

export const LifecyclePipeline: React.FC<LifecyclePipelineProps> = ({ orders }) => {
  const getStageCount = (stageKey: OrderStatus) => {
    return orders.filter((o) => o.status === stageKey).length;
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F] p-6 text-slate-900 dark:text-slate-100 shadow-sm font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-blue-600 dark:text-sky-400" />
          <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-slate-200">9-STAGE LIVE FULFILLMENT PIPELINE</h3>
        </div>
        <Link href="/lifecycle" className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline">
          View Full Kanban →
        </Link>
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {PIPELINE_STAGES.map((st) => {
          const count = getStageCount(st.key);
          const hasOrders = count > 0;

          return (
            <Link
              key={st.key}
              href={st.href}
              className={cn(
                'flex flex-col items-center justify-between p-3 rounded-xl border text-center transition-all group',
                hasOrders
                  ? 'bg-blue-50 dark:bg-sky-950/40 border-blue-200 dark:border-sky-800/80 hover:bg-blue-100 dark:hover:bg-sky-900/60'
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/60 hover:border-slate-300'
              )}
            >
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-sky-300">
                {st.label}
              </span>
              <span
                className={cn(
                  'my-1 text-lg font-mono font-black',
                  hasOrders ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-600'
                )}
              >
                {count}
              </span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase">Orders</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
