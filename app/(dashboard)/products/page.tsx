'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { BarcodeBadge } from '@/components/shared/BarcodeBadge';
import { INITIAL_PRODUCTS } from '@/lib/supabase/mock-db';
import { Product } from '@/types/product.types';
import { formatCurrency } from '@/lib/utils/format';
import { exportProductsToExcel } from '@/lib/utils/export-excel';
import { Package, Plus, FileSpreadsheet, Barcode, Search, AlertTriangle } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  const columns: Column<Product>[] = [
    {
      header: 'SKU / Barcode',
      accessorKey: 'sku',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-bold text-sky-400">{row.sku}</span>
          <span className="text-[10px] text-slate-500 font-mono">{row.barcode}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Product Name',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-200">{row.name}</span>
          <span className="text-[10px] text-slate-400">{row.category} • {row.brand}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Purchase Cost',
      accessorKey: 'purchase_price',
      cell: (row) => <span className="font-mono text-slate-300">{formatCurrency(row.purchase_price)}</span>,
      sortable: true,
    },
    {
      header: 'Selling Price',
      accessorKey: 'selling_price',
      cell: (row) => <span className="font-mono text-emerald-400 font-bold">{formatCurrency(row.selling_price)}</span>,
      sortable: true,
    },
    {
      header: 'Reorder Level',
      accessorKey: 'reorder_threshold',
      cell: (row) => (
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span>{row.reorder_threshold} units</span>
          {row.reorder_threshold >= 10 && <span className="text-[9px] text-amber-400 bg-amber-950 px-1 rounded">Alert Threshold</span>}
        </div>
      ),
    },
    {
      header: 'Special Storage',
      accessorKey: 'requires_cold_storage',
      cell: (row) => (
        <div className="flex gap-1">
          {row.requires_cold_storage && (
            <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-sky-950 text-sky-400 border border-sky-800 rounded">
              COLD
            </span>
          )}
          {row.is_fragile && (
            <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800 rounded">
              FRAGILE
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Link
          href={`/products/${row.id}`}
          className="text-xs font-mono text-sky-400 hover:underline"
        >
          View SKU →
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
            <Package className="h-6 w-6 text-sky-400" /> PRODUCT CATALOG & SKU MATRIX
          </h1>
          <p className="text-xs font-mono text-slate-400">Total Catalog Items: {products.length} SKUs</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => exportProductsToExcel(products)}
            className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-slate-200 hover:text-sky-400 transition"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Export Excel (.xlsx)
          </button>
          <Link
            href="/products/new"
            className="flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-mono font-bold text-white transition shadow-lg"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Link>
        </div>
      </div>

      <DataTable
        data={products}
        columns={columns}
        searchPlaceholder="Search catalog by SKU, Barcode, Name, or Category..."
        onRowClick={(row) => router.push(`/products/${row.id}`)}
      />
    </div>
  );
}
