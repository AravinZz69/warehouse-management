export type OrderStatus =
  | 'created'
  | 'priority_scored'
  | 'inventory_checked'
  | 'allocated'
  | 'picking'
  | 'packing'
  | 'quality_check'
  | 'dispatched'
  | 'completed'
  | 'on_hold'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export type CustomerTier = 'standard' | 'priority' | 'vip';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity_ordered: number;
  quantity_allocated: number;
  quantity_picked: number;
  quantity_packed: number;
  unit_price: number;
  unit_cost: number;
  substitute_product_id?: string;
  substitute_accepted?: boolean;
  sku?: string;
  barcode?: string;
  product_name?: string;
  bin_code?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address: Record<string, unknown>;
  tier: CustomerTier;
  total_orders: number;
  total_spend: number;
  created_at: string;
}

export interface SalesOrder {
  id: string;
  order_number: string;
  customer_id: string;
  warehouse_id?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  priority_score: number;
  priority_level: PriorityLevel;
  requested_delivery_date: string;
  sla_deadline?: string;
  total_value: number;
  total_cost: number;
  total_weight_kg: number;
  item_count: number;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
  customer_tier?: CustomerTier;
  items?: OrderItem[];
}
