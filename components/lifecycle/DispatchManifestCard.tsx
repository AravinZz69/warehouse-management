'use client';

import React, { useState } from 'react';
import { SalesOrder } from '@/types/order.types';
import { Truck, CheckCircle2, FileText, Send } from 'lucide-react';
import { generateSalesInvoicePDF } from '@/lib/utils/export-pdf';

interface DispatchManifestCardProps {
  order: SalesOrder;
  onConfirmDispatch?: (carrier: string, trackingNumber: string) => void;
}

export const DispatchManifestCard: React.FC<DispatchManifestCardProps> = ({ order, onConfirmDispatch }) => {
  const [carrier, setCarrier] = useState('FedEx Priority Overnight');
  const [trackingNumber, setTrackingNumber] = useState(`TRK-2026-${Math.floor(100000 + Math.random() * 900000)}`);
  const [dispatched, setDispatched] = useState(order.status === 'dispatched' || order.status === 'completed');

  const handleDispatch = () => {
    setDispatched(true);
    if (onConfirmDispatch) {
      onConfirmDispatch(carrier, trackingNumber);
    }
  };

  const handleDownloadInvoice = () => {
    const doc = generateSalesInvoicePDF(order);
    doc.save(`Invoice_${order.order_number}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-slate-800 bg-[#0D131F] p-6 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Truck className="h-6 w-6 text-sky-400" />
          <div>
            <h3 className="font-mono text-base font-bold uppercase text-slate-100">CARRIER STAGING & DISPATCH DESK</h3>
            <p className="text-xs font-mono text-slate-400">Order: {order.order_number}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
            dispatched ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-sky-950 text-sky-400 border-sky-800'
          }`}
        >
          {dispatched ? 'DISPATCHED & SHIPPED' : 'READY FOR CARRIER PICKUP'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">Consignee Customer</span>
          <strong className="text-slate-100 text-sm block">{order.customer_name || 'Valued Customer'}</strong>
          <span className="text-slate-400 block">{order.customer_email}</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">Shipment Payload</span>
          <strong className="text-sky-400 text-sm block">{order.total_weight_kg.toFixed(2)} kg | {order.item_count} Items</strong>
          <span className="text-slate-400 block">Declared Value: ${order.total_value.toFixed(2)}</span>
        </div>
      </div>

      {!dispatched ? (
        <div className="space-y-4 border-t border-slate-800 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Select Freight Carrier</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-200 focus:border-sky-500"
              >
                <option value="FedEx Priority Overnight">FedEx Priority Overnight</option>
                <option value="UPS Express Saver">UPS Express Saver</option>
                <option value="DHL Express International">DHL Express International</option>
                <option value="Maersk Freight Logistics">Maersk Freight Logistics</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Generated Tracking #</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full rounded bg-slate-900 border border-slate-800 px-3 py-2 text-xs font-mono text-sky-400 font-bold focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleDispatch}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-3 text-xs font-mono font-bold text-white transition shadow-lg"
          >
            <Send className="h-4 w-4" />
            <span>CONFIRM DISPATCH & TRIGGER INVENTORY DEDUCTION</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 font-mono text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-sm">Dispatched via {carrier}</strong>
              <span className="text-[11px] opacity-80">Tracking: {trackingNumber}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="inline-flex items-center gap-2 rounded bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono font-bold text-sky-400 hover:text-sky-300 transition"
          >
            <FileText className="h-4 w-4" /> Download Sales Invoice PDF
          </button>
        </div>
      )}
    </div>
  );
};
