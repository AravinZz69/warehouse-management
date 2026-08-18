import { OrderStatus, CustomerTier } from '@/types/order.types';

export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  created: ['priority_scored', 'on_hold', 'cancelled'],
  priority_scored: ['inventory_checked', 'on_hold', 'cancelled'],
  inventory_checked: ['allocated', 'on_hold', 'cancelled'],
  allocated: ['picking', 'on_hold', 'cancelled'],
  picking: ['packing', 'on_hold', 'cancelled'],
  packing: ['quality_check', 'on_hold', 'cancelled'],
  quality_check: ['dispatched', 'on_hold', 'cancelled'],
  dispatched: ['completed', 'cancelled'],
  completed: [],
  on_hold: ['created', 'priority_scored', 'inventory_checked', 'allocated', 'picking', 'packing', 'quality_check', 'cancelled'],
  cancelled: [],
};

export const STAGE_LABELS: Record<OrderStatus, string> = {
  created: 'Order Intake',
  priority_scored: 'Priority Scored',
  inventory_checked: 'Stock Verified',
  allocated: 'Stock Locked (FEFO)',
  picking: 'Wave Picking',
  packing: 'Packing Station',
  quality_check: 'QC Inspection',
  dispatched: 'Carrier Dispatched',
  completed: 'Delivered',
  on_hold: 'On Hold',
  cancelled: 'Cancelled',
};

export const CUSTOMER_TIER_MULTIPLIERS: Record<CustomerTier, number> = {
  enterprise: 1.5,
  vip: 1.2,
  priority: 1.2,
  standard: 1.0,
};

export const CONFIDENCE_AUTO_EXECUTE_THRESHOLD = 85.0;
