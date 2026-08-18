import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_INVENTORY, INITIAL_PRODUCTS } from '@/lib/supabase/mock-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, adjustment_type, quantity, bin_code, reason } = body;

    let inv = INITIAL_INVENTORY.find((i) => i.product_id === product_id);
    const prod = INITIAL_PRODUCTS.find((p) => p.id === product_id);

    if (!inv) {
      inv = {
        id: `inv-${Date.now()}`,
        product_id,
        bin_id: 'bin-A123',
        quantity_available: 0,
        quantity_reserved: 0,
        quantity_damaged: 0,
        received_at: new Date().toISOString(),
        last_movement_at: new Date().toISOString(),
        sku: prod?.sku,
        product_name: prod?.name,
        bin_code: bin_code || 'A-12-3',
      };
      INITIAL_INVENTORY.push(inv);
    }

    const qtyNum = Math.abs(Number(quantity || 0));

    if (adjustment_type === 'in') {
      inv.quantity_available += qtyNum;
    } else if (adjustment_type === 'out') {
      if (inv.quantity_available < qtyNum) {
        return NextResponse.json({ error: 'Cannot deduct stock below 0 (Negative Stock Check)' }, { status: 400 });
      }
      inv.quantity_available -= qtyNum;
    } else if (adjustment_type === 'quarantine_damage') {
      if (inv.quantity_available < qtyNum) {
        return NextResponse.json({ error: 'Insufficient available stock to quarantine' }, { status: 400 });
      }
      inv.quantity_available -= qtyNum;
      inv.quantity_damaged += qtyNum;
    } else if (adjustment_type === 'physical_correction') {
      inv.quantity_available = qtyNum;
    }

    inv.last_movement_at = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `Stock adjustment executed successfully (${adjustment_type})`,
      data: inv,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to adjust stock' }, { status: 400 });
  }
}
