export type POStatus = 'draft' | 'ordered' | 'partially_received' | 'received' | 'cancelled';

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: number;
  total_cost: number;
  sku?: string;
  product_name?: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  warehouse_id: string;
  status: POStatus;
  total_amount: number;
  expected_delivery: string;
  actual_delivery?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  supplier_name?: string;
  warehouse_name?: string;
  items?: PurchaseOrderItem[];
}
