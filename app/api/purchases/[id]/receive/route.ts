import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PURCHASE_ORDERS, INITIAL_INVENTORY } from '@/lib/supabase/mock-db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const po = INITIAL_PURCHASE_ORDERS.find((p) => p.id === id);

  if (!po) {
    return NextResponse.json({ error: 'Purchase Order not found' }, { status: 404 });
  }

  // Atomic Goods Receiving GRN side effect:
  // Increment available stock for each PO item in receiving bin 'bin-A123'
  if (po.items && po.items.length > 0) {
    for (const item of po.items) {
      const inv = INITIAL_INVENTORY.find((i) => i.product_id === item.product_id);
      if (inv) {
        inv.quantity_available += item.quantity_ordered;
        inv.last_movement_at = new Date().toISOString();
      } else {
        INITIAL_INVENTORY.push({
          id: `inv-${Date.now()}`,
          product_id: item.product_id,
          bin_id: 'bin-A123',
          quantity_available: item.quantity_ordered,
          quantity_reserved: 0,
          quantity_damaged: 0,
          batch_number: `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
          expiry_date: '2028-12-31',
          received_at: new Date().toISOString(),
          last_movement_at: new Date().toISOString(),
          sku: item.sku,
          product_name: item.product_name,
          bin_code: 'A-12-3',
        });
      }
      item.quantity_received = item.quantity_ordered;
    }
  }

  po.status = 'received';
  po.actual_delivery = new Date().toISOString();
  po.updated_at = new Date().toISOString();

  return NextResponse.json({
    success: true,
    message: 'Goods received successfully. Stock matrix updated automatically.',
    data: po,
  });
}
