'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_WAREHOUSES, INITIAL_ZONES } from '@/lib/supabase/mock-db';
import { Building2, MapPin, Layers, ChevronRight } from 'lucide-react';

export default function WarehousesPage() {
  return (
    <div className="space-y-6 font-mono">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold uppercase text-slate-100 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-sky-400" /> MULTI-WAREHOUSE FACILITY DIRECTORY
        </h1>
        <p className="text-xs text-slate-400">Warehouse Topology, Storage Zones & Bin Occupancy Grid</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {INITIAL_WAREHOUSES.map((wh) => (
          <div key={wh.id} className="rounded-xl border border-slate-800 bg-[#0D131F] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">{wh.name}</h3>
                <span className="text-xs text-sky-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" /> {wh.city}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold uppercase">
                Active Facility
              </span>
            </div>

            <p className="text-xs text-slate-400">{wh.address}</p>

            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-bold">{wh.total_zones} Functional Zones</span>
              <Link
                href={`/warehouses/${wh.id}`}
                className="flex items-center gap-1 text-xs font-bold text-sky-400 hover:underline"
              >
                Inspect Bin Occupancy Grid <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
