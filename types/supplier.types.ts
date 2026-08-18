export interface SupplierAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

export interface Supplier {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: SupplierAddress;
  payment_terms: string;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
