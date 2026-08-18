import { SalesOrder, PriorityLevel, CustomerTier } from '@/types/order.types';
import { CUSTOMER_TIER_MULTIPLIERS } from './constants';

export interface PriorityScoreResult {
  score: number; // 0.00 to 100.00
  level: PriorityLevel;
  breakdown: {
    sla_component: number;
    tier_component: number;
    value_component: number;
    urgency_component: number;
  };
}

export function calculateOrderPriority(
  order: Pick<SalesOrder, 'requested_delivery_date' | 'total_value' | 'item_count' | 'created_at'> & {
    customer_tier?: CustomerTier;
    is_fragile?: boolean;
    requires_cold_storage?: boolean;
  }
): PriorityScoreResult {
  const now = new Date().getTime();
  const deliveryTime = new Date(order.requested_delivery_date).getTime();
  const hoursUntilDelivery = Math.max(0, (deliveryTime - now) / (1000 * 60 * 60));

  // 1. SLA Urgency Component (Max 40 pts): Fewer hours = higher urgency
  let slaComponent = 0;
  if (hoursUntilDelivery <= 12) {
    slaComponent = 40;
  } else if (hoursUntilDelivery <= 24) {
    slaComponent = 30;
  } else if (hoursUntilDelivery <= 48) {
    slaComponent = 20;
  } else if (hoursUntilDelivery <= 72) {
    slaComponent = 10;
  } else {
    slaComponent = 5;
  }

  // 2. Customer Tier Multiplier Component (Max 25 pts)
  const tier = order.customer_tier || 'standard';
  const multiplier = CUSTOMER_TIER_MULTIPLIERS[tier] || 1.0;
  const tierComponent = Math.min(25, 15 * multiplier);

  // 3. Financial Value Component (Max 20 pts)
  let valueComponent = 0;
  if (order.total_value >= 10000) {
    valueComponent = 20;
  } else if (order.total_value >= 5000) {
    valueComponent = 15;
  } else if (order.total_value >= 1000) {
    valueComponent = 10;
  } else {
    valueComponent = 5;
  }

  // 4. Operational Handling Urgency (Max 15 pts)
  let urgencyComponent = 0;
  if (order.requires_cold_storage) urgencyComponent += 8;
  if (order.is_fragile) urgencyComponent += 7;

  const rawScore = slaComponent + tierComponent + valueComponent + urgencyComponent;
  const finalScore = Number(Math.min(100, Math.max(0, rawScore)).toFixed(2));

  let level: PriorityLevel = 'medium';
  if (finalScore >= 80) {
    level = 'critical';
  } else if (finalScore >= 60) {
    level = 'high';
  } else if (finalScore >= 40) {
    level = 'medium';
  } else {
    level = 'low';
  }

  return {
    score: finalScore,
    level,
    breakdown: {
      sla_component: Number(slaComponent.toFixed(1)),
      tier_component: Number(tierComponent.toFixed(1)),
      value_component: Number(valueComponent.toFixed(1)),
      urgency_component: Number(urgencyComponent.toFixed(1)),
    },
  };
}
