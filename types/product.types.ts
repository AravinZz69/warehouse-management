export interface Dimensions {
  l: number;
  w: number;
  h: number;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description?: string;
  category: string;
  sub_category?: string;
  brand: string;
  purchase_price: number;
  selling_price: number;
  weight_kg: number;
  dimensions_cm: Dimensions;
  reorder_threshold: number;
  reorder_quantity: number;
  supplier_id?: string;
  supplier_name?: string;
  requires_cold_storage: boolean;
  is_fragile: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Dynamic computed fields
  total_available?: number;
  total_reserved?: number;
  total_damaged?: number;
  total_valuation?: number;
}
