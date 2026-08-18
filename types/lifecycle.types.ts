import { OrderStatus, SalesOrder } from './order.types';

export interface PickingTask {
  id: string;
  order_id: string;
  order_number: string;
  picker_id?: string;
  picker_name?: string;
  total_items: number;
  items_picked: number;
  bin_route: string[]; // E.g. ['A-01-1', 'A-02-3', 'B-10-2']
  status: 'pending' | 'in_progress' | 'completed';
  started_at?: string;
  completed_at?: string;
}

export interface PackingTask {
  id: string;
  order_id: string;
  order_number: string;
  packer_id?: string;
  packer_name?: string;
  box_type: 'small' | 'medium' | 'large' | 'pallet';
  weight_measured_kg?: number;
  status: 'pending' | 'in_progress' | 'sealed';
  sealed_at?: string;
}

export interface QCCheck {
  id: string;
  order_id: string;
  order_number: string;
  inspector_id?: string;
  inspector_name?: string;
  checklist: {
    sku_match: boolean;
    quantity_exact: boolean;
    no_physical_damage: boolean;
    expiry_valid: boolean;
    cold_chain_verified: boolean;
    barcode_scannable: boolean;
    packaging_intact: boolean;
  };
  passed: boolean;
  defects_logged?: string[];
  inspected_at?: string;
}

export interface BottleneckAlert {
  stage: OrderStatus;
  order_count: number;
  avg_time_minutes: number;
  severity: 'normal' | 'warning' | 'critical';
  recommendation: string;
}
