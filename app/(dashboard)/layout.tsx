'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { CommandMenu } from '@/components/layout/CommandMenu';
import { useUIStore } from '@/stores/ui.store';
import { cn } from '@/lib/utils/cn';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Floating White Sidebar */}
      <Sidebar />

      {/* Floating Topbar Header */}
      <Topbar />

      {/* Cmd + K Command Palette */}
      <CommandMenu />

      {/* Main Content Area */}
      <main
        className={cn(
          'pt-24 px-6 sm:px-8 pb-16 transition-all duration-300 min-h-screen',
          sidebarOpen ? 'ml-72' : 'ml-28'
        )}
      >
        <div className="max-w-[1600px] mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}
