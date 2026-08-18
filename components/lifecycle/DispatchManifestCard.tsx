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
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F] p-6 text-slate-900 dark:text-slate-100 shadow-sm font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Truck className="h-6 w-6 text-blue-600 dark:text-sky-400" />
          <div>
            <h3 className="text-base font-bold uppercase text-slate-900 dark:text-slate-100">CARRIER STAGING & DISPATCH DESK</h3>
            <p className="text-xs text-slate-500 font-mono">Order: {order.order_number}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            dispatched ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800' : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-800'
          }`}
        >
          {dispatched ? 'DISPATCHED & SHIPPED' : 'READY FOR CARRIER PICKUP'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Consignee Customer</span>
          <strong className="text-slate-900 dark:text-slate-100 text-sm block">{order.customer_name || 'Valued Customer'}</strong>
          <span className="text-slate-600 dark:text-slate-400 block">{order.customer_email}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Shipment Payload</span>
          <strong className="text-blue-600 dark:text-sky-400 text-sm block">{order.total_weight_kg.toFixed(2)} kg | {order.item_count} Items</strong>
          <span className="text-slate-600 dark:text-slate-400 block font-medium">Declared Value: ${order.total_value.toFixed(2)}</span>
        </div>
      </div>

      {!dispatched ? (
        <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Select Freight Carrier</label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-slate-200 focus:border-blue-600"
              >
                <option value="FedEx Priority Overnight">FedEx Priority Overnight</option>
                <option value="UPS Express Saver">UPS Express Saver</option>
                <option value="DHL Express International">DHL Express International</option>
                <option value="Maersk Freight Logistics">Maersk Freight Logistics</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Generated Tracking #</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 text-xs font-mono font-bold text-blue-600 dark:text-sky-400 focus:border-blue-600"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleDispatch}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-xs font-bold text-white transition shadow-sm"
          >
            <Send className="h-4 w-4" />
            <span>CONFIRM DISPATCH & TRIGGER INVENTORY DEDUCTION</span>
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-sm">Dispatched via {carrier}</strong>
              <span className="text-[11px] font-mono opacity-90">Tracking: {trackingNumber}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-sky-400 hover:bg-emerald-100 transition shadow-2xs"
          >
            <FileText className="h-4 w-4" /> Download Sales Invoice PDF
          </button>
        </div>
      )}
    </div>
  );
};
