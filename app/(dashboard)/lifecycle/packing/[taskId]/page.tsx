'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { PackingVerificationView } from '@/components/lifecycle/PackingVerificationView';
import { ArrowLeft } from 'lucide-react';

export default function PackingTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  const order = INITIAL_ORDERS.find((o) => o.id === taskId || o.order_number === taskId) || INITIAL_ORDERS[0];

  const handleSeal = async (boxType: string, weightKg: number) => {
    try {
      await fetch(`/api/orders/${order.id}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_stage: 'quality_check' }),
      });
      router.push('/lifecycle/quality-check');
    } catch (err) {
      console.error('Packing seal failed:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/lifecycle/packing" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100">PACKING VERIFICATION STATION</h1>
          <p className="text-xs font-mono text-slate-400">Order: {order.order_number}</p>
        </div>
      </div>

      <PackingVerificationView order={order} onSealManifest={handleSeal} />
    </div>
  );
}
