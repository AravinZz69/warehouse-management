'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Truck,
  AlertTriangle,
  FileText,
  Cpu,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PURCHASE_ORDERS, INITIAL_INVENTORY } from '@/lib/supabase/mock-db';
import { calculateInventoryValuation } from '@/lib/warehouse/valuation-engine';
import { formatCurrency } from '@/lib/utils/format';
import { exportOrdersToExcel } from '@/lib/utils/export-excel';
import { useARIAStore } from '@/stores/aria.store';

export default function CommandCentrePage() {
  const { pulseScore, decisions } = useARIAStore();
  const [dateRange, setDateRange] = useState('This Month');

  const valuation = calculateInventoryValuation(INITIAL_PRODUCTS, INITIAL_INVENTORY);
  const totalSalesToday = INITIAL_ORDERS.reduce((acc, cur) => acc + cur.total_value, 0);
  const dispatchedCount = INITIAL_ORDERS.filter((o) => o.status === 'dispatched' || o.status === 'completed').length;
  const lowStockCount = INITIAL_PRODUCTS.filter((p) => (p.total_available || 8) <= p.reorder_threshold).length;

  const chartData = [
    { month: 'Jan', picks: 2400, dispatches: 2100 },
    { month: 'Feb', picks: 3200, dispatches: 2900 },
    { month: 'Mar', picks: 2800, dispatches: 2700 },
    { month: 'Apr', picks: 4100, dispatches: 3800 },
    { month: 'May', picks: 3900, dispatches: 3650 },
    { month: 'Jun', picks: 4800, dispatches: 4500 },
    { month: 'Jul', picks: 5200, dispatches: 4950 },
  ];

  // Donut chart data with Lime accent
  const donutData = [
    { name: 'Completed SLA', value: 92, color: '#84CC16' },
    { name: 'Remaining', value: 8, color: '#E2E8F0' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Overview</span>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Logistics Command Centre</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">
            Dashboard Analytics
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
            <Calendar className="h-4 w-4 text-lime-600 dark:text-lime-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer font-semibold"
            >
              <option value="This Month">This Month (Aug 2026)</option>
              <option value="Last Quarter">Last Quarter</option>
              <option value="Year to Date">Year to Date</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => exportOrdersToExcel(INITIAL_ORDERS)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-lime-400 hover:bg-slate-800 dark:hover:bg-lime-500 text-lime-400 dark:text-slate-950 text-xs font-bold shadow-md transition transform hover:scale-[1.02]"
          >
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* 2. Compact 5 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Card 1: Asset Valuation */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-lime-100 dark:bg-lime-950/40 text-lime-700 dark:text-lime-400 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +8.5%
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">Total Asset Valuation</span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(valuation.total_purchase_valuation)}
            </h3>
            <span className="text-[10px] text-slate-400 mt-1 block">FIFO Book Inventory Value</span>
          </div>
        </div>

        {/* Card 2: Sales Fulfilled */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +12.4%
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">Sales Revenue Today</span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(totalSalesToday)}
            </h3>
            <span className="text-[10px] text-slate-400 mt-1 block">{INITIAL_ORDERS.length} Active Orders</span>
          </div>
        </div>

        {/* Card 3: Outbound Dispatches */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +99.1%
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">Outbound Dispatches</span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {dispatchedCount} / {INITIAL_ORDERS.length} Orders
            </h3>
            <span className="text-[10px] text-slate-400 mt-1 block">99.1% SLA Compliant</span>
          </div>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
              <ArrowDownRight className="h-3 w-3 mr-0.5" /> -2.1%
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">Low Stock Safety Alerts</span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {lowStockCount} SKUs
            </h3>
            <span className="text-[10px] text-slate-400 mt-1 block">Safety Reorder Level</span>
          </div>
        </div>

        {/* Card 5: ARIA Autonomous Pulse */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-lime-100 dark:bg-lime-950/40 text-lime-700 dark:text-lime-400 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center text-xs font-bold text-lime-700 bg-lime-100 dark:bg-lime-950/40 px-2.5 py-0.5 rounded-full">
              Optimal
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-400">ARIA Autonomous Actions</span>
            <h3 className="text-2xl font-bold text-lime-600 dark:text-lime-400 mt-0.5">
              {decisions.length} Decisions
            </h3>
            <span className="text-[10px] text-slate-400 mt-1 block">Conf ≥ 85% Auto Triggered</span>
          </div>
        </div>
      </div>

      {/* 3. Analytics & Donut Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Primary Line/Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fulfillment & Throughput Trends</h3>
              <p className="text-xs text-slate-400">Monthly wave picks vs. carrier dispatches</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-lime-500" /> Wave Picks
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-800" /> Dispatches
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLimePicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84CC16" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#84CC16" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#0F172A',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="picks" stroke="#84CC16" strokeWidth={3} fillOpacity={1} fill="url(#colorLimePicks)" />
                <Area type="monotone" dataKey="dispatches" stroke="#334155" strokeWidth={2} strokeDasharray="3 3" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side Donut Circular Meter */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Warehouse Operational Score</h3>
            <MoreVertical className="h-4 w-4 text-slate-400" />
          </div>

          {/* Lime Donut Chart Meter */}
          <div className="relative h-44 w-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} innerRadius={60} outerRadius={80} startAngle={90} endAngle={-270} dataKey="value">
                  <Cell key="cell-0" fill="#84CC16" />
                  <Cell key="cell-1" fill="#E2E8F0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{pulseScore}%</span>
              <span className="text-[10px] font-semibold text-lime-600 dark:text-lime-400 uppercase">Optimal Health</span>
            </div>
          </div>

          <div className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Real-time SLA compliance, pick accuracy rate, and zero negative stock integrity score.
          </div>
        </div>
      </div>

      {/* 4. Clean Data Table for Outbound Sales Orders */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Sales Order Registry</h3>
            <p className="text-xs text-slate-400">Live order progression, priority rating & consignee details</p>
          </div>
          <Link
            href="/orders"
            className="flex items-center gap-1 text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline"
          >
            View Full Registry <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4">Order Number</th>
                <th className="py-3 px-4">Consignee Customer</th>
                <th className="py-3 px-4">Priority Rating</th>
                <th className="py-3 px-4 text-right">Total Value</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {INITIAL_ORDERS.map((o) => {
                let statusPill = 'bg-slate-100 text-slate-700 border-slate-200';
                if (o.status === 'dispatched' || o.status === 'completed') {
                  statusPill = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                } else if (o.status === 'picking' || o.status === 'allocated') {
                  statusPill = 'bg-amber-50 text-amber-700 border-amber-200';
                } else if (o.status === 'created') {
                  statusPill = 'bg-lime-50 text-lime-800 border-lime-200';
                }

                return (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {o.order_number}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-900 text-lime-400 font-bold text-xs flex items-center justify-center border border-lime-400/40">
                          {(o.customer_name || 'Customer').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-white">{o.customer_name}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-medium">{o.customer_tier} Tier</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border bg-lime-50 text-lime-800 border-lime-200">
                        {o.priority_level} ({o.priority_score})
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrency(o.total_value)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${statusPill}`}>
                        {o.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link href={`/orders/${o.id}`} className="text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline">
                        Details →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
