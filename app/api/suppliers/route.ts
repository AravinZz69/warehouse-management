import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_SUPPLIERS } from '@/lib/supabase/mock-db';

export async function GET() {
  return NextResponse.json({ success: true, data: INITIAL_SUPPLIERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newSupplier = {
      id: `supp-${Date.now()}`,
      company_name: body.company_name,
      contact_person: body.contact_person,
      email: body.email,
      phone: body.phone,
      address: body.address || {},
      payment_terms: body.payment_terms || 'Net 30',
      rating: 5.0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    INITIAL_SUPPLIERS.unshift(newSupplier as any);
    return NextResponse.json({ success: true, data: newSupplier });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add supplier' }, { status: 400 });
  }
}
