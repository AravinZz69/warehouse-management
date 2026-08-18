'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { INITIAL_PURCHASE_ORDERS } from '@/lib/supabase/mock-db';
import { PurchaseOrder } from '@/types/purchase.types';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { FileText, Plus, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { exportPurchaseOrdersToExcel } from '@/lib/utils/export-excel';

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [pos] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);

  const columns: Column<PurchaseOrder>[] = [
    {
      header: 'PO Number',
      accessorKey: 'po_number',
      cell: (row) => (
        <div className="flex flex-col font-mono">
          <span className="font-bold text-sky-400">{row.po_number}</span>
          <span className="text-[10px] text-slate-500">{row.warehouse_name || 'Megahub Alpha'}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Supplier Vendor',
      accessorKey: 'supplier_name',
      cell: (row) => <span className="font-bold text-slate-200">{row.supplier_name}</span>,
      sortable: true,
    },
    {
      header: 'PO Amount',
      accessorKey: 'total_amount',
      cell: (row) => <span className="font-mono text-emerald-400 font-bold">{formatCurrency(row.total_amount)}</span>,
      sortable: true,
    },
    {
      header: 'Expected Delivery',
      accessorKey: 'expected_delivery',
      cell: (row) => <span className="font-mono text-slate-300">{formatDate(row.expected_delivery)}</span>,
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
        <Link href={`/purchases/${row.id}`} className="text-xs font-mono text-sky-400 hover:underline">
          View GRN →
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
            <FileText className="h-6 w-6 text-sky-400" /> INBOUND PROCUREMENT & PURCHASE ORDERS (PO)
          </h1>
          <p className="text-xs font-mono text-slate-400">Goods Receiving Notes (GRN) & Inventory Auto-Restock</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => exportPurchaseOrdersToExcel(pos)}
            className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-slate-200 hover:text-sky-400 transition"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Export Excel
          </button>
          <Link
            href="/purchases/new"
            className="flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-mono font-bold text-white transition shadow-lg"
          >
            <Plus className="h-4 w-4" /> Create Purchase Order
          </Link>
        </div>
      </div>

      <DataTable
        data={pos}
        columns={columns}
        searchPlaceholder="Search POs by PO #, Supplier, or Status..."
        onRowClick={(row) => router.push(`/purchases/${row.id}`)}
      />
    </div>
  );
}
