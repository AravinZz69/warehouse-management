import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PRODUCTS, INITIAL_INVENTORY } from '@/lib/supabase/mock-db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const product = INITIAL_PRODUCTS.find(
    (p) => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase()
  );

  if (!product) {
    return NextResponse.json({ error: `No item matching barcode/SKU '${code}'` }, { status: 404 });
  }

  const inventory = INITIAL_INVENTORY.filter((inv) => inv.product_id === product.id);

  return NextResponse.json({
    success: true,
    data: {
      product,
      inventory,
    },
  });
}
