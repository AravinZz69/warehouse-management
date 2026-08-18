'use client';

import React from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PURCHASE_ORDERS } from '@/lib/supabase/mock-db';
import { exportProductsToExcel, exportOrdersToExcel, exportPurchaseOrdersToExcel } from '@/lib/utils/export-excel';
import { generateValuationReportPDF, generateSalesInvoicePDF } from '@/lib/utils/export-pdf';
import { FileText, FileSpreadsheet, Download, DollarSign, TrendingUp, Boxes } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export default function ReportsPage() {
  const handleDownloadValuationPDF = () => {
    const doc = generateValuationReportPDF(INITIAL_PRODUCTS);
    doc.save('ARIA_Inventory_Valuation_Report.pdf');
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
          <FileText className="h-6 w-6 text-sky-400" /> FINANCIAL & OPERATIONAL REPORTING HUB
        </h1>
        <p className="text-xs text-slate-400">One-click PDF Report Generation & Excel (.xlsx) Spreadsheet Exports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Report 1: Inventory Valuation */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0D131F] space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-sky-400" />
              <h3 className="font-bold text-slate-100 text-sm">Inventory Asset Valuation</h3>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              FIFO & Moving Average cost valuation across catalog SKUs and bin locations.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleDownloadValuationPDF}
              className="w-full flex items-center justify-center gap-2 rounded bg-sky-600 hover:bg-sky-500 py-2.5 text-xs font-bold text-white transition shadow-md"
            >
              <Download className="h-4 w-4" /> Download PDF Report
            </button>
            <button
              type="button"
              onClick={() => exportProductsToExcel(INITIAL_PRODUCTS)}
              className="w-full flex items-center justify-center gap-2 rounded bg-slate-900 border border-slate-700 py-2.5 text-xs font-bold text-emerald-400 hover:bg-slate-800 transition"
            >
              <FileSpreadsheet className="h-4 w-4" /> Export Catalog Excel (.xlsx)
            </button>
          </div>
        </div>

        {/* Report 2: Sales & Fulfillment */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0D131F] space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-slate-100 text-sm">Sales Orders & Revenue Margins</h3>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Outbound sales performance, SLA compliance rates, and priority scores.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => exportOrdersToExcel(INITIAL_ORDERS)}
              className="w-full flex items-center justify-center gap-2 rounded bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white transition shadow-md"
            >
              <FileSpreadsheet className="h-4 w-4" /> Export Sales Orders Excel (.xlsx)
            </button>
          </div>
        </div>

        {/* Report 3: Procurement & POs */}
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0D131F] space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-400" />
              <h3 className="font-bold text-slate-100 text-sm">Inbound Procurement Outlays</h3>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Purchase order status, vendor lead times, and receiving history.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => exportPurchaseOrdersToExcel(INITIAL_PURCHASE_ORDERS)}
              className="w-full flex items-center justify-center gap-2 rounded bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-bold text-white transition shadow-md"
            >
              <FileSpreadsheet className="h-4 w-4" /> Export Purchase Orders Excel (.xlsx)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
