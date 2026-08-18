import { describe, it, expect } from 'vitest';
import { calculateSLARisk } from '../sla-calculator';
import { calculateOrderPriority } from '../priority-engine';
import { CUSTOMER_TIER_MULTIPLIERS } from '../constants';

describe('SLA Urgency Scoring & Customer Tier Math Unit Tests', () => {
  it('1. Enterprise tier multiplier (1.5x) calculates correct priority score', () => {
    expect(CUSTOMER_TIER_MULTIPLIERS.enterprise).toBe(1.5);

    const orderData = {
      requested_delivery_date: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      total_value: 1000,
      item_count: 5,
      created_at: new Date().toISOString(),
      customer_tier: 'enterprise' as const,
    };

    const result = calculateOrderPriority(orderData);

    // tier_component should be 15 * 1.5 = 22.5
    expect(result.breakdown.tier_component).toBe(22.5);
  });

  it('2. VIP tier multiplier (1.2x) calculates correct priority score', () => {
    expect(CUSTOMER_TIER_MULTIPLIERS.vip).toBe(1.2);

    const orderData = {
      requested_delivery_date: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      total_value: 1000,
      item_count: 5,
      created_at: new Date().toISOString(),
      customer_tier: 'vip' as const,
    };

    const result = calculateOrderPriority(orderData);

    // tier_component should be 15 * 1.2 = 18.0
    expect(result.breakdown.tier_component).toBe(18.0);
  });

  it('3. Overdue orders — calculateSLARisk identifies breached SLA deadline', () => {
    // Past deadline (2 hours ago)
    const pastDeadline = new Date(Date.now() - 2 * 3600 * 1000 - 15 * 60 * 1000).toISOString();

    const slaStatus = calculateSLARisk(pastDeadline);

    expect(slaStatus.status).toBe('breached');
    expect(slaStatus.is_breached).toBe(true);
    expect(slaStatus.hours_remaining).toBeLessThan(0);
    expect(slaStatus.formatted_time).toContain('Breached by');
  });

  it('4. On-track / critical orders — calculates positive hours remaining', () => {
    const futureDeadline = new Date(Date.now() + 3 * 3600 * 1000).toISOString();
    const slaStatus = calculateSLARisk(futureDeadline);

    expect(slaStatus.status).toBe('critical');
    expect(slaStatus.is_breached).toBe(false);
    expect(slaStatus.hours_remaining).toBeGreaterThan(0);
  });
});
