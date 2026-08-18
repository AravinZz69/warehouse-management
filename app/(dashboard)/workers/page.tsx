'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { INITIAL_WORKERS } from '@/lib/supabase/mock-db';
import { Worker } from '@/types/database.types';
import { Users, Zap, ShieldCheck, Clock } from 'lucide-react';

export default function WorkersPage() {
  const router = useRouter();
  const [workers] = useState<Worker[]>(INITIAL_WORKERS);

  const columns: Column<Worker>[] = [
    {
      header: 'Worker Name',
      accessorKey: 'full_name',
      cell: (row) => (
        <div className="flex flex-col font-mono">
          <span className="font-bold text-slate-100">{row.full_name}</span>
          <span className="text-[10px] text-slate-500">{row.role}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Shift & Zone',
      accessorKey: 'shift',
      cell: (row) => (
        <span className="font-mono text-purple-400 font-bold">
          {row.shift} Shift • {row.assigned_zone}
        </span>
      ),
    },
    {
      header: 'Pick Speed',
      accessorKey: 'pick_speed_items_per_hr',
      cell: (row) => (
        <span className="font-mono font-bold text-sky-400">
          {row.pick_speed_items_per_hr} items/hr
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Accuracy Rate',
      accessorKey: 'accuracy_rate',
      cell: (row) => (
        <span className="font-mono font-bold text-emerald-400">
          {row.accuracy_rate}%
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Tasks Today',
      accessorKey: 'tasks_completed_today',
      cell: (row) => <span className="font-mono text-slate-200">{row.tasks_completed_today} Completed</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Link href={`/workers/${row.id}`} className="text-xs font-mono text-sky-400 hover:underline">
          Coaching Log →
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
            <Users className="h-6 w-6 text-sky-400" /> FLOOR PERSONNEL & SHIFT MATRIX
          </h1>
          <p className="text-xs font-mono text-slate-400">Operator Pick Speed, Quality Compliance & Shift Schedules</p>
        </div>
      </div>

      <DataTable
        data={workers}
        columns={columns}
        searchPlaceholder="Filter personnel by Name, Role, or Shift..."
        onRowClick={(row) => router.push(`/workers/${row.id}`)}
      />
    </div>
  );
}
