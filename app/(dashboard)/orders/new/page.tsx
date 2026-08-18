'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { INITIAL_CUSTOMERS, INITIAL_PRODUCTS } from '@/lib/supabase/mock-db';
import { calculateOrderPriority } from '@/lib/warehouse/priority-engine';

export default function NewOrderPage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(INITIAL_CUSTOMERS[0]?.id || '');
  const [requestedDeliveryDate, setRequestedDeliveryDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const [items, setItems] = useState([
    { product_id: INITIAL_PRODUCTS[0]?.id || '', quantity: 2, unit_price: INITIAL_PRODUCTS[0]?.selling_price || 1299.99 },
  ]);

  const selectedCustomer = INITIAL_CUSTOMERS.find((c) => c.id === customerId) || INITIAL_CUSTOMERS[0];
  const totalValue = items.reduce((acc, cur) => acc + cur.quantity * cur.unit_price, 0);

  // Compute Live Priority Preview
  const priorityPreview = calculateOrderPriority({
    requested_delivery_date: requestedDeliveryDate,
    total_value: totalValue,
    item_count: items.length,
    created_at: new Date().toISOString(),
    customer_tier: selectedCustomer.tier,
  });

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      { product_id: INITIAL_PRODUCTS[0]?.id || '', quantity: 1, unit_price: INITIAL_PRODUCTS[0]?.selling_price || 100 },
    ]);
  };

  const removeItemRow = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          requested_delivery_date: requestedDeliveryDate,
          items,
        }),
      });
      router.push('/orders');
    } catch (err) {
      console.error('Failed to create sales order:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/orders" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-mono text-xl font-bold uppercase text-slate-100">CREATE SALES ORDER (SO)</h1>
            <p className="text-xs font-mono text-slate-400">Multi-Step Intake with Automated Priority Scorer Engine</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-slate-800 bg-[#0D131F] p-6 shadow-xl text-xs font-mono">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Select Consignee Customer</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
            >
              {INITIAL_CUSTOMERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.tier.toUpperCase()} Tier)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Requested Delivery Date</label>
            <input
              type="date"
              value={requestedDeliveryDate}
              onChange={(e) => setRequestedDeliveryDate(e.target.value)}
              className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 focus:border-sky-500"
              required
            />
          </div>
        </div>

        {/* Priority Engine Telemetry Preview */}
        <div className="p-4 rounded-lg bg-sky-950/40 border border-sky-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-400" />
            <span className="font-bold text-sky-300">ARIA Pure Priority Score Preview:</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-sky-400">{priorityPreview.score} / 100</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                priorityPreview.level === 'critical'
                  ? 'bg-red-950 text-red-400 border-red-800'
                  : 'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}
            >
              {priorityPreview.level}
            </span>
          </div>
        </div>

        {/* Order Item Lines */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 uppercase">Order SKU Line Items ({items.length})</span>
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
                          ? { ...item, product_id: e.target.value, unit_price: selected?.selling_price || item.unit_price }
                          : item
                      )
                    );
                  }}
                  className="w-full rounded bg-slate-950 border border-slate-800 px-2 py-1 text-xs text-slate-200"
                >
                  {INITIAL_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} — {p.name} (${p.selling_price})
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
                ${(row.quantity * row.unit_price).toFixed(2)}
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
          <Save className="h-4 w-4" /> INTAKE ORDER & RUN PRIORITY ALLOCATION
        </button>
      </form>
    </div>
  );
}
