import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_ORDERS, INITIAL_INVENTORY } from '@/lib/supabase/mock-db';
import { validateStageTransition } from '@/lib/warehouse/lifecycle-machine';
import { allocateInventoryFEFO } from '@/lib/warehouse/allocation-engine';
import { OrderStatus } from '@/types/order.types';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const targetStage: OrderStatus = body.target_stage;

  const order = INITIAL_ORDERS.find((o) => o.id === id || o.order_number === id);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  try {
    validateStageTransition(order.status, targetStage);

    // Side effects based on target stage:
    if (targetStage === 'allocated') {
      // Run FEFO stock allocator and lock reserved stock
      const allocRequests = (order.items || []).map((it) => ({
        order_item_id: it.id,
        product_id: it.product_id,
        quantity_required: it.quantity_ordered,
      }));

      const allocPlan = allocateInventoryFEFO(allocRequests, INITIAL_INVENTORY);
      if (allocPlan.success) {
        for (const it of order.items || []) {
          it.quantity_allocated = it.quantity_ordered;
        }
      }
    } else if (targetStage === 'dispatched') {
      // Trigger inventory deduction side effect
      for (const it of order.items || []) {
        const inv = INITIAL_INVENTORY.find((i) => i.product_id === it.product_id);
        if (inv) {
          inv.quantity_available = Math.max(0, inv.quantity_available - it.quantity_ordered);
          inv.quantity_reserved = Math.max(0, inv.quantity_reserved - it.quantity_ordered);
          inv.last_movement_at = new Date().toISOString();
        }
      }
    }

    order.status = targetStage;
    order.updated_at = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `Order ${order.order_number} advanced to ${targetStage}`,
      data: order,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid state transition' },
      { status: 400 }
    );
  }
}
