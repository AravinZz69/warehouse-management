'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { INITIAL_CUSTOMERS } from '@/lib/supabase/mock-db';
import { Customer } from '@/types/order.types';
import { formatCurrency } from '@/lib/utils/format';
import { Users, Mail, Phone, Award } from 'lucide-react';

export default function CustomersPage() {
  const router = useRouter();
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  const columns: Column<Customer>[] = [
    {
      header: 'Customer / Company',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex flex-col font-mono">
          <span className="font-bold text-slate-100">{row.name}</span>
          <span className="text-[10px] text-slate-500">{row.company}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Tier Status',
      accessorKey: 'tier',
      cell: (row) => {
        let badge = 'bg-slate-800 text-slate-300 border-slate-700';
        if (row.tier === 'vip') badge = 'bg-purple-950 text-purple-400 border-purple-800 animate-pulse';
        else if (row.tier === 'priority') badge = 'bg-sky-950 text-sky-400 border-sky-800';

        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${badge}`}>
            {row.tier}
          </span>
        );
      },
      sortable: true,
    },
    {
      header: 'Contact Info',
      accessorKey: 'email',
      cell: (row) => (
        <div className="flex flex-col text-xs font-mono text-slate-300">
          <span>{row.email}</span>
          <span className="text-[10px] text-slate-500">{row.phone}</span>
        </div>
      ),
    },
    {
      header: 'Total Orders',
      accessorKey: 'total_orders',
      cell: (row) => <span className="font-mono text-slate-200">{row.total_orders} Orders</span>,
      sortable: true,
    },
    {
      header: 'Lifetime Value (LTV)',
      accessorKey: 'total_spend',
      cell: (row) => <span className="font-mono font-bold text-emerald-400">{formatCurrency(row.total_spend)}</span>,
      sortable: true,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Link href={`/customers/${row.id}`} className="text-xs font-mono text-sky-400 hover:underline">
          View History →
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
            <Users className="h-6 w-6 text-sky-400" /> CUSTOMER DIRECTORY & TIER RATINGS
          </h1>
          <p className="text-xs font-mono text-slate-400">VIP / Priority / Standard Customer Accounts & SLA Multipliers</p>
        </div>
      </div>

      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Search customers by Name, Email, or Tier..."
        onRowClick={(row) => router.push(`/customers/${row.id}`)}
      />
    </div>
  );
}
