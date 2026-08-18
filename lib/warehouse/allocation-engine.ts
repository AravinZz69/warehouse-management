import { InventoryLevel } from '@/types/inventory.types';

export interface AllocationRequestItem {
  order_item_id: string;
  product_id: string;
  quantity_required: number;
}

export interface AllocationResultItem {
  order_item_id: string;
  inventory_level_id: string;
  quantity_allocated: number;
  bin_code: string;
  batch_number?: string;
  expiry_date?: string;
}

export interface AllocationExecutionPlan {
  success: boolean;
  allocations: AllocationResultItem[];
  shortfalls: {
    order_item_id: string;
    product_id: string;
    requested: number;
    allocated: number;
    missing: number;
  }[];
}

/**
 * FEFO (First Expired First Out) stock allocation engine.
 * Sorts available inventory batches by expiry date (ascending), then by received_at (FIFO).
 */
export function allocateInventoryFEFO(
  items: AllocationRequestItem[],
  availableStock: InventoryLevel[]
): AllocationExecutionPlan {
  const allocations: AllocationResultItem[] = [];
  const shortfalls: AllocationExecutionPlan['shortfalls'] = [];

  // Deep copy of available stock to simulate allocation without mutating input directly
  const stockPool = availableStock.map((inv) => ({
    ...inv,
    qty_left: Math.max(0, inv.quantity_available - inv.quantity_reserved),
  }));

  for (const item of items) {
    let remainingNeeded = item.quantity_required;
    let totalAllocatedForItem = 0;

    // Filter stock for this product with qty_left > 0
    const matchingStock = stockPool.filter(
      (s) => s.product_id === item.product_id && s.qty_left > 0
    );

    // Sort matching stock by FEFO (expiry_date ascending, nulls last) then FIFO (received_at ascending)
    matchingStock.sort((a, b) => {
      if (a.expiry_date && b.expiry_date) {
        const timeDiff = new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
        if (timeDiff !== 0) return timeDiff;
      } else if (a.expiry_date && !b.expiry_date) {
        return -1;
      } else if (!a.expiry_date && b.expiry_date) {
        return 1;
      }
      return new Date(a.received_at).getTime() - new Date(b.received_at).getTime();
    });

    for (const batch of matchingStock) {
      if (remainingNeeded <= 0) break;

      const allocateAmount = Math.min(remainingNeeded, batch.qty_left);
      if (allocateAmount > 0) {
        batch.qty_left -= allocateAmount;
        remainingNeeded -= allocateAmount;
        totalAllocatedForItem += allocateAmount;

        allocations.push({
          order_item_id: item.order_item_id,
          inventory_level_id: batch.id,
          quantity_allocated: allocateAmount,
          bin_code: batch.bin_code || 'A-01-1',
          batch_number: batch.batch_number,
          expiry_date: batch.expiry_date,
        });
      }
    }

    if (remainingNeeded > 0) {
      shortfalls.push({
        order_item_id: item.order_item_id,
        product_id: item.product_id,
        requested: item.quantity_required,
        allocated: totalAllocatedForItem,
        missing: remainingNeeded,
      });
    }
  }

  return {
    success: shortfalls.length === 0,
    allocations,
    shortfalls,
  };
}
