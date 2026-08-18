'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_PURCHASE_ORDERS } from '@/lib/supabase/mock-db';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { generatePurchaseOrderPDF } from '@/lib/utils/export-pdf';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export default function PurchaseInvoicePage() {
  const params = useParams();
  const id = params.id as string;

  const po = INITIAL_PURCHASE_ORDERS.find((p) => p.id === id || p.po_number === id) || INITIAL_PURCHASE_ORDERS[0];

  const handleDownload = () => {
    const doc = generatePurchaseOrderPDF(po);
    doc.save(`PurchaseInvoice_${po.po_number}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href={`/purchases/${po.id}`} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold uppercase text-slate-100">PURCHASE ORDER INVOICE</h1>
            <p className="text-xs text-slate-400">{po.po_number}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-bold text-white transition shadow-lg"
        >
          <Download className="h-4 w-4" /> Download PDF Document
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#0D131F] p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-lg font-bold text-purple-400 block">ARIA WMS & IMS</span>
            <span className="text-[10px] text-slate-500">PROCUREMENT & VENDOR INVOICING</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-slate-100 block">{po.po_number}</span>
            <span className="text-slate-400 text-[10px]">Date: {formatDate(po.created_at)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Vendor / Supplier</span>
            <strong className="text-slate-100 block text-sm">{po.supplier_name}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Receiving Facility</span>
            <strong className="text-slate-100 block text-sm">{po.warehouse_name || 'Megahub Alpha'}</strong>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-[#131B2B] text-slate-400 uppercase">
            <tr>
              <th className="p-3">SKU</th>
              <th className="p-3">Description</th>
              <th className="p-3 text-right">Qty</th>
              <th className="p-3 text-right">Unit Cost</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {(po.items || []).map((it) => (
              <tr key={it.id}>
                <td className="p-3 font-bold text-sky-400">{it.sku}</td>
                <td className="p-3 text-slate-200">{it.product_name}</td>
                <td className="p-3 text-right font-bold text-slate-200">{it.quantity_ordered}</td>
                <td className="p-3 text-right text-slate-300">{formatCurrency(it.unit_cost)}</td>
                <td className="p-3 text-right font-bold text-emerald-400">{formatCurrency(it.total_cost || it.quantity_ordered * it.unit_cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right pt-4 border-t border-slate-800">
          <span className="text-slate-400 uppercase block text-[10px]">Total Purchase Outlay</span>
          <strong className="text-xl font-bold text-emerald-400">{formatCurrency(po.total_amount)}</strong>
        </div>
      </div>
    </div>
  );
}
