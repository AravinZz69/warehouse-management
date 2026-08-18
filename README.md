# 🚀 ARIA WMS & IMS — Autonomous Enterprise Logistics & Inventory Management System
> **Master Production Specification & Technical Implementation Guide v5.0**  
> *Built for High-Scale Enterprise Warehouses with a 4-Stage Closed-Loop AI Engine, FEFO Allocation, Barcode HUD, & Realtime Telemetry.*

---

## 🎯 Executive Summary & Hackathon Pitch

**ARIA WMS & IMS** is an industrial-grade, AI-autonomous Warehouse Management System (WMS) and Inventory Management System (IMS). Modern global supply chains suffer from delayed SLA visibility, inventory shrinkage, inefficient picker routing, and manual triage bottlenecks. 

ARIA solves these challenges by combining a **Next.js 16 App Router** frontend, a **Supabase (PostgreSQL + Realtime)** database architecture, and an autonomous **Gemini 1.5 Flash AI Engine** that continuously executes a 4-stage operational optimization loop.

```
       ┌────────────────────────────────────────────────────────┐
       │   STAGE 1: DETECT (Stockouts, SLA Risks, PO Delays)    │
       └───────────────────────────┬────────────────────────────┘
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │   STAGE 2: DECIDE (Simulate FEFO, Cost Trade-offs)    │
       └───────────────────────────┬────────────────────────────┘
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │   STAGE 3: TRIGGER / RECOMMEND (Conf ≥ 85% Auto API)   │
       └───────────────────────────┬────────────────────────────┘
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │   STAGE 4: SUMMARIZE (1-Click Shift Handover Briefs)   │
       └───────────────────────────┬────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router + Turbopack)** | Server/Client rendering, API routes, Turbopack builds |
| **Database** | **Supabase / PostgreSQL 15+** | Relational data, RLS security, check constraints, stored procedures |
| **AI Intelligence** | **Gemini 1.5 Flash** | Closed-loop triage, root cause analysis, shift briefs |
| **State Management** | **Zustand 4** | Realtime scanner state, UI theme mode, alert queue, ARIA state |
| **Styling & UI** | **Tailwind CSS + Lucide Icons** | Responsive layout, dark/light theme tokens, micro-animations |
| **Hardware Integration** | **WebRTC + Web Audio API** | Camera reticle HUD scanner, sound telemetry, barcode verification |
| **Document Generation** | **jspdf + xlsx** | Automated PDF invoices, PO receipts, Excel stock valuation exports |

---

## 🏛️ Codebase Architecture & Structure

```
aria-wms/
├── app/                        # Next.js 16 App Router Pages & API Endpoints
│   ├── (dashboard)/            # Dashboard layout group
│   │   ├── page.tsx            # Main Command Centre Dashboard
│   │   ├── home/               # Project Overview & Agenda Page
│   │   ├── aria/               # ARIA AI Intelligence HQ & Chat Terminal
│   │   ├── inventory/          # Inventory Matrix, Adjustments & Barcode Scanner HUD
│   │   ├── lifecycle/          # 9-Stage Fulfillment Pipeline Kanban & Stations
│   │   ├── orders/             # Sales Order Registry & Invoice Generator
│   │   ├── products/           # Product Catalog & SKU Management
│   │   ├── purchases/          # Purchase Order Registry & Intake Generator
│   │   ├── reports/            # PDF/Excel Export Center
│   │   ├── suppliers/          # Supplier Directory & Performance Matrix
│   │   ├── warehouses/         # Warehouse Facilities Topology & Floor Map
│   │   └── workers/            # Floor Personnel Shift Matrix
│   ├── api/                    # REST & JSON API Endpoints (ARIA, Inventory, Orders, POs)
│   ├── globals.css             # Unified CSS variables for Light & Dark mode
│   └── layout.tsx              # Root HTML Layout & FOUC-free Theme Script
├── components/                 # Reusable UI Component Library
│   ├── aria/                   # ARIA AI Cards, Chat Terminal, Gauges & Summaries
│   ├── dashboard/              # Executive Brief, Pulse Gauge, Live Telemetry Feed
│   ├── layout/                 # Floating Sidebar, Topbar Header, Command Menu (⌘K)
│   ├── lifecycle/              # Route Map, Packing View, QA Checklist, Dispatch Card
│   └── shared/                 # DataTable, ConfirmDialog, BarcodeScannerHUD, Badges
├── database/                   # Master PostgreSQL Schema & Migrations
│   └── master_schema.sql       # Unified Master SQL Script (Tables, Triggers, Seed Data)
├── lib/                        # Core Utilities & AI Logic
│   ├── gemini/                 # Gemini API client, prompts, and Zod schemas
│   ├── supabase/               # Supabase client configuration & mock database
│   ├── utils/                  # Currency formatting, date parsers, export helpers
│   └── warehouse/              # FEFO allocation engine & priority SLA scoring math
├── stores/                     # Zustand Realtime State Stores
│   ├── alert.store.ts          # CDC telemetry feed store
│   ├── aria.store.ts           # AI decisions & shift summaries store
│   ├── scanner.store.ts        # Camera HUD & barcode scan history store
│   └── ui.store.ts             # Sidebar state & persistent Light/Dark theme store
└── types/                      # TypeScript Strict Schemas & Type Definitions
```

---

## 🔥 Key System Features

### 1. 🤖 ARIA Autonomous Closed-Loop AI Engine
- **Automated Root Cause Triage**: Diagnoses stockout causes, supplier delays, and SLA bottlenecks.
- **Confidence-Gated Execution**:
  - **$\ge 85\%$ Confidence**: Auto-triggers internal API mutations (e.g. PO drafting, stock reallocation).
  - **$< 85\%$ Confidence**: Renders a 1-click triage action card for supervisor review.
- **1-Click Shift Handover Briefs**: Generates operational summaries for incoming shift managers.

### 2. 📷 Full-Screen Hardware Barcode Audit HUD
- **Camera Viewfinder**: Real-time WebRTC camera feed with laser reticle overlay.
- **Web Audio Telemetry**: Instant audio scan beeps via Web Audio API.
- **Multi-Mode Scanning**: Supports Single Scan and Continuous Audit modes.

### 3. 📦 9-Stage Fulfillment Pipeline Kanban
Tracks orders across 9 granular operational stages:
1. **Intake** $\rightarrow$ 2. **Priority Scoring** $\rightarrow$ 3. **Stock Check** $\rightarrow$ 4. **Allocated** $\rightarrow$ 5. **Wave Picking** $\rightarrow$ 6. **Packing** $\rightarrow$ 7. **QA Check** $\rightarrow$ 8. **Dispatched** $\rightarrow$ 9. **Delivered**.

### 4. 🧮 Pure SLA Urgency Math & FEFO Allocation Engine
- Calculates SLA deadline urgency scores using customer tier multipliers ($1.5\times$ Enterprise, $1.2\times$ VIP).
- Allocates stock strictly by **First-Expired, First-Out (FEFO)** batch sequence.
- Hardened database integrity via PostgreSQL check constraints (`CHECK (quantity_available >= 0)`).

### 5. 📄 Financial & Operational Reports (PDF & Excel)
- Instant PDF generation for Sales Invoices, Purchase Orders, and Carrier Manifests.
- CSV/Excel downloads for inventory stock valuations and supplier performance metrics.

### 6. 🎨 Responsive Light & Dark Theme Engine
- **Light Theme**: Pure white canvas (`#FFFFFF` surfaces, `#F8FAFC` canvas, dark slate text).
- **Dark Theme**: Deep dark slate surfaces (`#0D1117` / `#111827`, white text).
- **Floating Navigation**: Responsive floating sidebar with single-line label formatting (`truncate whitespace-nowrap`).

---

## 🗄️ Database Setup (Single Master Script)

The entire database setup is encapsulated in a single, idempotent SQL script:

```bash
database/master_schema.sql
```

### Database Execution Steps:
1. Open your Supabase Dashboard or PostgreSQL instance.
2. Navigate to the **SQL Editor**.
3. Open `database/master_schema.sql` and execute the script.
4. The script automatically creates:
   - 10 PostgreSQL Tables (`warehouses`, `suppliers`, `products`, `inventory_batches`, `sales_orders`, `order_items`, `purchase_orders`, `purchase_order_items`, `aria_decisions`, `shift_summaries`).
   - Foreign keys, indexes, and negative stock check constraints (`CHECK (quantity_available >= 0)`).
   - Stored Procedure `fn_receive_purchase_order` for automated stock intake.
   - Database Trigger `trg_deduct_on_dispatch` for automatic stock deduction upon dispatch.
   - Comprehensive seed dataset with sample products, warehouses, orders, and suppliers.

---

## ⚡ Quick Start & Local Development

### 1. Requirements
- Node.js 18.x or 20.x
- npm or yarn

### 2. Installation
```bash
# Install project dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Development Server
```bash
# Start Next.js Turbopack dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build Verification
```bash
# Compile TypeScript & Next.js production bundle
npm run build
```

---

## 📊 Hackathon Evaluation Highlights

| Criteria | Implementation Highlights |
| :--- | :--- |
| **Technical Excellence** | Next.js 16 App Router, Turbopack, Zod schema validation, Supabase triggers & stored procedures |
| **AI Innovation** | Gemini 1.5 Flash 4-stage closed loop, auto-triggered mutations, operational shift briefing |
| **UI & UX Quality** | Responsive Light/Dark theme, floating sidebar navigation, ⌘K command menu, barcode HUD |
| **Business Impact** | Real-world supply chain SLA optimization, FEFO waste reduction, instantaneous PDF/Excel audit reports |

---

*ARIA WMS & IMS — Autonomous Enterprise Logistics System v5.0*
