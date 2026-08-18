'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarcodeBadge } from '@/components/shared/BarcodeBadge';
import { Package, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [sku, setSku] = useState(`SKU-NEW-${Math.floor(100 + Math.random() * 900)}`);
  const [barcode, setBarcode] = useState(`${Math.floor(8900000000000 + Math.random() * 99999999999)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('Generic');
  const [purchasePrice, setPurchasePrice] = useState('100.00');
  const [sellingPrice, setSellingPrice] = useState('149.99');
  const [weightKg, setWeightKg] = useState('1.5');
  const [reorderThreshold, setReorderThreshold] = useState('10');
  const [requiresColdStorage, setRequiresColdStorage] = useState(false);
  const [isFragile, setIsFragile] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku,
          barcode,
          name,
          category,
          brand,
          purchase_price: parseFloat(purchasePrice),
          selling_price: parseFloat(sellingPrice),
          weight_kg: parseFloat(weightKg),
          reorder_threshold: parseInt(reorderThreshold, 10),
          requires_cold_storage: requiresColdStorage,
          is_fragile: isFragile,
        }),
      });
      router.push('/products');
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/products" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100">CREATE NEW SKU & BARCODE</h1>
          <p className="text-xs font-mono text-slate-400">Add SKU entry to warehouse catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Input */}
        <div className="md:col-span-2 space-y-4 rounded-xl border border-slate-800 bg-[#0D131F] p-6 shadow-xl text-xs font-mono">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1">SKU Number</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-sky-400 font-bold focus:border-sky-500"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Barcode (EAN-13 / Code128)</label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Product Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. High-Velocity Lithium Battery Pack"
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Brand Name</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Purchase Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Selling Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-emerald-400 font-bold focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase block mb-1">Reorder Threshold</label>
              <input
                type="number"
                value={reorderThreshold}
                onChange={(e) => setReorderThreshold(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-amber-400 font-bold focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresColdStorage}
                onChange={(e) => setRequiresColdStorage(e.target.checked)}
                className="rounded border-slate-800 bg-slate-900 text-sky-500 focus:ring-0"
              />
              <span>Requires Cold Storage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFragile}
                onChange={(e) => setIsFragile(e.target.checked)}
                className="rounded border-slate-800 bg-slate-900 text-amber-500 focus:ring-0"
              />
              <span>Fragile Handling</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 py-3 text-xs font-mono font-bold text-white transition shadow-lg mt-4"
          >
            <Save className="h-4 w-4" /> SAVE SKU ENTRY
          </button>
        </div>

        {/* Right Col: Live Barcode Preview */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-800 bg-[#0D131F] text-center space-y-4 shadow-xl">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">SVG Barcode Tag Preview</span>
          <BarcodeBadge value={barcode || '8901234567890'} width={2} height={50} />
          <span className="text-[10px] font-mono text-sky-400">Code128 Standard • Industrial Grade</span>
        </div>
      </form>
    </div>
  );
}
