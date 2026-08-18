'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable, Column } from '@/components/shared/DataTable';
import { INITIAL_SUPPLIERS } from '@/lib/supabase/mock-db';
import { Supplier } from '@/types/supplier.types';
import { Factory, Plus, Star, Mail, Phone, MapPin } from 'lucide-react';

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);

  const columns: Column<Supplier>[] = [
    {
      header: 'Company Name',
      accessorKey: 'company_name',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-100">{row.company_name}</span>
          <span className="text-[10px] text-slate-500 font-mono">Contact: {row.contact_person}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Contact Info',
      accessorKey: 'email',
      cell: (row) => (
        <div className="flex flex-col text-xs font-mono text-slate-300">
          <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-sky-400" /> {row.email}</span>
          <span className="flex items-center gap-1 text-[10px] text-slate-400"><Phone className="h-3 w-3 text-slate-500" /> {row.phone}</span>
        </div>
      ),
    },
    {
      header: 'Payment Terms',
      accessorKey: 'payment_terms',
      cell: (row) => <span className="font-mono text-purple-400 font-bold">{row.payment_terms}</span>,
    },
    {
      header: 'Performance Rating',
      accessorKey: 'rating',
      cell: (row) => (
        <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
          <Star className="h-4 w-4 fill-amber-400" />
          <span>{row.rating.toFixed(2)}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Link href={`/suppliers/${row.id}`} className="text-xs font-mono text-sky-400 hover:underline">
          View Profile →
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-mono text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
            <Factory className="h-6 w-6 text-sky-400" /> SUPPLIER DIRECTORY & PERFORMANCE RATINGS
          </h1>
          <p className="text-xs font-mono text-slate-400">Preferred Procurement Vendors & SLA Compliance</p>
        </div>

        <Link
          href="/suppliers/new"
          className="flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-mono font-bold text-white transition shadow-lg"
        >
          <Plus className="h-4 w-4" /> Add Vendor
        </Link>
      </div>

      <DataTable
        data={suppliers}
        columns={columns}
        searchPlaceholder="Filter vendors by Company, Contact, or Location..."
        onRowClick={(row) => router.push(`/suppliers/${row.id}`)}
      />
    </div>
  );
}
