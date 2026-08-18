'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { BarcodeScannerHUD } from '@/components/shared/BarcodeScannerHUD';
import { PickingRouteMap } from '@/components/lifecycle/PickingRouteMap';
import { ArrowLeft, CheckCircle2, Truck, Navigation } from 'lucide-react';

export default function OperatorPickingHUDPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  const order = INITIAL_ORDERS.find((o) => o.id === taskId || o.order_number === taskId) || INITIAL_ORDERS[0];
  const items = order.items || [];

  const [pickedSkus, setPickedSkus] = useState<Record<string, boolean>>({});

  const handleScanItem = (code: string) => {
    const match = items.find((it) => it.barcode === code || it.sku === code);
    if (match) {
      setPickedSkus((prev) => ({ ...prev, [match.id]: true }));
    }
  };

  const allPicked = items.every((it) => pickedSkus[it.id]);

  const handleCompletePick = async () => {
    try {
      await fetch(`/api/orders/${order.id}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_stage: 'packing' }),
      });
      router.push('/lifecycle/packing');
    } catch (err) {
      console.error('Pick completion failed:', err);
    }
  };

  const sampleRouteItems = items.map((it) => ({
    sku: it.sku || 'SKU',
    product_name: it.product_name || 'Item',
    bin_code: it.bin_code || 'A-12-3',
    quantity: it.quantity_ordered,
  }));

  return (
    <div className="space-y-6 font-mono text-xs max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/lifecycle/picking" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold uppercase text-amber-400">OPERATOR WAVE PICK HUD</h1>
            <p className="text-xs text-slate-400">Order: {order.order_number} | Assigned Picker: Dmitri Volkov</p>
          </div>
        </div>
      </div>

      <PickingRouteMap items={sampleRouteItems} activeBinCode="A-12-3" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarcodeScannerHUD onScanSuccess={handleScanItem} title="Pick Item Barcode Scanner HUD" />

        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0D131F] p-5 shadow-xl">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-200 uppercase">Item Verification Checklist ({items.length})</h3>
            <div className="space-y-2">
              {items.map((it) => {
                const isPicked = pickedSkus[it.id];
                return (
                  <div
                    key={it.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isPicked ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-sm">{it.bin_code || 'A-12-3'} • {it.sku}</span>
                      <span className="text-[10px] text-slate-400">{it.product_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{it.quantity_ordered} Units</span>
                      {isPicked && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            disabled={!allPicked}
            onClick={handleCompletePick}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-500 py-3 text-xs font-mono font-bold text-white transition shadow-lg mt-4 disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" /> COMPLETE WAVE PICK & ADVANCE TO PACKING
          </button>
        </div>
      </div>
    </div>
  );
}
