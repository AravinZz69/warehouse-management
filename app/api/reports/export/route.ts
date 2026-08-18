import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PURCHASE_ORDERS } from '@/lib/supabase/mock-db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'valuation';
  const format = searchParams.get('format') || 'excel';

  return NextResponse.json({
    success: true,
    type,
    format,
    message: `Export prepared for ${type} in ${format} format`,
    counts: {
      products: INITIAL_PRODUCTS.length,
      orders: INITIAL_ORDERS.length,
      purchase_orders: INITIAL_PURCHASE_ORDERS.length,
    },
  });
}
