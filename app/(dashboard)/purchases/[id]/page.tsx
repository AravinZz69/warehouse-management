'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_PURCHASE_ORDERS } from '@/lib/supabase/mock-db';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ArrowLeft, CheckCircle2, FileText, Download, Package } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { generatePurchaseOrderPDF } from '@/lib/utils/export-pdf';

export default function PODetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [po, setPo] = useState(
    INITIAL_PURCHASE_ORDERS.find((p) => p.id === id || p.po_number === id) || INITIAL_PURCHASE_ORDERS[0]
  );
  const [receiving, setReceiving] = useState(false);
  const [receiveMessage, setReceiveMessage] = useState<string | null>(null);

  const handleReceiveGRN = async () => {
    setReceiving(true);
    try {
      const res = await fetch(`/api/purchases/${po.id}/receive`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setPo((prev) => ({ ...prev, status: 'received', actual_delivery: new Date().toISOString() }));
        setReceiveMessage('Goods received! Inventory levels updated automatically in Bin A-12-3.');
      }
    } catch (err) {
      console.error('GRN Receive failed:', err);
    } finally {
      setReceiving(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = generatePurchaseOrderPDF(po);
    doc.save(`PurchaseOrder_${po.po_number}.pdf`);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/purchases" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-sky-400">{po.po_number}</h1>
              <StatusBadge status={po.status} />
            </div>
            <p className="text-xs text-slate-400">Supplier: {po.supplier_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-sky-400 hover:bg-slate-800 transition"
          >
            <Download className="h-4 w-4" /> Export PO PDF
          </button>
          {po.status !== 'received' && (
            <button
              type="button"
              disabled={receiving}
              onClick={handleReceiveGRN}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-mono font-bold text-white transition shadow-lg disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" /> ONE-CLICK GOODS RECEIVING (GRN)
            </button>
          )}
        </div>
      </div>

      {receiveMessage && (
        <div className="p-3 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{receiveMessage}</span>
        </div>
      )}

      {/* PO Meta Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0D131F] space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">Expected Delivery</span>
          <strong className="text-slate-100 text-sm block">{formatDate(po.expected_delivery)}</strong>
          <span className="text-slate-400 text-[10px]">Actual: {po.actual_delivery ? formatDate(po.actual_delivery) : 'Pending'}</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0D131F] space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">Total Amount</span>
          <strong className="text-emerald-400 text-sm block">{formatCurrency(po.total_amount)}</strong>
          <span className="text-slate-400 text-[10px]">Warehouse: {po.warehouse_name || 'Chicago Megahub Alpha'}</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0D131F] space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">Order Notes</span>
          <p className="text-slate-300 text-xs italic">{po.notes || 'Standard procurement line order.'}</p>
        </div>
      </div>

      {/* PO Line Items */}
      <div className="rounded-xl border border-slate-800 bg-[#0D131F] p-5 shadow-xl space-y-3">
        <h3 className="font-bold text-slate-200 uppercase">Purchase Line Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#131B2B] text-slate-400 uppercase">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Item Name</th>
                <th className="p-3 text-right">Qty Ordered</th>
                <th className="p-3 text-right">Qty Received</th>
                <th className="p-3 text-right">Unit Cost</th>
                <th className="p-3 text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(po.items || []).map((it, idx) => (
                <tr key={it.id}>
                  <td className="p-3 text-slate-500">{idx + 1}</td>
                  <td className="p-3 font-bold text-sky-400">{it.sku}</td>
                  <td className="p-3 text-slate-200">{it.product_name}</td>
                  <td className="p-3 text-right font-bold text-slate-200">{it.quantity_ordered}</td>
                  <td className="p-3 text-right font-bold text-emerald-400">{it.quantity_received}</td>
                  <td className="p-3 text-right text-slate-300">{formatCurrency(it.unit_cost)}</td>
                  <td className="p-3 text-right font-bold text-emerald-400">{formatCurrency(it.total_cost || it.quantity_ordered * it.unit_cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
