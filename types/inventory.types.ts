export interface InventoryLevel {
  id: string;
  product_id: string;
  bin_id: string;
  quantity_available: number;
  quantity_reserved: number;
  quantity_damaged: number;
  batch_number?: string;
  expiry_date?: string;
  received_at: string;
  last_movement_at: string;
  sku?: string;
  product_name?: string;
  bin_code?: string;
  zone_name?: string;
  warehouse_name?: string;
}

export type AllocationStatus = 'active' | 'fulfilled' | 'released' | 'cancelled';

export interface Allocation {
  id: string;
  order_item_id: string;
  inventory_level_id: string;
  quantity_allocated: number;
  status: AllocationStatus;
  allocated_at: string;
}

export interface Dispatch {
  id: string;
  order_id: string;
  carrier: string;
  tracking_number: string;
  dispatched_at: string;
  status: 'shipped' | 'in_transit' | 'delivered' | 'failed';
}
