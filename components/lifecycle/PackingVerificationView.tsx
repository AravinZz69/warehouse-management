'use client';

import React, { useState } from 'react';
import { SalesOrder } from '@/types/order.types';
import { Package, CheckCircle2, Box, Barcode, ShieldCheck } from 'lucide-react';
import { BarcodeScannerHUD } from '@/components/shared/BarcodeScannerHUD';

interface PackingVerificationViewProps {
  order: SalesOrder;
  onSealManifest?: (boxType: string, weightKg: number) => void;
}

export const PackingVerificationView: React.FC<PackingVerificationViewProps> = ({ order, onSealManifest }) => {
  const [scannedSkus, setScannedSkus] = useState<Record<string, number>>({});
  const [boxType, setBoxType] = useState<'small' | 'medium' | 'large' | 'pallet'>('medium');
  const [measuredWeight, setMeasuredWeight] = useState(order.total_weight_kg || 2.5);

  const items = order.items || [];

  const handleScanItem = (code: string) => {
    // Find matching SKU or barcode in order items
    const match = items.find((it) => it.barcode === code || it.sku === code);
    if (match) {
      setScannedSkus((prev) => ({
        ...prev,
        [match.id]: (prev[match.id] || 0) + 1,
      }));
    }
  };

  const isAllPacked = items.every((it) => (scannedSkus[it.id] || 0) >= it.quantity_ordered);

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-slate-800 bg-[#0D131F] p-6 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-mono text-base font-bold uppercase text-slate-100">PACKING VERIFICATION STATION</h3>
          <p className="text-xs font-mono text-slate-400">Order: {order.order_number}</p>
        </div>
        <span
          className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
            isAllPacked ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'
          }`}
        >
          {isAllPacked ? 'ALL ITEMS PACKED' : 'PACKING IN PROGRESS'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Barcode Scanner HUD */}
        <div>
          <BarcodeScannerHUD onScanSuccess={handleScanItem} title="Packing Item Scan Verification" />
        </div>

        {/* Right: Packing Item Checklist & Seal Controls */}
        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-slate-400 uppercase">Items Checklist ({items.length})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {items.map((it) => {
                const count = scannedSkus[it.id] || 0;
                const isItemComplete = count >= it.quantity_ordered;

                return (
                  <div
                    key={it.id}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs font-mono ${
                      isItemComplete
                        ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{it.product_name || it.sku}</span>
                      <span className="text-[10px] text-slate-400">{it.sku} | Barcode: {it.barcode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{count} / {it.quantity_ordered}</span>
                      {isItemComplete && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Container Box Selection & Seal Button */}
          <div className="border-t border-slate-800 pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Container Box Type</label>
                <select
                  value={boxType}
                  onChange={(e) => setBoxType(e.target.value as any)}
                  className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-sky-500"
                >
                  <option value="small">Small Shipping Box (10x8x6 in)</option>
                  <option value="medium">Medium Master Carton (18x14x10 in)</option>
                  <option value="large">Heavy Heavy-Duty Box (24x20x16 in)</option>
                  <option value="pallet">Wooden Euro Pallet</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Scale Weight (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={measuredWeight}
                  onChange={(e) => setMeasuredWeight(parseFloat(e.target.value) || 0)}
                  className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-sky-500"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={!isAllPacked}
              onClick={() => onSealManifest && onSealManifest(boxType, measuredWeight)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-3 text-xs font-mono font-bold text-white transition shadow-lg disabled:opacity-50"
            >
              <Box className="h-4 w-4" />
              <span>SEAL CONTAINER & ADVANCE TO QA INSPECTION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
