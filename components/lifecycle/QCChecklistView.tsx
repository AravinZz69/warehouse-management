'use client';

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { SalesOrder } from '@/types/order.types';

interface QCChecklistViewProps {
  order: SalesOrder;
  onPassQC?: () => void;
  onFailQC?: (defects: string[]) => void;
}

export const QCChecklistView: React.FC<QCChecklistViewProps> = ({ order, onPassQC, onFailQC }) => {
  const [checklist, setChecklist] = useState({
    sku_match: true,
    quantity_exact: true,
    no_physical_damage: true,
    expiry_valid: true,
    cold_chain_verified: true,
    barcode_scannable: true,
    packaging_intact: true,
  });

  const [defectNotes, setDefectNotes] = useState('');

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allPassed = Object.values(checklist).every(Boolean);

  const checks = [
    { key: 'sku_match', label: '1. SKU & Barcode Exact Match', desc: 'Verify physical SKU aligns with order DNA lines.' },
    { key: 'quantity_exact', label: '2. Exact Item Unit Count', desc: 'Ensure no missing or excess units in container.' },
    { key: 'no_physical_damage', label: '3. Zero Physical Damage', desc: 'Inspect product casing for cracks or dents.' },
    { key: 'expiry_valid', label: '4. Batch Expiry Date Validity', desc: 'Ensure minimum 180 days remaining shelf life.' },
    { key: 'cold_chain_verified', label: '5. Cold Chain Thermal Compliance', desc: 'Verify temperature loggers for sensitive items.' },
    { key: 'barcode_scannable', label: '6. Barcode Scannability Audit', desc: 'Confirm laser HUD reads Code128 without error.' },
    { key: 'packaging_intact', label: '7. Master Carton Seal Integrity', desc: 'Ensure tamper-evident security tape is intact.' },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-slate-800 bg-[#0D131F] p-6 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-sky-400" />
          <div>
            <h3 className="font-mono text-base font-bold uppercase text-slate-100">7-POINT QUALITY CONTROL INSPECTION</h3>
            <p className="text-xs font-mono text-slate-400">Order: {order.order_number} | Priority: {order.priority_level.toUpperCase()}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
            allPassed ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-red-950 text-red-400 border-red-800'
          }`}
        >
          {allPassed ? 'PASSING ALL 7 CHECKS' : 'DEFECT DETECTED'}
        </span>
      </div>

      {/* 7-Point Checklist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {checks.map((c) => {
          const isChecked = checklist[c.key as keyof typeof checklist];
          return (
            <div
              key={c.key}
              onClick={() => toggleCheck(c.key as any)}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition select-none ${
                isChecked
                  ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
                  : 'bg-red-950/30 border-red-800/80 text-red-300'
              }`}
            >
              {isChecked ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-mono text-xs font-bold block">{c.label}</span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">{c.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Defect Logger Box */}
      {!allPassed && (
        <div className="space-y-2 border-t border-red-900/40 pt-4">
          <label className="text-xs font-mono font-bold text-red-400 uppercase flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-red-400" /> Log Defect Description & Return Code:
          </label>
          <textarea
            value={defectNotes}
            onChange={(e) => setDefectNotes(e.target.value)}
            placeholder="Describe defect details (e.g. Scratched screen on SKU-MONI-4K27, returning to quarantine bin)..."
            className="w-full h-20 rounded bg-slate-900 border border-red-900/60 p-3 text-xs font-mono text-slate-200 focus:outline-none"
          />
        </div>
      )}

      {/* Decision Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {!allPassed && (
          <button
            type="button"
            onClick={() => onFailQC && onFailQC([defectNotes || 'QC inspection failed. Sent to quarantine.'])}
            className="rounded bg-red-600 hover:bg-red-500 px-6 py-2.5 text-xs font-mono font-bold text-white transition shadow-lg"
          >
            FLAG DEFECT & QUARANTINE ORDER
          </button>
        )}
        <button
          type="button"
          disabled={!allPassed}
          onClick={() => onPassQC && onPassQC()}
          className="rounded bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-xs font-mono font-bold text-white transition shadow-lg disabled:opacity-50"
        >
          APPROVE QC & DISPATCH TO CARRIER DESK
        </button>
      </div>
    </div>
  );
};
