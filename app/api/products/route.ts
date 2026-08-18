import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PRODUCTS } from '@/lib/supabase/mock-db';

export async function GET() {
  return NextResponse.json({ success: true, data: INITIAL_PRODUCTS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProduct = {
      id: `prod-${Date.now()}`,
      sku: body.sku || `SKU-GEN-${Date.now()}`,
      barcode: body.barcode || `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      name: body.name || 'New Product',
      category: body.category || 'General',
      brand: body.brand || 'Generic',
      purchase_price: Number(body.purchase_price || 10),
      selling_price: Number(body.selling_price || 20),
      weight_kg: Number(body.weight_kg || 0.5),
      dimensions_cm: body.dimensions_cm || { l: 10, w: 10, h: 10 },
      reorder_threshold: Number(body.reorder_threshold || 10),
      reorder_quantity: Number(body.reorder_quantity || 50),
      requires_cold_storage: Boolean(body.requires_cold_storage),
      is_fragile: Boolean(body.is_fragile),
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    INITIAL_PRODUCTS.unshift(newProduct as any);

    return NextResponse.json({ success: true, data: newProduct });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 400 });
  }
}
