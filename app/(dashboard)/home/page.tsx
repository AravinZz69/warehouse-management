'use client';

import React from 'react';
import Link from 'next/link';
import { useUIStore } from '@/stores/ui.store';
import {
  Cpu,
  Package,
  Boxes,
  Truck,
  ShieldCheck,
  Barcode,
  FileText,
  Palette,
  ArrowRight,
  Zap,
  CheckCircle2,
  Activity,
  Award,
} from 'lucide-react';

export default function ProjectHomePage() {
  const { themeMode, toggleThemeMode } = useUIStore();

  return (
    <div className="space-y-10 font-sans max-w-6xl mx-auto py-4">
      {/* 1. Hero Banner with Imprint Genius Palette Highlights */}
      <div className="relative overflow-hidden rounded-3xl border border-[#4A8BDF]/40 bg-gradient-to-br from-[#EFFAFD] via-white to-[#F0F9FF] dark:from-[#0D131F] dark:via-[#131B2B] dark:to-[#080C14] p-8 md:p-12 shadow-2xl transition-colors">
        {/* Decorative Color Orbs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#A0006D]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-[#4A8BDF]/20 blur-3xl" />

        <div className="relative z-10 space-y-6">
          {/* Palette Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-[#4A8BDF]/30 text-xs font-mono text-[#0F172A] dark:text-slate-200 shadow-sm backdrop-blur-md">
            <Palette className="h-4 w-4 text-[#A0006D]" />
            <span className="font-semibold">Palette Scheme:</span>
            <span className="text-[#4A8BDF] font-bold">Royal Blue (#4A8BDF)</span> •{' '}
            <span className="text-[#A0006D] font-bold">Eggplant (#A0006D)</span> •{' '}
            <span className="text-[#0EA5E9] font-bold">Pale Blue (#EFFAFD)</span>
          </div>

          {/* Title & Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] dark:text-white leading-tight">
              ARIA WMS & IMS — Autonomous Enterprise Logistics & Inventory System
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Industrial-grade Warehouse Management & Inventory Control System designed for high-volume fulfillment centers.
              Driven by a closed-loop AI engine that continuously detects stockouts, evaluates financial trade-offs, and executes atomic mutations.
            </p>
          </div>

          {/* Quick Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#4A8BDF] hover:bg-[#3b79c9] px-6 py-3 text-xs font-mono font-bold text-white transition shadow-xl hover:scale-105 transform"
            >
              <span>ENTER COMMAND CENTRE DASHBOARD</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/aria"
              className="inline-flex items-center gap-2 rounded-xl bg-[#A0006D] hover:bg-[#85005a] px-6 py-3 text-xs font-mono font-bold text-white transition shadow-xl hover:scale-105 transform"
            >
              <Cpu className="h-4 w-4" />
              <span>ARIA INTELLIGENCE HQ</span>
            </Link>

            <button
              type="button"
              onClick={toggleThemeMode}
              className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-5 py-3 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 transition shadow-md hover:border-[#4A8BDF]"
            >
              <Palette className="h-4 w-4 text-[#A0006D]" />
              <span>Toggle Theme ({themeMode === 'imprint' ? 'Pale Blue Palette' : 'Dark Industrial'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Project Agenda & Core Architecture Objectives */}
      <div className="space-y-6">
        <div className="border-b border-slate-300 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-mono font-extrabold uppercase text-[#0F172A] dark:text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-[#4A8BDF]" /> MASTER PROJECT AGENDA & ARCHITECTURE
          </h2>
          <p className="text-xs font-mono text-slate-500">
            Enterprise WMS Protocol v5.0 — 4-Stage Autonomous Engine & Zero Mock Data Architecture
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: 4-Stage AI Engine */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F] space-y-3 shadow-lg hover:border-[#4A8BDF] transition">
            <div className="h-10 w-10 rounded-xl bg-[#4A8BDF]/10 text-[#4A8BDF] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-mono text-sm font-bold text-[#0F172A] dark:text-white">4-Stage AI Cycle</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Detects stockouts & SLA risks $\rightarrow$ Decides root cause $\rightarrow$ Triggers auto API calls (Conf $\ge 85\%$) $\rightarrow$ Summarizes shift debriefs.
            </p>
          </div>

          {/* Card 2: Inbound & Outbound Flows */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F] space-y-3 shadow-lg hover:border-[#A0006D] transition">
            <div className="h-10 w-10 rounded-xl bg-[#A0006D]/10 text-[#A0006D] flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-mono text-sm font-bold text-[#0F172A] dark:text-white">Full Core Business Flows</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Inbound Procurement (PO $\rightarrow$ GRN $\rightarrow$ Bins) and Outbound Fulfillment (Priority Scoring $\rightarrow$ FEFO Allocation $\rightarrow$ Wave Pick $\rightarrow$ QA $\rightarrow$ Dispatch).
            </p>
          </div>

          {/* Card 3: Camera Barcode HUD */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F] space-y-3 shadow-lg hover:border-[#4A8BDF] transition">
            <div className="h-10 w-10 rounded-xl bg-[#4A8BDF]/10 text-[#4A8BDF] flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-mono text-sm font-bold text-[#0F172A] dark:text-white">Hardware Barcode HUD</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Full-screen mobile camera reticle HUD, Web Audio API sound feedback, single/continuous modes, Code128 / QR SVG badge generator.
            </p>
          </div>

          {/* Card 4: Reports & Audited Data */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D131F] space-y-3 shadow-lg hover:border-[#A0006D] transition">
            <div className="h-10 w-10 rounded-xl bg-[#A0006D]/10 text-[#A0006D] flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-mono text-sm font-bold text-[#0F172A] dark:text-white">PDF & Excel Reporting</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Instant generation of PDF Sales Invoices, Purchase Orders, Valuation Reports, and formatted Excel `.xlsx` spreadsheet exports.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Imprint Genius Aesthetic Palette Summary */}
      <div className="p-8 rounded-2xl border border-[#A0006D]/30 bg-gradient-to-r from-[#A0006D]/10 via-white dark:via-[#0D131F] to-[#4A8BDF]/10 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <Award className="h-6 w-6 text-[#A0006D]" />
          <h3 className="font-mono text-base font-bold text-[#0F172A] dark:text-white uppercase">
            IMPRINT GENIUS AESTHETIC PALETTE
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Inspired by high-converting modern design systems, ARIA employs a balanced color hierarchy: <strong>Pale Blue (#EFFAFD)</strong> for clean spacious surfaces, <strong>Royal Blue (#4A8BDF)</strong> for high-visibility structural actions, and <strong>Eggplant (#A0006D)</strong> for AI intelligence highlights and priority badges.
        </p>
      </div>
    </div>
  );
}
