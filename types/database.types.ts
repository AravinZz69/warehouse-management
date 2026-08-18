export type UserRole = 'admin' | 'inventory_manager' | 'staff' | 'supervisor';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ZoneType = 'receiving' | 'storage' | 'picking' | 'packing' | 'dispatch' | 'returns';

export interface Warehouse {
  id: string;
  name: string;
  city: string;
  address?: string;
  total_zones: number;
  is_active: boolean;
  created_at: string;
}

export interface Zone {
  id: string;
  warehouse_id: string;
  name: string;
  zone_type: ZoneType;
  capacity_units: number;
  created_at: string;
}

export interface Bin {
  id: string;
  zone_id: string;
  bin_code: string;
  aisle: string;
  shelf: number;
  position: number;
  is_occupied: boolean;
  created_at: string;
  zone?: Zone;
}

export interface Worker {
  id: string;
  full_name: string;
  role: string;
  shift: 'Morning' | 'Evening' | 'Night';
  assigned_zone: string;
  pick_speed_items_per_hr: number;
  accuracy_rate: number;
  status: 'active' | 'on_break' | 'off_shift';
  tasks_completed_today: number;
  avatar_url?: string;
}
