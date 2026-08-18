'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { SLACountdown } from '@/components/shared/SLACountdown';
import { OrderDNABar } from '@/components/shared/OrderDNABar';
import { OrderStatus } from '@/types/order.types';
import { ArrowLeft, ArrowRight, Download, FileText, CheckCircle2, AlertTriangle, Truck } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { generateSalesInvoicePDF } from '@/lib/utils/export-pdf';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState(
    INITIAL_ORDERS.find((o) => o.id === id || o.order_number === id) || INITIAL_ORDERS[0]
  );
  const [advancing, setAdvancing] = useState(false);
  const [advanceMsg, setAdvanceMsg] = useState<string | null>(null);

  const handleAdvanceStage = async (nextStage: OrderStatus) => {
    setAdvancing(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_stage: nextStage }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrder(data.data);
        setAdvanceMsg(`Order advanced to stage: ${nextStage.toUpperCase()}`);
      } else {
        setAdvanceMsg(`Error: ${data.error}`);
      }
    } catch (err) {
      setAdvanceMsg('Stage advancement failed.');
    } finally {
      setAdvancing(false);
    }
  };

  const handleDownloadInvoice = () => {
    const doc = generateSalesInvoicePDF(order);
    doc.save(`SalesInvoice_${order.order_number}.pdf`);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/orders" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-sky-400">{order.order_number}</h1>
              <StatusBadge status={order.status} />
              <PriorityBadge score={order.priority_score} level={order.priority_level} />
            </div>
            <p className="text-xs text-slate-400">Consignee: {order.customer_name} ({order.customer_tier?.toUpperCase()})</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs font-mono text-sky-400 hover:bg-slate-800 transition"
          >
            <Download className="h-4 w-4" /> Export Sales Invoice PDF
          </button>
        </div>
      </div>

      {advanceMsg && (
        <div className="p-3 rounded bg-sky-950/80 border border-sky-800 text-sky-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-sky-400" />
          <span>{advanceMsg}</span>
        </div>
      )}

      {/* Order DNA Bar Ribbon */}
      <div className="p-4 rounded-xl border border-slate-800 bg-[#0D131F] space-y-2 shadow-xl">
        <span className="text-[10px] text-slate-500 uppercase block">Order DNA 8-Segment Pipeline Telemetry</span>
        <OrderDNABar status={order.status} priorityLevel={order.priority_level} className="max-w-full" />
      </div>

      {/* 3 Column Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0D131F] space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">SLA Countdown</span>
          <SLACountdown deadlineISO={order.sla_deadline} />
          <span className="text-[10px] text-slate-400 block mt-1">Requested: {formatDate(order.requested_delivery_date)}</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0D131F] space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">Total Value</span>
          <strong className="text-emerald-400 text-sm block">{formatCurrency(order.total_value)}</strong>
          <span className="text-[10px] text-slate-400 block">Payment: {order.payment_status.toUpperCase()}</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0D131F] space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">Stage Controls</span>
          <div className="flex items-center gap-2 pt-1">
            {order.status === 'created' && (
              <button
                type="button"
                onClick={() => handleAdvanceStage('priority_scored')}
                className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 font-bold text-white transition"
              >
                Score Priority →
              </button>
            )}
            {order.status === 'priority_scored' && (
              <button
                type="button"
                onClick={() => handleAdvanceStage('inventory_checked')}
                className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 font-bold text-white transition"
              >
                Verify Stock →
              </button>
            )}
            {order.status === 'inventory_checked' && (
              <button
                type="button"
                onClick={() => handleAdvanceStage('allocated')}
                className="px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 font-bold text-white transition"
              >
                Lock Stock (FEFO) →
              </button>
            )}
            {order.status === 'allocated' && (
              <button
                type="button"
                onClick={() => handleAdvanceStage('picking')}
                className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 font-bold text-white transition"
              >
                Start Wave Pick →
              </button>
            )}
            {order.status === 'picking' && (
              <button
                type="button"
                onClick={() => handleAdvanceStage('packing')}
                className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 font-bold text-white transition"
              >
                Move to Packing →
              </button>
            )}
            {order.status === 'packing' && (
              <button
                type="button"
                onClick={() => handleAdvanceStage('quality_check')}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 font-bold text-white transition"
              >
                Move to QA Desk →
              </button>
            )}
            {order.status === 'quality_check' && (
              <button
                type="button"
                onClick={() => handleAdvanceStage('dispatched')}
                className="px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 font-bold text-white transition"
              >
                Dispatch to Carrier →
              </button>
            )}
            {order.status === 'dispatched' && (
              <button
                type="button"
                onClick={() => handleAdvanceStage('completed')}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 font-bold text-white transition"
              >
                Mark Delivered →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Order Line Items Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0D131F] p-5 shadow-xl space-y-3">
        <h3 className="font-bold text-slate-200 uppercase">Order SKU Line Items</h3>
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#131B2B] text-slate-400 uppercase">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">SKU / Barcode</th>
              <th className="p-3">Item Name</th>
              <th className="p-3 text-right">Qty Ordered</th>
              <th className="p-3 text-right">Qty Allocated</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right">Total Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {(order.items || []).map((it, idx) => (
              <tr key={it.id}>
                <td className="p-3 text-slate-500">{idx + 1}</td>
                <td className="p-3 font-bold text-sky-400">{it.sku}</td>
                <td className="p-3 text-slate-200">{it.product_name}</td>
                <td className="p-3 text-right font-bold text-slate-200">{it.quantity_ordered}</td>
                <td className="p-3 text-right font-bold text-emerald-400">{it.quantity_allocated}</td>
                <td className="p-3 text-right text-slate-300">{formatCurrency(it.unit_price)}</td>
                <td className="p-3 text-right font-bold text-emerald-400">{formatCurrency(it.quantity_ordered * it.unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
