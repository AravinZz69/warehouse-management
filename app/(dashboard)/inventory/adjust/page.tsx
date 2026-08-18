'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INITIAL_PRODUCTS } from '@/lib/supabase/mock-db';
import { SlidersHorizontal, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function StockAdjustPage() {
  const router = useRouter();
  const [productId, setProductId] = useState(INITIAL_PRODUCTS[0]?.id || '');
  const [type, setType] = useState<'in' | 'out' | 'quarantine_damage' | 'physical_correction'>('in');
  const [quantity, setQuantity] = useState('10');
  const [binCode, setBinCode] = useState('A-12-3');
  const [reason, setReason] = useState('Physical audit count correction');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          adjustment_type: type,
          quantity: parseInt(quantity, 10),
          bin_code: binCode,
          reason,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage(`Stock Adjustment Success: ${data.message}`);
        setTimeout(() => router.push('/inventory'), 1500);
      } else {
        setStatusMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setStatusMessage('Adjustment mutation failed.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/inventory" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100">STOCK ADJUSTMENT DRAWER</h1>
          <p className="text-xs font-mono text-slate-400">Physical count, damage quarantine, stock-in & stock-out</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-[#0D131F] p-6 shadow-xl text-xs font-mono">
        <div>
          <label className="text-[10px] text-slate-400 uppercase block mb-1">Target Product SKU</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-sky-400 font-bold focus:border-sky-500"
          >
            {INITIAL_PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.sku} — {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Adjustment Action</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
            >
              <option value="in">Stock IN (+ Receive Stock)</option>
              <option value="out">Stock OUT (- Manual Removal)</option>
              <option value="quarantine_damage">Quarantine Damaged Units</option>
              <option value="physical_correction">Physical Audit Correction (= Absolute Set)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Quantity Units</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Bin Location Code</label>
            <input
              type="text"
              value={binCode}
              onChange={(e) => setBinCode(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-amber-400 font-bold focus:border-sky-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Audit Reason / Ticket</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
            />
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 rounded bg-sky-950/80 border border-sky-800 text-sky-300 text-xs font-mono">
            {statusMessage}
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 py-3 text-xs font-mono font-bold text-white transition shadow-lg mt-4"
        >
          <SlidersHorizontal className="h-4 w-4" /> EXECUTE STOCK MUTATION
        </button>
      </form>
    </div>
  );
}
