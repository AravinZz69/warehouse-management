'use client';

import React, { useState } from 'react';
import { BarcodeScannerHUD } from '@/components/shared/BarcodeScannerHUD';
import { Barcode, ArrowLeft, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MobileBarcodeAuditPage() {
  const router = useRouter();
  const [scannedResult, setScannedResult] = useState<{
    code: string;
    product?: any;
  } | null>(null);

  const handleScan = async (code: string) => {
    try {
      const res = await fetch(`/api/products/barcode/${code}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setScannedResult({
          code,
          product: data.data.product,
        });
      } else {
        setScannedResult({ code });
      }
    } catch {
      setScannedResult({ code });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link href="/inventory" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 shadow-2xs">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold uppercase text-slate-900 dark:text-white flex items-center gap-2">
            <Barcode className="h-6 w-6 text-blue-600 dark:text-blue-400" /> BARCODE AUDIT HUD
          </h1>
          <p className="text-xs text-slate-500 font-medium">Rapid floor cycle count, bin putaway & SKU barcode lookup</p>
        </div>
      </div>

      {/* Full-Screen Camera HUD Viewfinder */}
      <BarcodeScannerHUD onScanSuccess={handleScan} title="Industrial Floor Laser Camera HUD" />

      {/* Scan Telemetry Result Card */}
      {scannedResult && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 font-sans">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase">SCAN RESOLUTION TELEMETRY</h3>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{scannedResult.code}</span>
          </div>

          {scannedResult.product ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-base font-bold text-slate-900 dark:text-white block">{scannedResult.product.name}</span>
                  <span className="text-xs text-blue-600 font-mono font-bold">{scannedResult.product.sku}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
                  ${scannedResult.product.selling_price}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Category</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{scannedResult.product.category}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Default Bin</span>
                  <span className="text-blue-600 font-mono font-bold">A-12-3</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push(`/inventory/adjust?product_id=${scannedResult.product.id}`)}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white transition shadow-sm"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Quick Stock Adjust
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-amber-700 font-medium">
              Scanned barcode <strong className="text-slate-900">{scannedResult.code}</strong> not found in active inventory database.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
