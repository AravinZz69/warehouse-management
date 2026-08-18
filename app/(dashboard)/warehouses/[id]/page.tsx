'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_WAREHOUSES, INITIAL_ZONES, INITIAL_BINS } from '@/lib/supabase/mock-db';
import { ArrowLeft, Building2, Layers, CheckCircle2, Box } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function WarehouseDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const warehouse = INITIAL_WAREHOUSES.find((w) => w.id === id) || INITIAL_WAREHOUSES[0];

  return (
    <div className="space-y-6 font-mono text-xs">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/warehouses" className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold uppercase text-slate-100">{warehouse.name}</h1>
          <p className="text-xs text-slate-400">Location: {warehouse.city} | Interactive Bin Occupancy Canvas</p>
        </div>
      </div>

      {/* Interactive SVG Zone & Bin Occupancy Canvas */}
      <div className="rounded-xl border border-slate-800 bg-[#0D131F] p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-sky-400" />
            <h3 className="text-sm font-bold uppercase text-slate-100">FACILITY TOPOLOGY & BIN MAP</h3>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-500" /> Occupied Bin</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-800" /> Available Bin</span>
          </div>
        </div>

        {/* Zones Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INITIAL_ZONES.map((zone) => {
            const zoneBins = INITIAL_BINS.filter((b) => b.zone_id === zone.id);

            return (
              <div key={zone.id} className="p-4 rounded-lg bg-[#080C14] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-400">{zone.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase">{zone.zone_type}</span>
                </div>

                {/* Bin Nodes Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {INITIAL_BINS.map((b) => (
                    <div
                      key={b.id}
                      className={cn(
                        'p-2 rounded border text-center transition',
                        b.is_occupied
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      )}
                    >
                      <span className="block text-[11px] font-mono">{b.bin_code}</span>
                      <span className="text-[9px] block text-slate-400">{b.is_occupied ? 'SKU STOCKED' : 'EMPTY'}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
