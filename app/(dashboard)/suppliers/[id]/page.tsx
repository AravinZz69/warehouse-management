'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_SUPPLIERS, INITIAL_PURCHASE_ORDERS } from '@/lib/supabase/mock-db';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ArrowLeft, Factory, Mail, Phone, MapPin, Star, FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export default function SupplierDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const supplier = INITIAL_SUPPLIERS.find((s) => s.id === id) || INITIAL_SUPPLIERS[0];
  const pos = INITIAL_PURCHASE_ORDERS.filter((p) => p.supplier_id === supplier.id);

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/suppliers" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold uppercase text-slate-100">{supplier.company_name}</h1>
          <p className="text-xs text-slate-400">Vendor ID: {supplier.id} | Terms: {supplier.payment_terms}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0D131F] space-y-3 shadow-xl">
          <h3 className="font-bold text-slate-200 text-sm uppercase">Vendor Profile</h3>
          <div className="space-y-2 text-slate-300">
            <div><span className="text-slate-500 uppercase block text-[10px]">Contact Person:</span> {supplier.contact_person}</div>
            <div><span className="text-slate-500 uppercase block text-[10px]">Email:</span> {supplier.email}</div>
            <div><span className="text-slate-500 uppercase block text-[10px]">Phone:</span> {supplier.phone}</div>
            <div><span className="text-slate-500 uppercase block text-[10px]">Rating:</span> ★ {supplier.rating.toFixed(2)} / 5.00</div>
          </div>
        </div>

        <div className="md:col-span-2 p-5 rounded-xl border border-slate-800 bg-[#0D131F] space-y-4 shadow-xl">
          <h3 className="font-bold text-slate-200 text-sm uppercase">Purchase Order History ({pos.length})</h3>
          <div className="space-y-2">
            {pos.map((p) => (
              <Link
                key={p.id}
                href={`/purchases/${p.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500 transition"
              >
                <div>
                  <span className="font-bold text-sky-400 block">{p.po_number}</span>
                  <span className="text-[10px] text-slate-400">Expected: {p.expected_delivery}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-200">{formatCurrency(p.total_amount)}</span>
                  <StatusBadge status={p.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
