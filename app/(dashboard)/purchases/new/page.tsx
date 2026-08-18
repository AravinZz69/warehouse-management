'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, Plus, Trash2 } from 'lucide-react';
import { INITIAL_SUPPLIERS, INITIAL_PRODUCTS } from '@/lib/supabase/mock-db';

export default function NewPOPage() {
  const router = useRouter();
  const [supplierId, setSupplierId] = useState(INITIAL_SUPPLIERS[0]?.id || '');
  const [notes, setNotes] = useState('Standard stock replenishment order');
  const [items, setItems] = useState([
    { product_id: INITIAL_PRODUCTS[0]?.id || '', quantity: 50, unit_cost: INITIAL_PRODUCTS[0]?.purchase_price || 850 },
  ]);

  const handleAutoFillRestock = () => {
    // Find products below reorder threshold
    const lowStock = INITIAL_PRODUCTS.filter((p) => (p.total_available || 8) <= p.reorder_threshold);
    if (lowStock.length > 0) {
      setItems(
        lowStock.map((p) => ({
          product_id: p.id,
          quantity: p.reorder_quantity || 50,
          unit_cost: p.purchase_price,
        }))
      );
    }
  };

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      { product_id: INITIAL_PRODUCTS[0]?.id || '', quantity: 10, unit_cost: INITIAL_PRODUCTS[0]?.purchase_price || 100 },
    ]);
  };

  const removeItemRow = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier_id: supplierId,
          notes,
          items,
        }),
      });
      router.push('/purchases');
    } catch (err) {
      console.error('Failed to create PO:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/purchases" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-mono text-xl font-bold uppercase text-slate-100">CREATE PURCHASE ORDER (PO)</h1>
            <p className="text-xs font-mono text-slate-400">Inbound Procurement & Restock Allocation</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAutoFillRestock}
          className="flex items-center gap-2 rounded-lg bg-purple-950 border border-purple-800 px-3 py-2 text-xs font-mono font-bold text-purple-300 hover:bg-purple-900 transition"
        >
          <Sparkles className="h-4 w-4 text-purple-400" /> Auto-Fill Low Stock Restocks
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-800 bg-[#0D131F] p-6 shadow-xl text-xs font-mono">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Select Supplier Vendor</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
            >
              {INITIAL_SUPPLIERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.company_name} ({s.payment_terms})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Order Notes / Justification</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 uppercase">Purchase Line Items ({items.length})</span>
            <button
              type="button"
              onClick={addItemRow}
              className="flex items-center gap-1 text-xs font-mono text-sky-400 hover:underline"
            >
              <Plus className="h-3 w-3" /> Add Item Line
            </button>
          </div>

          {items.map((row, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded bg-slate-900 border border-slate-800">
              <div className="flex-1">
                <select
                  value={row.product_id}
                  onChange={(e) => {
                    const selected = INITIAL_PRODUCTS.find((p) => p.id === e.target.value);
                    setItems((prev) =>
                      prev.map((item, i) =>
                        i === idx
                          ? { ...item, product_id: e.target.value, unit_cost: selected?.purchase_price || item.unit_cost }
                          : item
                      )
                    );
                  }}
                  className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 text-xs text-slate-200"
                >
                  {INITIAL_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} — {p.name} (${p.purchase_price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  value={row.quantity}
                  onChange={(e) => {
                    const qty = parseInt(e.target.value, 10) || 1;
                    setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, quantity: qty } : item)));
                  }}
                  className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 text-xs text-slate-200"
                  placeholder="Qty"
                />
              </div>

              <div className="w-28 text-right font-bold text-emerald-400">
                ${(row.quantity * row.unit_cost).toFixed(2)}
              </div>

              {items.length > 1 && (
                <button type="button" onClick={() => removeItemRow(idx)} className="text-slate-500 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 py-3 text-xs font-mono font-bold text-white transition shadow-lg mt-4"
        >
          <Save className="h-4 w-4" /> TRANSMIT PURCHASE ORDER TO VENDOR
        </button>
      </form>
    </div>
  );
}
