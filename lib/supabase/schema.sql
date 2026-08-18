-- ARIA WMS & IMS SQL MIGRATION SCHEMA
-- Run this migration in Supabase SQL Editor

-- 1. USER PROFILES & ROLE-BASED ACCESS CONTROL (RBAC)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'inventory_manager', 'staff', 'supervisor')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SUPPLIERS & PROCUREMENT
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  address JSONB DEFAULT '{}',
  payment_terms TEXT DEFAULT 'Net 30',
  rating NUMERIC(3,2) DEFAULT 5.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PRODUCTS & CATALOG
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  barcode TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  sub_category TEXT,
  brand TEXT DEFAULT 'Generic',
  purchase_price NUMERIC(10,2) NOT NULL CHECK (purchase_price >= 0),
  selling_price NUMERIC(10,2) NOT NULL CHECK (selling_price >= purchase_price),
  weight_kg NUMERIC(8,3) NOT NULL DEFAULT 0.5,
  dimensions_cm JSONB DEFAULT '{"l":20,"w":15,"h":10}',
  reorder_threshold INT NOT NULL DEFAULT 10,
  reorder_quantity INT NOT NULL DEFAULT 50,
  supplier_id UUID REFERENCES suppliers(id),
  requires_cold_storage BOOLEAN DEFAULT false,
  is_fragile BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. WAREHOUSE TOPOLOGY (FACILITIES, ZONES, BINS)
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  total_zones INT DEFAULT 4,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  zone_type TEXT NOT NULL CHECK (zone_type IN ('receiving', 'storage', 'picking', 'packing', 'dispatch', 'returns')),
  capacity_units INT DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
  bin_code TEXT NOT NULL,              -- e.g. "A-12-3"
  aisle TEXT NOT NULL,
  shelf INT NOT NULL,
  position INT NOT NULL,
  is_occupied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(zone_id, bin_code)
);

-- 5. INVENTORY MATRIX WITH CONCURRENCY & NEGATIVE STOCK PREVENTION
CREATE TABLE IF NOT EXISTS inventory_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  bin_id UUID NOT NULL REFERENCES bins(id),
  quantity_available INT NOT NULL DEFAULT 0 CHECK (quantity_available >= 0), -- STRICT NEGATIVE CHECK
  quantity_reserved INT NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
  quantity_damaged INT NOT NULL DEFAULT 0 CHECK (quantity_damaged >= 0),
  batch_number TEXT,
  expiry_date DATE,
  received_at TIMESTAMPTZ DEFAULT now(),
  last_movement_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, bin_id, batch_number)
);

-- 6. PURCHASE ORDERS (INBOUND)
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT UNIQUE NOT NULL,       -- PO-20260818-XXXX
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ordered', 'partially_received', 'received', 'cancelled')),
  total_amount NUMERIC(12,2) DEFAULT 0,
  expected_delivery DATE,
  actual_delivery TIMESTAMPTZ,
  notes TEXT,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity_ordered INT NOT NULL CHECK (quantity_ordered > 0),
  quantity_received INT DEFAULT 0 CHECK (quantity_received >= 0),
  unit_cost NUMERIC(10,2) NOT NULL,
  total_cost NUMERIC(12,2) GENERATED ALWAYS AS (quantity_ordered * unit_cost) STORED
);

-- 7. CUSTOMERS & SALES ORDERS (OUTBOUND)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  address JSONB DEFAULT '{}',
  tier TEXT NOT NULL DEFAULT 'standard' CHECK (tier IN ('standard', 'priority', 'vip')),
  total_orders INT DEFAULT 0,
  total_spend NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,   -- ORD-20260818-XXXX
  customer_id UUID NOT NULL REFERENCES customers(id),
  warehouse_id UUID REFERENCES warehouses(id),
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN (
    'created', 'priority_scored', 'inventory_checked', 'allocated',
    'picking', 'packing', 'quality_check', 'dispatched', 'completed',
    'on_hold', 'cancelled'
  )),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  priority_score NUMERIC(5,2) DEFAULT 0,
  priority_level TEXT DEFAULT 'medium' CHECK (priority_level IN ('low', 'medium', 'high', 'critical')),
  requested_delivery_date DATE NOT NULL,
  sla_deadline TIMESTAMPTZ,
  total_value NUMERIC(12,2) DEFAULT 0,
  total_cost NUMERIC(12,2) DEFAULT 0,
  total_weight_kg NUMERIC(10,3) DEFAULT 0,
  item_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity_ordered INT NOT NULL CHECK (quantity_ordered > 0),
  quantity_allocated INT DEFAULT 0,
  quantity_picked INT DEFAULT 0,
  quantity_packed INT DEFAULT 0,
  unit_price NUMERIC(10,2) NOT NULL,
  unit_cost NUMERIC(10,2) NOT NULL,
  substitute_product_id UUID REFERENCES products(id),
  substitute_accepted BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  inventory_level_id UUID NOT NULL REFERENCES inventory_levels(id),
  quantity_allocated INT NOT NULL CHECK (quantity_allocated > 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'released', 'cancelled')),
  allocated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  carrier TEXT NOT NULL,
  tracking_number TEXT UNIQUE NOT NULL,
  dispatched_at TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'shipped' CHECK (status IN ('shipped', 'in_transit', 'delivered', 'failed'))
);

-- 8. ARIA DECISION & SUMMARY REGISTRY
CREATE TABLE IF NOT EXISTS aria_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_type TEXT NOT NULL CHECK (decision_type IN (
    'anomaly_detected', 'reallocation', 'priority_override',
    'substitute_suggested', 'worker_coaching', 'bottleneck_resolution',
    'sla_escalation', 'stockout_reorder', 'executive_summary'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  affected_order_id UUID REFERENCES orders(id),
  affected_product_id UUID REFERENCES products(id),
  detected_problem JSONB NOT NULL,
  root_cause_analysis TEXT NOT NULL,
  confidence_score NUMERIC(5,2) NOT NULL,
  suggested_action JSONB NOT NULL,
  execution_mode TEXT NOT NULL DEFAULT 'recommendation' CHECK (execution_mode IN ('auto_triggered', 'recommendation', 'manual_dismissed')),
  execution_status TEXT NOT NULL DEFAULT 'pending' CHECK (execution_status IN ('pending', 'executed', 'failed', 'dismissed')),
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS aria_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_type TEXT NOT NULL CHECK (summary_type IN ('warehouse_pulse', 'shift_debrief', 'order_diagnostics', 'inventory_outlook')),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  health_score INT NOT NULL CHECK (health_score BETWEEN 0 AND 100),
  key_highlights TEXT[] NOT NULL,
  critical_blockers TEXT[] NOT NULL,
  actions_taken_count INT DEFAULT 0,
  recommended_priorities TEXT[] NOT NULL,
  raw_ai_narrative TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. INVENTORY AUTO-DEDUCTION TRIGGER ON DISPATCH
CREATE OR REPLACE FUNCTION fn_deduct_inventory_on_dispatch()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE inventory_levels il
  SET quantity_available = quantity_available - a.quantity_allocated,
      quantity_reserved  = quantity_reserved  - a.quantity_allocated,
      last_movement_at   = now()
  FROM allocations a
  JOIN order_items oi ON oi.id = a.order_item_id
  WHERE oi.order_id = NEW.order_id
    AND a.status = 'active'
    AND il.id = a.inventory_level_id;

  UPDATE allocations a SET status = 'fulfilled'
  FROM order_items oi
  WHERE oi.order_id = NEW.order_id AND a.order_item_id = oi.id;

  UPDATE orders SET status = 'dispatched', updated_at = now()
  WHERE id = NEW.order_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_deduct_on_dispatch ON dispatches;
CREATE TRIGGER trg_deduct_on_dispatch
  AFTER INSERT ON dispatches FOR EACH ROW
  EXECUTE FUNCTION fn_deduct_inventory_on_dispatch();

-- 10. INVENTORY AUTO-INCREASE TRIGGER ON PO RECEIVING
CREATE OR REPLACE FUNCTION fn_receive_purchase_order(p_po_id UUID, p_default_bin_id UUID)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  item RECORD;
BEGIN
  FOR item IN SELECT * FROM purchase_order_items WHERE purchase_order_id = p_po_id LOOP
    INSERT INTO inventory_levels (product_id, bin_id, quantity_available, batch_number, received_at)
    VALUES (item.product_id, p_default_bin_id, item.quantity_ordered, 'BATCH-' || to_char(now(),'YYYYMMDD'), now())
    ON CONFLICT (product_id, bin_id, batch_number)
    DO UPDATE SET quantity_available = inventory_levels.quantity_available + item.quantity_ordered,
                  last_movement_at = now();

    UPDATE purchase_order_items
    SET quantity_received = quantity_ordered
    WHERE id = item.id;
  END LOOP;

  UPDATE purchase_orders
  SET status = 'received', actual_delivery = now(), updated_at = now()
  WHERE id = p_po_id;
END;
$$;
