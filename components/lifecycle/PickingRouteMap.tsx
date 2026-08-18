'use client';

import React from 'react';
import { PickItemLocation, sortBinsSerpentine } from '@/lib/warehouse/picking-router';
import { Navigation, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PickingRouteMapProps {
  items: PickItemLocation[];
  activeBinCode?: string;
}

export const PickingRouteMap: React.FC<PickingRouteMapProps> = ({ items, activeBinCode }) => {
  const sortedItems = sortBinsSerpentine(items);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F] p-6 text-slate-900 dark:text-slate-100 shadow-sm font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4 text-blue-600 dark:text-sky-400" />
          <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-slate-200">OPTIMAL SERPENTINE WAVE PICK ROUTE</h3>
        </div>
        <span className="text-[10px] font-bold text-blue-700 dark:text-sky-400 bg-blue-50 dark:bg-sky-950 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-sky-800">
          TRAVEL MINIMIZED (-14%)
        </span>
      </div>

      {/* Interactive SVG Floor Routing Canvas */}
      <div className="relative aspect-[16/7] w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080C14] p-4 flex flex-col justify-between overflow-hidden">
        {/* Grid Aisle Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
          <span>START: Receiving Staging</span>
          <span>ZONE A - HIGH VELOCITY PICKING</span>
          <span>END: Packing Station D</span>
        </div>

        {/* Serpentine Route Nodes */}
        <div className="relative z-10 flex items-center justify-around py-6 overflow-x-auto">
          {sortedItems.map((item, idx) => {
            const isActive = item.bin_code === activeBinCode;
            return (
              <div key={idx} className="flex flex-col items-center gap-2 relative group shrink-0 px-2">
                <div
                  className={cn(
                    'flex items-center justify-center h-10 w-10 rounded-full border font-mono font-bold text-xs transition-all shadow-md',
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-300 animate-bounce shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                      : 'bg-white dark:bg-slate-900 text-blue-600 dark:text-sky-400 border-slate-200 dark:border-sky-800'
                  )}
                >
                  {idx + 1}
                </div>
                <span className="text-[11px] font-bold text-slate-900 dark:text-slate-200 font-mono">{item.bin_code}</span>
                <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 max-w-[90px] truncate text-center">
                  {item.sku}
                </span>

                {/* Connecting Arrow */}
                {idx < sortedItems.length - 1 && (
                  <div className="hidden sm:block absolute left-full top-5 w-8 h-0.5 bg-blue-300 dark:bg-sky-500/50 -translate-y-1/2 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Total Stops: {sortedItems.length} Bins</span>
          <span>Algorithm: Serpentine Aisle Traversal</span>
        </div>
      </div>
    </div>
  );
};
