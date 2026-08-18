export interface WarehousePulseMetrics {
  health_score: number; // 0 to 100
  sla_compliance_pct: number;
  stockout_risk_count: number;
  picking_accuracy_pct: number;
  zone_congestion_pct: number;
  active_orders_count: number;
  shift_dispatches_count: number;
}

export function computeWarehousePulse(input: {
  sla_breached_count: number;
  total_orders: number;
  low_stock_count: number;
  total_skus: number;
  pick_errors: number;
  total_picks: number;
}): WarehousePulseMetrics {
  const { sla_breached_count, total_orders, low_stock_count, total_skus, pick_errors, total_picks } = input;

  // 1. SLA Compliance Pct (40% weight)
  const slaPct = total_orders > 0 ? Math.max(0, 100 - (sla_breached_count / total_orders) * 100) : 98;

  // 2. Stock Health Pct (30% weight)
  const stockoutRatio = total_skus > 0 ? low_stock_count / total_skus : 0;
  const stockHealthPct = Math.max(0, 100 - stockoutRatio * 150);

  // 3. Picking Accuracy Pct (30% weight)
  const pickAccuracyPct = total_picks > 0 ? Math.max(0, 100 - (pick_errors / total_picks) * 100) : 99.2;

  // Composite Pulse Score
  const rawPulse = slaPct * 0.4 + stockHealthPct * 0.3 + pickAccuracyPct * 0.3;
  const healthScore = Math.min(100, Math.max(0, Math.round(rawPulse)));

  return {
    health_score: healthScore,
    sla_compliance_pct: Number(slaPct.toFixed(1)),
    stockout_risk_count: low_stock_count,
    picking_accuracy_pct: Number(pickAccuracyPct.toFixed(1)),
    zone_congestion_pct: Math.min(85, Math.round(15 + (total_orders / 20) * 10)),
    active_orders_count: total_orders,
    shift_dispatches_count: Math.round(total_orders * 0.65),
  };
}
