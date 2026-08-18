'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_PRODUCTS, INITIAL_INVENTORY } from '@/lib/supabase/mock-db';
import { ArrowLeft, Boxes, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export default function InventoryProductDrilldownPage() {
  const params = useParams();
  const productId = params.productId as string;

  const product = INITIAL_PRODUCTS.find((p) => p.id === productId || p.sku === productId) || INITIAL_PRODUCTS[0];
  const bins = INITIAL_INVENTORY.filter((inv) => inv.product_id === product.id);

  return (
    <div className="space-y-6 font-mono text-xs max-w-4xl mx-auto">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/inventory" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold uppercase text-slate-100">SKU MULTI-BIN DRILLDOWN: {product.sku}</h1>
          <p className="text-xs text-slate-400">{product.name}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#0D131F] p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-slate-200 text-sm uppercase flex items-center gap-2">
          <MapPin className="h-4 w-4 text-sky-400" /> BINS & BATCH MOVEMENTS ({bins.length})
        </h3>
        <div className="space-y-3">
          {bins.map((b) => (
            <div key={b.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-900 border border-slate-800">
              <div>
                <strong className="text-sky-400 text-sm block">Bin {b.bin_code || 'A-12-3'}</strong>
                <span className="text-[10px] text-slate-400">Batch: {b.batch_number} | Received: {b.received_at.slice(0, 10)}</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold text-sm block">{b.quantity_available} Available</span>
                <span className="text-amber-400 text-[10px]">{b.quantity_reserved} Reserved</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
