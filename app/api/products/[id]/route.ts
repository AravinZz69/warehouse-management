import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PRODUCTS } from '@/lib/supabase/mock-db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.id === id || p.sku === id);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: product });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const idx = INITIAL_PRODUCTS.findIndex((p) => p.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  INITIAL_PRODUCTS[idx] = {
    ...INITIAL_PRODUCTS[idx],
    ...body,
    updated_at: new Date().toISOString(),
  };

  return NextResponse.json({ success: true, data: INITIAL_PRODUCTS[idx] });
}
