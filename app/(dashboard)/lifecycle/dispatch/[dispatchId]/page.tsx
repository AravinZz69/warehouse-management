'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { DispatchManifestCard } from '@/components/lifecycle/DispatchManifestCard';
import { ArrowLeft } from 'lucide-react';

export default function DispatchTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatchId = params.dispatchId as string;

  const order = INITIAL_ORDERS.find((o) => o.id === dispatchId || o.order_number === dispatchId) || INITIAL_ORDERS[0];

  const handleConfirmDispatch = async (carrier: string, trackingNumber: string) => {
    try {
      await fetch(`/api/orders/${order.id}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_stage: 'dispatched' }),
      });
      router.push('/orders');
    } catch (err) {
      console.error('Dispatch failed:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/lifecycle/dispatch" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100">DISPATCH DESK & CARRIER MANIFEST</h1>
          <p className="text-xs font-mono text-slate-400">Order: {order.order_number}</p>
        </div>
      </div>

      <DispatchManifestCard order={order} onConfirmDispatch={handleConfirmDispatch} />
    </div>
  );
}
