'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_WORKERS } from '@/lib/supabase/mock-db';
import { ArrowLeft, Users, Zap, ShieldCheck, Cpu } from 'lucide-react';

export default function WorkerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const worker = INITIAL_WORKERS.find((w) => w.id === id) || INITIAL_WORKERS[0];

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/workers" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold uppercase text-slate-100">{worker.full_name}</h1>
          <p className="text-xs text-slate-400">{worker.role} | {worker.shift} Shift ({worker.assigned_zone})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl border border-slate-800 bg-[#0D131F] space-y-3 shadow-xl">
          <h3 className="font-bold text-slate-200 text-sm uppercase">Performance Telemetry</h3>
          <div className="space-y-2 text-slate-300">
            <div><span className="text-slate-500 uppercase block text-[10px]">Pick Speed:</span> <strong className="text-sky-400">{worker.pick_speed_items_per_hr} items/hr</strong></div>
            <div><span className="text-slate-500 uppercase block text-[10px]">Accuracy Rate:</span> <strong className="text-emerald-400">{worker.accuracy_rate}%</strong></div>
            <div><span className="text-slate-500 uppercase block text-[10px]">Tasks Today:</span> {worker.tasks_completed_today} Completed</div>
          </div>
        </div>

        <div className="md:col-span-2 p-5 rounded-xl border border-slate-800 bg-[#0D131F] space-y-4 shadow-xl">
          <h3 className="font-bold text-slate-200 text-sm uppercase flex items-center gap-2">
            <Cpu className="h-4 w-4 text-purple-400" /> ARIA AI COACHING LOG & FEEDBACK
          </h3>
          <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-900/40 text-purple-200 space-y-2">
            <strong className="block text-purple-300">Automated Coaching Insight:</strong>
            <p className="leading-relaxed">
              Operator {worker.full_name} is performing at top 5% efficiency with 99.4% accuracy across Zone A serpentine picking routes. Recommended for Wave Leader role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
