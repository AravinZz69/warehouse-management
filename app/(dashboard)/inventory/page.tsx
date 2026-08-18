'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { INITIAL_INVENTORY, INITIAL_PRODUCTS } from '@/lib/supabase/mock-db';
import { InventoryLevel } from '@/types/inventory.types';
import { formatCurrency } from '@/lib/utils/format';
import { Boxes, SlidersHorizontal, Barcode, AlertTriangle } from 'lucide-react';

export default function InventoryMatrixPage() {
  const router = useRouter();
  const [inventory] = useState<InventoryLevel[]>(INITIAL_INVENTORY);

  const columns: Column<InventoryLevel>[] = [
    {
      header: 'SKU / Barcode',
      accessorKey: 'sku',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-sky-400">{row.sku}</span>
          <span className="text-[10px] text-slate-500 font-mono">{row.product_name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Bin Location',
      accessorKey: 'bin_code',
      cell: (row) => <span className="font-mono font-bold text-amber-400">{row.bin_code || 'A-12-3'}</span>,
      sortable: true,
    },
    {
      header: 'Available Qty',
      accessorKey: 'quantity_available',
      cell: (row) => (
        <span className={`font-mono font-bold ${row.quantity_available <= 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
          {row.quantity_available} units
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Reserved Qty',
      accessorKey: 'quantity_reserved',
      cell: (row) => <span className="font-mono text-sky-400">{row.quantity_reserved} units</span>,
    },
    {
      header: 'Damaged Qty',
      accessorKey: 'quantity_damaged',
      cell: (row) => <span className="font-mono text-red-400">{row.quantity_damaged} units</span>,
    },
    {
      header: 'Batch Number',
      accessorKey: 'batch_number',
      cell: (row) => <span className="font-mono text-slate-400 text-xs">{row.batch_number || 'BATCH-20260801'}</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Link
          href={`/inventory/adjust?product_id=${row.product_id}`}
          className="text-xs font-mono text-sky-400 hover:underline flex items-center gap-1"
        >
          <SlidersHorizontal className="h-3 w-3" /> Adjust
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
            <Boxes className="h-6 w-6 text-sky-400" /> INVENTORY MATRIX & MULTI-BIN AUDIT
          </h1>
          <p className="text-xs font-mono text-slate-400">Real-time Available, Reserved, and Quarantine Damaged Stock</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/inventory/scanner"
            className="flex items-center gap-2 rounded-lg bg-purple-950 border border-purple-800 px-4 py-2 text-xs font-mono font-bold text-purple-300 hover:bg-purple-900 transition"
          >
            <Barcode className="h-4 w-4 text-purple-400" /> Full-Screen Mobile Scanner HUD
          </Link>
          <Link
            href="/inventory/adjust"
            className="flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-mono font-bold text-white transition shadow-lg"
          >
            <SlidersHorizontal className="h-4 w-4" /> Stock Adjustment Drawer
          </Link>
        </div>
      </div>

      <DataTable
        data={inventory}
        columns={columns}
        searchPlaceholder="Filter inventory by SKU, Bin Code, or Batch Number..."
      />
    </div>
  );
}
