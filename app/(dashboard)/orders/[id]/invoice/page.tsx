'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { generateSalesInvoicePDF } from '@/lib/utils/export-pdf';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export default function SalesInvoicePage() {
  const params = useParams();
  const id = params.id as string;

  const order = INITIAL_ORDERS.find((o) => o.id === id || o.order_number === id) || INITIAL_ORDERS[0];

  const handleDownload = () => {
    const doc = generateSalesInvoicePDF(order);
    doc.save(`SalesInvoice_${order.order_number}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href={`/orders/${order.id}`} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold uppercase text-slate-100">SALES INVOICE DOCUMENT</h1>
            <p className="text-xs text-slate-400">{order.order_number}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-bold text-white transition shadow-lg"
        >
          <Download className="h-4 w-4" /> Download PDF Invoice
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#0D131F] p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-lg font-bold text-sky-400 block">ARIA WMS & IMS</span>
            <span className="text-[10px] text-slate-500">AUTONOMOUS FULFILLMENT INVOICE</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-slate-100 block">{order.order_number}</span>
            <span className="text-slate-400 text-[10px]">Date: {formatDate(order.created_at)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Billed To</span>
            <strong className="text-slate-100 block text-sm">{order.customer_name}</strong>
            <span className="text-slate-400 block">{order.customer_email}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Account Tier & Priority</span>
            <strong className="text-purple-400 block text-sm uppercase">{order.customer_tier} TIER ({order.priority_level.toUpperCase()})</strong>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-[#131B2B] text-slate-400 uppercase">
            <tr>
              <th className="p-3">SKU</th>
              <th className="p-3">Description</th>
              <th className="p-3 text-right">Qty</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {(order.items || []).map((it) => (
              <tr key={it.id}>
                <td className="p-3 font-bold text-sky-400">{it.sku}</td>
                <td className="p-3 text-slate-200">{it.product_name}</td>
                <td className="p-3 text-right font-bold text-slate-200">{it.quantity_ordered}</td>
                <td className="p-3 text-right text-slate-300">{formatCurrency(it.unit_price)}</td>
                <td className="p-3 text-right font-bold text-emerald-400">{formatCurrency(it.quantity_ordered * it.unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right pt-4 border-t border-slate-800">
          <span className="text-slate-400 uppercase block text-[10px]">Total Order Amount</span>
          <strong className="text-xl font-bold text-emerald-400">{formatCurrency(order.total_value)}</strong>
        </div>
      </div>
    </div>
  );
}
