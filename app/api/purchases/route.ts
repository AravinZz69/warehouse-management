import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PURCHASE_ORDERS, INITIAL_SUPPLIERS, INITIAL_PRODUCTS } from '@/lib/supabase/mock-db';

export async function GET() {
  return NextResponse.json({ success: true, data: INITIAL_PURCHASE_ORDERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supplier = INITIAL_SUPPLIERS.find((s) => s.id === body.supplier_id);

    const items = (body.items || []).map((it: any) => {
      const prod = INITIAL_PRODUCTS.find((p) => p.id === it.product_id || p.sku === it.sku);
      const unitCost = Number(it.unit_cost || prod?.purchase_price || 10);
      const qty = Number(it.quantity || it.quantity_ordered || 10);
      return {
        id: `poi-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        purchase_order_id: '',
        product_id: prod?.id || 'prod-001',
        quantity_ordered: qty,
        quantity_received: 0,
        unit_cost: unitCost,
        total_cost: qty * unitCost,
        sku: prod?.sku || it.sku,
        product_name: prod?.name || 'Item',
      };
    });

    const totalAmount = items.reduce((acc: number, cur: any) => acc + cur.total_cost, 0);

    const newPO = {
      id: `po-${Date.now()}`,
      po_number: `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      supplier_id: body.supplier_id || 'supp-101',
      supplier_name: supplier?.company_name || 'TechMart Microelectronics India',
      warehouse_id: body.warehouse_id || 'wh-001',
      warehouse_name: 'Central Megahub Alpha',
      status: 'ordered' as const,
      total_amount: totalAmount,
      expected_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      notes: body.notes || 'Auto-drafted PO via ARIA Autonomous Engine',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items,
    };

    INITIAL_PURCHASE_ORDERS.unshift(newPO as any);
    return NextResponse.json({ success: true, data: newPO });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create PO' }, { status: 400 });
  }
}
