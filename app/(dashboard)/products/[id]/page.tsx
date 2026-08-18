'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_PRODUCTS, INITIAL_INVENTORY } from '@/lib/supabase/mock-db';
import { BarcodeBadge } from '@/components/shared/BarcodeBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ArrowLeft, Package, MapPin, DollarSign, TrendingUp, AlertTriangle, Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const product = INITIAL_PRODUCTS.find((p) => p.id === id || p.sku === id) || INITIAL_PRODUCTS[0];
  const inventory = INITIAL_INVENTORY.filter((inv) => inv.product_id === product.id);

  const totalAvailable = inventory.reduce((acc, cur) => acc + cur.quantity_available, 0);
  const totalReserved = inventory.reduce((acc, cur) => acc + cur.quantity_reserved, 0);
  const totalDamaged = inventory.reduce((acc, cur) => acc + cur.quantity_damaged, 0);
  const totalValuation = (totalAvailable + totalReserved) * product.purchase_price;

  // Sample Demand Curve Data
  const demandData = [
    { day: 'Mon', demand: 12 },
    { day: 'Tue', demand: 19 },
    { day: 'Wed', demand: 25 },
    { day: 'Thu', demand: 18 },
    { day: 'Fri', demand: 32 },
    { day: 'Sat', demand: 28 },
    { day: 'Sun', demand: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/products" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-sky-400">{product.sku}</span>
              <StatusBadge status={totalAvailable <= product.reorder_threshold ? 'warning' : 'active'} />
            </div>
            <h1 className="text-sm font-bold text-slate-200">{product.name}</h1>
          </div>
        </div>

        <Link
          href={`/products/${product.id}/edit`}
          className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 text-xs font-mono text-sky-400 hover:bg-slate-800 transition"
        >
          <Edit className="h-4 w-4" /> Edit SKU Metadata
        </Link>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#0D131F] shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase">Available Stock</span>
          <span className="text-2xl font-bold text-emerald-400 block mt-1">{totalAvailable} units</span>
          <span className="text-[9px] text-slate-500 mt-0.5">Threshold: {product.reorder_threshold} units</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0D131F] shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase">Reserved / Locked</span>
          <span className="text-2xl font-bold text-amber-400 block mt-1">{totalReserved} units</span>
          <span className="text-[9px] text-slate-500 mt-0.5">FEFO Order Allocations</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0D131F] shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase">Damaged / Quarantine</span>
          <span className="text-2xl font-bold text-red-400 block mt-1">{totalDamaged} units</span>
          <span className="text-[9px] text-slate-500 mt-0.5">Quality Inspection Hold</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#0D131F] shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase">FIFO Valuation</span>
          <span className="text-2xl font-bold text-sky-400 block mt-1">{formatCurrency(totalValuation)}</span>
          <span className="text-[9px] text-slate-500 mt-0.5">Unit Cost: {formatCurrency(product.purchase_price)}</span>
        </div>
      </div>

      {/* Main Split: Bin Mapping & Demand Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bin Location Mapping */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-[#0D131F] p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sky-400" />
              <h3 className="font-mono text-sm font-bold uppercase text-slate-200">WAREHOUSE BIN LOCATION MAPPING</h3>
            </div>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
              {inventory.length} Bins
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {inventory.length === 0 ? (
              <div className="p-4 text-center text-slate-500 italic">No active bin allocations found.</div>
            ) : (
              inventory.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-bold text-sky-400 text-sm block">Bin {inv.bin_code}</span>
                    <span className="text-[10px] text-slate-400">Batch: {inv.batch_number || 'BATCH-DEFAULT'}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-100 block">{inv.quantity_available} Available</span>
                    <span className="text-[10px] text-amber-400">{inv.quantity_reserved} Reserved</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Demand Velocity Curve Chart */}
        <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-[#0D131F] p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <h3 className="font-mono text-sm font-bold uppercase text-slate-200">7-DAY DEMAND VELOCITY CURVE</h3>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandData}>
                <defs>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" fontSize={10} fontStyle="mono" />
                <YAxis stroke="#475569" fontSize={10} fontStyle="mono" />
                <Tooltip contentStyle={{ backgroundColor: '#0D131F', borderColor: '#1E293B', color: '#F8FAFC' }} />
                <Area type="monotone" dataKey="demand" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorDemand)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Barcode SVG Footer Badge */}
      <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-800 bg-[#0D131F] text-center shadow-xl">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase mb-2">Shelf Bin Tag Barcode SVG</span>
        <BarcodeBadge value={product.barcode} width={2} height={50} />
      </div>
    </div>
  );
}
