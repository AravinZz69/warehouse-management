'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/ui.store';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Factory,
  ShoppingCart,
  Truck,
  Users,
  Building2,
  FileText,
  Bell,
  BarChart3,
  Cpu,
  Barcode,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, activeRole } = useUIStore();

  const navigationGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Project Overview', href: '/home', icon: FileText },
        { name: 'ARIA AI HQ', href: '/aria', icon: Cpu, badge: 'AI' },
      ],
    },
    {
      group: 'INVENTORY & HARDWARE',
      items: [
        { name: 'Product Catalog', href: '/products', icon: Package },
        { name: 'Stock Matrix', href: '/inventory', icon: Boxes },
        { name: 'Barcode Audit HUD', href: '/inventory/scanner', icon: Barcode, badge: 'HUD' },
      ],
    },
    {
      group: 'PROCUREMENT & SALES',
      items: [
        { name: 'Suppliers Directory', href: '/suppliers', icon: Factory },
        { name: 'Purchase Orders', href: '/purchases', icon: FileText },
        { name: 'Sales Orders', href: '/orders', icon: ShoppingCart },
        { name: 'Customer Directory', href: '/customers', icon: Users },
      ],
    },
    {
      group: 'FULFILLMENT PIPELINE',
      items: [
        { name: '9-Stage Kanban', href: '/lifecycle', icon: Truck },
        { name: 'Priority Queue', href: '/lifecycle/priority', icon: ShieldCheck },
        { name: 'Wave Picking', href: '/lifecycle/picking', icon: Truck },
        { name: 'Packing Station', href: '/lifecycle/packing', icon: Truck },
        { name: 'QA Desk', href: '/lifecycle/quality-check', icon: ShieldCheck },
        { name: 'Dispatch Station', href: '/lifecycle/dispatch', icon: Truck },
      ],
    },
    {
      group: 'FACILITY & WORKFORCE',
      items: [
        { name: 'Warehouses Topology', href: '/warehouses', icon: Building2 },
        { name: 'Floor Personnel', href: '/workers', icon: Users },
      ],
    },
    {
      group: 'ANALYTICS & REPORTS',
      items: [
        { name: 'Reports & Invoices', href: '/reports', icon: FileText },
        { name: 'Alert Central', href: '/alerts', icon: Bell },
        { name: 'Analytics & SLA', href: '/analytics', icon: BarChart3 },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'fixed top-3 left-3 bottom-3 z-40 bg-[#0D1117] border border-[#21262D] transition-all duration-300 flex flex-col shadow-2xl rounded-2xl text-slate-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Fixed Dark Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#21262D] shrink-0">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center shadow-md shrink-0">
            <Zap className="h-5 w-5 fill-current text-white" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col truncate whitespace-nowrap">
              <span className="text-base font-extrabold tracking-tight text-white leading-none">ARIA WMS</span>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wide uppercase">Enterprise v5.0</span>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#161B22] transition shrink-0"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Fixed Dark Sidebar Items with Single-Line Formatting */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {navigationGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            {sidebarOpen && (
              <h5 className="px-3 text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-2 truncate whitespace-nowrap">
                {group.group}
              </h5>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!sidebarOpen ? item.name : undefined}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all font-medium group truncate whitespace-nowrap',
                    isActive
                      ? 'bg-[#21262D] text-blue-400 font-bold border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:bg-[#161B22] hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3 truncate whitespace-nowrap">
                    <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white')} />
                    {sidebarOpen && <span className="truncate whitespace-nowrap">{item.name}</span>}
                  </div>
                  {sidebarOpen && item.badge && (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ml-2',
                        isActive
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-slate-800 text-slate-400'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Fixed Dark Sidebar Role Footer */}
      {sidebarOpen && (
        <div className="p-4 border-t border-[#21262D] bg-[#161B22]/80 rounded-b-2xl shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col truncate whitespace-nowrap">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Role</span>
              <span className="text-xs font-bold text-blue-400 uppercase truncate">{activeRole}</span>
            </div>
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shrink-0" title="System Active" />
          </div>
        </div>
      )}
    </aside>
  );
};
