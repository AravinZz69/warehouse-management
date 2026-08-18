'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/supabase/mock-db';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const product = INITIAL_PRODUCTS.find((p) => p.id === id || p.sku === id) || INITIAL_PRODUCTS[0];

  const [name, setName] = useState(product.name);
  const [purchasePrice, setPurchasePrice] = useState(String(product.purchase_price));
  const [sellingPrice, setSellingPrice] = useState(String(product.selling_price));
  const [reorderThreshold, setReorderThreshold] = useState(String(product.reorder_threshold));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          purchase_price: parseFloat(purchasePrice),
          selling_price: parseFloat(sellingPrice),
          reorder_threshold: parseInt(reorderThreshold, 10),
        }),
      });
      router.push(`/products/${product.id}`);
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href={`/products/${product.id}`} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100">EDIT SKU: {product.sku}</h1>
          <p className="text-xs font-mono text-slate-400">Update product parameters and reorder threshold</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-[#0D131F] p-6 shadow-xl text-xs font-mono">
        <div>
          <label className="text-[10px] text-slate-400 uppercase block mb-1">Product Title</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Purchase Cost ($)</label>
            <input
              type="number"
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Selling Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-emerald-400 font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Reorder Threshold</label>
            <input
              type="number"
              value={reorderThreshold}
              onChange={(e) => setReorderThreshold(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-amber-400 font-bold"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 py-3 text-xs font-mono font-bold text-white transition shadow-lg mt-4"
        >
          <Save className="h-4 w-4" /> SAVE MODIFICATIONS
        </button>
      </form>
    </div>
  );
}
