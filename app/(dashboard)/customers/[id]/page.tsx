'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_CUSTOMERS, INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ArrowLeft, Users, Mail, Phone, Award, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const customer = INITIAL_CUSTOMERS.find((c) => c.id === id) || INITIAL_CUSTOMERS[0];
  const orders = INITIAL_ORDERS.filter((o) => o.customer_id === customer.id);

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/customers" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold uppercase text-slate-100">{customer.name}</h1>
          <p className="text-xs text-slate-400">Account Tier: <span className="text-purple-400 font-bold uppercase">{customer.tier}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0D131F] space-y-3 shadow-xl">
          <h3 className="font-bold text-slate-200 text-sm uppercase">Customer Account Profile</h3>
          <div className="space-y-2 text-slate-300">
            <div><span className="text-slate-500 uppercase block text-[10px]">Company:</span> {customer.company}</div>
            <div><span className="text-slate-500 uppercase block text-[10px]">Email:</span> {customer.email}</div>
            <div><span className="text-slate-500 uppercase block text-[10px]">Phone:</span> {customer.phone}</div>
            <div><span className="text-slate-500 uppercase block text-[10px]">Lifetime Spend:</span> <strong className="text-emerald-400">{formatCurrency(customer.total_spend)}</strong></div>
          </div>
        </div>

        <div className="md:col-span-2 p-5 rounded-xl border border-slate-800 bg-[#0D131F] space-y-4 shadow-xl">
          <h3 className="font-bold text-slate-200 text-sm uppercase">Sales Order History ({orders.length})</h3>
          <div className="space-y-2">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/orders/${o.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500 transition"
              >
                <div>
                  <span className="font-bold text-sky-400 block">{o.order_number}</span>
                  <span className="text-[10px] text-slate-400">Date: {o.requested_delivery_date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-200">{formatCurrency(o.total_value)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
