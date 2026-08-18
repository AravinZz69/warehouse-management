'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { SLACountdown } from '@/components/shared/SLACountdown';
import { OrderDNABar } from '@/components/shared/OrderDNABar';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { SalesOrder } from '@/types/order.types';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { exportOrdersToExcel } from '@/lib/utils/export-excel';
import { ShoppingCart, Plus, FileSpreadsheet } from 'lucide-react';

export default function SalesOrdersPage() {
  const router = useRouter();
  const [orders] = useState<SalesOrder[]>(INITIAL_ORDERS);

  const columns: Column<SalesOrder>[] = [
    {
      header: 'Order #',
      accessorKey: 'order_number',
      cell: (row) => (
        <div className="flex flex-col font-mono">
          <span className="font-bold text-sky-400">{row.order_number}</span>
          <span className="text-[10px] text-slate-500">{row.customer_name} ({row.customer_tier?.toUpperCase()})</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Order DNA Telemetry',
      cell: (row) => <OrderDNABar status={row.status} priorityLevel={row.priority_level} />,
    },
    {
      header: 'Priority',
      accessorKey: 'priority_score',
      cell: (row) => <PriorityBadge score={row.priority_score} level={row.priority_level} />,
      sortable: true,
    },
    {
      header: 'SLA Countdown',
      accessorKey: 'sla_deadline',
      cell: (row) => <SLACountdown deadlineISO={row.sla_deadline} />,
    },
    {
      header: 'Total Value',
      accessorKey: 'total_value',
      cell: (row) => <span className="font-mono text-emerald-400 font-bold">{formatCurrency(row.total_value)}</span>,
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Link href={`/orders/${row.id}`} className="text-xs font-mono text-sky-400 hover:underline">
          View Detail →
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-sky-400" /> OUTBOUND SALES ORDERS (SO) REGISTRY
          </h1>
          <p className="text-xs font-mono text-slate-400">Order DNA Triage, Realtime SLA Timers & Priority Scoring</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => exportOrdersToExcel(orders)}
            className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-slate-200 hover:text-sky-400 transition"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Export Excel
          </button>
          <Link
            href="/orders/new"
            className="flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-mono font-bold text-white transition shadow-lg"
          >
            <Plus className="h-4 w-4" /> Create Sales Order
          </Link>
        </div>
      </div>

      <DataTable
        data={orders}
        columns={columns}
        searchPlaceholder="Filter orders by Order #, Customer, Tier, or Status..."
        onRowClick={(row) => router.push(`/orders/${row.id}`)}
      />
    </div>
  );
}
