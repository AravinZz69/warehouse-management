import { describe, it, expect } from 'vitest';
import { allocateInventoryFEFO, AllocationRequestItem } from '../allocation-engine';
import { InventoryLevel } from '@/types/inventory.types';

describe('FEFO Allocation Engine Unit Tests', () => {
  const referenceDate = new Date('2026-08-18T00:00:00Z');

  const createStock = (overrides: Partial<InventoryLevel> & { id: string; product_id: string }): InventoryLevel => ({
    bin_id: 'bin-001',
    quantity_available: 50,
    quantity_reserved: 0,
    quantity_damaged: 0,
    received_at: '2026-08-01T00:00:00Z',
    last_movement_at: '2026-08-01T00:00:00Z',
    ...overrides,
  });

  it('1. Normal allocation — allocates stock sorted by expiry date (FEFO)', () => {
    const items: AllocationRequestItem[] = [
      { order_item_id: 'oi-101', product_id: 'prod-001', quantity_required: 30 },
    ];

    const stockPool: InventoryLevel[] = [
      createStock({
        id: 'inv-later',
        product_id: 'prod-001',
        quantity_available: 50,
        expiry_date: '2026-12-31T00:00:00Z',
        batch_number: 'BATCH-LATER',
      }),
      createStock({
        id: 'inv-sooner',
        product_id: 'prod-001',
        quantity_available: 50,
        expiry_date: '2026-09-30T00:00:00Z',
        batch_number: 'BATCH-SOONER',
      }),
    ];

    const result = allocateInventoryFEFO(items, stockPool, referenceDate);

    expect(result.success).toBe(true);
    expect(result.shortfalls.length).toBe(0);
    expect(result.allocations.length).toBe(1);
    expect(result.allocations[0].inventory_level_id).toBe('inv-sooner');
    expect(result.allocations[0].quantity_allocated).toBe(30);
  });

  it('2. Expired batch skipping — ignores batches with expiry date prior to reference date', () => {
    const items: AllocationRequestItem[] = [
      { order_item_id: 'oi-102', product_id: 'prod-001', quantity_required: 20 },
    ];

    const stockPool: InventoryLevel[] = [
      createStock({
        id: 'inv-expired',
        product_id: 'prod-001',
        quantity_available: 100,
        expiry_date: '2026-07-01T00:00:00Z', // Expired
        batch_number: 'BATCH-EXPIRED',
      }),
      createStock({
        id: 'inv-valid',
        product_id: 'prod-001',
        quantity_available: 50,
        expiry_date: '2026-10-15T00:00:00Z',
        batch_number: 'BATCH-VALID',
      }),
    ];

    const result = allocateInventoryFEFO(items, stockPool, referenceDate);

    expect(result.success).toBe(true);
    expect(result.allocations.length).toBe(1);
    expect(result.allocations[0].inventory_level_id).toBe('inv-valid');
    expect(result.allocations[0].quantity_allocated).toBe(20);
  });

  it('3. Partial fulfillment — allocates available stock and records shortfall when inventory is insufficient', () => {
    const items: AllocationRequestItem[] = [
      { order_item_id: 'oi-103', product_id: 'prod-001', quantity_required: 80 },
    ];

    const stockPool: InventoryLevel[] = [
      createStock({
        id: 'inv-small',
        product_id: 'prod-001',
        quantity_available: 30,
        expiry_date: '2026-11-01T00:00:00Z',
      }),
    ];

    const result = allocateInventoryFEFO(items, stockPool, referenceDate);

    expect(result.success).toBe(false);
    expect(result.allocations.length).toBe(1);
    expect(result.allocations[0].quantity_allocated).toBe(30);
    expect(result.shortfalls.length).toBe(1);
    expect(result.shortfalls[0]).toEqual({
      order_item_id: 'oi-103',
      product_id: 'prod-001',
      requested: 80,
      allocated: 30,
      missing: 50,
    });
  });

  it('4. Zero stock edge case — handles empty stock gracefully with shortfall', () => {
    const items: AllocationRequestItem[] = [
      { order_item_id: 'oi-104', product_id: 'prod-002', quantity_required: 15 },
    ];

    const result = allocateInventoryFEFO(items, [], referenceDate);

    expect(result.success).toBe(false);
    expect(result.allocations.length).toBe(0);
    expect(result.shortfalls.length).toBe(1);
    expect(result.shortfalls[0].missing).toBe(15);
  });
});
