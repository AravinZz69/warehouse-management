'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUIStore } from '@/stores/ui.store';
import { useAlertStore } from '@/stores/alert.store';
import { useARIAStore } from '@/stores/aria.store';
import { UserRole } from '@/types/database.types';
import {
  Search,
  Barcode,
  Bell,
  Cpu,
  Building2,
  User,
  Sun,
  Moon,
  Mail,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export const Topbar: React.FC = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    setCommandMenuOpen,
    activeRole,
    setActiveRole,
    activeWarehouseId,
    setActiveWarehouseId,
    themeMode,
    setThemeMode,
  } = useUIStore();
  const { alerts } = useAlertStore();
  const { pulseScore } = useARIAStore();
  const [mounted, setMounted] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.read).length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const applyTheme = (mode: string) => {
    if (mode === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('aria_wms_theme', 'dark'); } catch (e) {}
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('aria_wms_theme', 'imprint'); } catch (e) {}
    }
  };

  const handleToggleTheme = () => {
    const nextMode = themeMode === 'dark' ? 'imprint' : 'dark';
    setThemeMode(nextMode);
    applyTheme(nextMode);
  };

  useEffect(() => {
    if (mounted) {
      applyTheme(themeMode);
    }
  }, [themeMode, mounted]);

  const roles: { key: UserRole; label: string }[] = [
    { key: 'admin', label: 'Administrator' },
    { key: 'inventory_manager', label: 'Inventory Mgr' },
    { key: 'staff', label: 'Floor Operator' },
    { key: 'supervisor', label: 'Supervisor' },
  ];

  return (
    <header
      className={cn(
        'fixed top-3 right-3 z-30 h-16 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl transition-all duration-300 flex items-center justify-between px-6 shadow-xs',
        sidebarOpen ? 'left-72' : 'left-28'
      )}
    >
      {/* Left Toolbar Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => setCommandMenuOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 text-xs text-slate-500 transition font-medium"
        >
          <div className="flex items-center gap-3 truncate whitespace-nowrap">
            <Search className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">Search Orders, Products, Bins, ARIA AI...</span>
          </div>
          <kbd className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-[10px] font-mono text-slate-500 border border-slate-200 dark:border-slate-600 shrink-0 ml-2">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Warehouse Dropdown */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
          <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <select
            value={activeWarehouseId}
            onChange={(e) => setActiveWarehouseId(e.target.value)}
            className="bg-transparent text-slate-700 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="wh-001">Chicago Megahub Alpha</option>
            <option value="wh-002">Seattle Hub</option>
          </select>
        </div>

        {/* Barcode Scan HUD */}
        <Link
          href="/inventory/scanner"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 transition"
        >
          <Barcode className="h-4 w-4" />
          <span className="hidden sm:inline">Scan HUD</span>
        </Link>

        {/* Instant Responsive Theme Toggle Button */}
        <button
          type="button"
          onClick={handleToggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition shadow-2xs cursor-pointer"
          title="Click to toggle Light Mode / Dark Mode"
        >
          {themeMode === 'dark' ? (
            <>
              <Sun className="h-4 w-4 text-amber-500" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-blue-600" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>

        {/* Messages Icon */}
        <Link
          href="/aria"
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
          title="ARIA AI HQ"
        >
          <Mail className="h-4 w-4" />
        </Link>

        {/* Notification Bell */}
        <Link
          href="/alerts"
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
        >
          <Bell className="h-4 w-4" />
          {unreadAlerts > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white animate-pulse" />
          )}
        </Link>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="h-9 w-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            AG
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Alex Grant</span>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as UserRole)}
              className="bg-transparent text-[10px] text-blue-600 dark:text-blue-400 font-semibold focus:outline-none cursor-pointer uppercase"
            >
              {roles.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
