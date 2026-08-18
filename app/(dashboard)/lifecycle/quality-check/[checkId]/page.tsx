'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { INITIAL_ORDERS } from '@/lib/supabase/mock-db';
import { QCChecklistView } from '@/components/lifecycle/QCChecklistView';
import { ArrowLeft } from 'lucide-react';

export default function QCCheckDetailPage() {
  const params = useParams();
  const router = useRouter();
  const checkId = params.checkId as string;

  const order = INITIAL_ORDERS.find((o) => o.id === checkId || o.order_number === checkId) || INITIAL_ORDERS[0];

  const handlePassQC = async () => {
    try {
      await fetch(`/api/orders/${order.id}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_stage: 'dispatched' }),
      });
      router.push('/lifecycle/dispatch');
    } catch (err) {
      console.error('QC approval failed:', err);
    }
  };

  const handleFailQC = async (defects: string[]) => {
    try {
      await fetch(`/api/orders/${order.id}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_stage: 'on_hold' }),
      });
      router.push('/lifecycle');
    } catch (err) {
      console.error('QC failure flag failed:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/lifecycle/quality-check" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100">7-POINT QA INSPECTION DESK</h1>
          <p className="text-xs font-mono text-slate-400">Order: {order.order_number}</p>
        </div>
      </div>

      <QCChecklistView order={order} onPassQC={handlePassQC} onFailQC={handleFailQC} />
    </div>
  );
}
