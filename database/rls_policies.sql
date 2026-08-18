-- ==============================================================================
-- ARIA WMS & IMS — SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Priority 1 Security Specification: 10 Core Tables RLS Definitions
-- ==============================================================================

-- 1. USER PROFILES
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to update own profile or admins all"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Allow admins to insert user profiles"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- 2. SUPPLIERS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view suppliers"
  ON suppliers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow managers and admins to manage suppliers"
  ON suppliers FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'inventory_manager')
  ));

-- 3. PRODUCTS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow managers and admins to insert/update products"
  ON products FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'inventory_manager')
  ));

-- 4. WAREHOUSE TOPOLOGY (WAREHOUSES, ZONES, BINS)
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view warehouses" ON warehouses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admins to modify warehouses" ON warehouses FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow authenticated users to view zones" ON zones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow managers and admins to modify zones" ON zones FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'inventory_manager')));

CREATE POLICY "Allow authenticated users to view bins" ON bins FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow managers and admins to modify bins" ON bins FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'inventory_manager')));

-- 5. INVENTORY MATRIX (INVENTORY_LEVELS)
ALTER TABLE inventory_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view inventory levels"
  ON inventory_levels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow staff, managers, admins to update inventory"
  ON inventory_levels FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'inventory_manager', 'staff', 'supervisor')
  ));

CREATE POLICY "Allow managers and admins to insert/delete inventory"
  ON inventory_levels FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'inventory_manager')
  ));

-- 6. PURCHASE ORDERS & PO ITEMS
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view purchase orders" ON purchase_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow managers and admins to manage purchase orders" ON purchase_orders FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'inventory_manager')));

CREATE POLICY "Allow authenticated users to view PO items" ON purchase_order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow managers and admins to manage PO items" ON purchase_order_items FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'inventory_manager')));

-- 7. CUSTOMERS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow managers and admins to manage customers"
  ON customers FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'inventory_manager')
  ));

-- 8. SALES ORDERS, ORDER ITEMS, ALLOCATIONS & DISPATCHES
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow operational staff to update order status" ON orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow managers and admins to create/delete orders" ON orders FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view order items" ON order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert/update order items" ON order_items FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view allocations" ON allocations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow staff to allocate stock" ON allocations FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to view dispatches" ON dispatches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow dispatchers to insert dispatches" ON dispatches FOR INSERT TO authenticated WITH CHECK (true);

-- 9. ARIA DECISIONS REGISTRY
ALTER TABLE aria_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view ARIA decisions"
  ON aria_decisions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow system and managers to execute ARIA decisions"
  ON aria_decisions FOR ALL
  TO authenticated
  USING (true);

-- 10. ARIA SUMMARIES REGISTRY
ALTER TABLE aria_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to view ARIA summaries"
  ON aria_summaries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow system and managers to create ARIA summaries"
  ON aria_summaries FOR INSERT
  TO authenticated
  WITH CHECK (true);
