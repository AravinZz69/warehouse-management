'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useUIStore } from '@/stores/ui.store';
import { useRouter } from 'next/navigation';
import { Search, Package, ShoppingCart, Truck, Factory, Users, FileText, Cpu, Barcode, X } from 'lucide-react';

export const CommandMenu: React.FC = () => {
  const { commandMenuOpen, setCommandMenuOpen } = useUIStore();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { label: 'Command Centre Dashboard', href: '/', icon: Cpu, category: 'Core' },
    { label: 'Product Catalog & SKUs', href: '/products', icon: Package, category: 'Inventory' },
    { label: '+ Add New Product', href: '/products/new', icon: Package, category: 'Inventory' },
    { label: 'Stock Matrix & Valuation', href: '/inventory', icon: Package, category: 'Inventory' },
    { label: 'Full-Screen Mobile Barcode Audit HUD', href: '/inventory/scanner', icon: Barcode, category: 'Hardware' },
    { label: 'Supplier Directory', href: '/suppliers', icon: Factory, category: 'Procurement' },
    { label: 'Purchase Orders (PO)', href: '/purchases', icon: FileText, category: 'Procurement' },
    { label: '+ Create Purchase Order', href: '/purchases/new', icon: FileText, category: 'Procurement' },
    { label: 'Sales Orders (SO)', href: '/orders', icon: ShoppingCart, category: 'Fulfillment' },
    { label: '+ Create Sales Order', href: '/orders/new', icon: ShoppingCart, category: 'Fulfillment' },
    { label: '9-Stage Lifecycle Kanban', href: '/lifecycle', icon: Truck, category: 'Fulfillment' },
    { label: 'Wave Picking Station', href: '/lifecycle/picking', icon: Truck, category: 'Fulfillment' },
    { label: 'Packing Station', href: '/lifecycle/packing', icon: Truck, category: 'Fulfillment' },
    { label: 'QA Check Station', href: '/lifecycle/quality-check', icon: Truck, category: 'Fulfillment' },
    { label: 'Dispatch Desk', href: '/lifecycle/dispatch', icon: Truck, category: 'Fulfillment' },
    { label: 'Warehouse Facilities & Bin Floor Map', href: '/warehouses', icon: Factory, category: 'Facility' },
    { label: 'Floor Personnel Shift Matrix', href: '/workers', icon: Users, category: 'Personnel' },
    { label: 'Financial & Operational Reports (PDF/Excel)', href: '/reports', icon: FileText, category: 'Analytics' },
    { label: 'ARIA Autonomous Intelligence HQ', href: '/aria', icon: Cpu, category: 'AI Intelligence' },
  ];

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandMenuOpen(!commandMenuOpen);
      }
      if (!commandMenuOpen) return;

      if (e.key === 'Escape') {
        setCommandMenuOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          setCommandMenuOpen(false);
          router.push(filtered[selectedIndex].href);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandMenuOpen, setCommandMenuOpen, filtered, selectedIndex, router]);

  if (!commandMenuOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette navigation"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-md pt-20 p-4 animate-fade-in"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xl">
        {/* Search Header */}
        <div className="flex items-center border-b border-slate-100 dark:border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search destination or command"
            placeholder="Type a command or search destination (e.g. Products, Scan, Orders, ARIA)..."
            className="w-full bg-transparent text-sm font-sans font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="button"
            aria-label="Close command menu"
            onClick={() => setCommandMenuOpen(false)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40" role="listbox">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs font-medium text-slate-400">
              No matching commands or destinations found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-label={`Navigate to ${item.label}`}
                  onClick={() => {
                    setCommandMenuOpen(false);
                    router.push(item.href);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-xs font-sans font-medium transition group focus:outline-none ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold dark:bg-blue-600'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                    <span className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{item.label}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Command Menu Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-[10px] font-mono text-slate-500">
          <span>Navigate with <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">↑↓</kbd></span>
          <span>Select with <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Enter</kbd></span>
          <span>Close with <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">ESC</kbd></span>
        </div>
      </div>
    </div>
  );
};
