import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_PRODUCTS } from '@/lib/supabase/mock-db';
import { calculateOrderPriority } from '@/lib/warehouse/priority-engine';

export async function GET() {
  return NextResponse.json({ success: true, data: INITIAL_ORDERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const customer = INITIAL_CUSTOMERS.find((c) => c.id === body.customer_id) || INITIAL_CUSTOMERS[0];

    const items = (body.items || []).map((it: any) => {
      const prod = INITIAL_PRODUCTS.find((p) => p.id === it.product_id || p.sku === it.sku);
      const qty = Number(it.quantity || it.quantity_ordered || 1);
      const price = Number(it.unit_price || prod?.selling_price || 100);
      const cost = Number(it.unit_cost || prod?.purchase_price || 60);

      return {
        id: `oi-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        order_id: '',
        product_id: prod?.id || 'prod-001',
        quantity_ordered: qty,
        quantity_allocated: 0,
        quantity_picked: 0,
        quantity_packed: 0,
        unit_price: price,
        unit_cost: cost,
        sku: prod?.sku || it.sku,
        barcode: prod?.barcode,
        product_name: prod?.name || 'Item',
        bin_code: 'A-12-3',
      };
    });

    const totalValue = items.reduce((acc: number, cur: any) => acc + cur.quantity_ordered * cur.unit_price, 0);
    const totalCost = items.reduce((acc: number, cur: any) => acc + cur.quantity_ordered * cur.unit_cost, 0);

    const deliveryDate = body.requested_delivery_date || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    // Compute Pure Priority Score
    const priorityResult = calculateOrderPriority({
      requested_delivery_date: deliveryDate,
      total_value: totalValue,
      item_count: items.length,
      created_at: new Date().toISOString(),
      customer_tier: customer.tier,
    });

    const newOrder = {
      id: `ord-${Date.now()}`,
      order_number: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_tier: customer.tier,
      warehouse_id: 'wh-001',
      status: 'created' as const,
      payment_status: 'paid' as const,
      priority_score: priorityResult.score,
      priority_level: priorityResult.level,
      requested_delivery_date: deliveryDate,
      sla_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      total_value: totalValue,
      total_cost: totalCost,
      total_weight_kg: items.length * 1.5,
      item_count: items.reduce((acc: number, c: any) => acc + c.quantity_ordered, 0),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items,
    };

    INITIAL_ORDERS.unshift(newOrder as any);

    return NextResponse.json({ success: true, data: newOrder });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create sales order' }, { status: 400 });
  }
}
