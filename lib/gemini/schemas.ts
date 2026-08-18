import { z } from 'zod';

export const AnomalyDecisionSchema = z.object({
  type: z.enum([
    'anomaly_detected',
    'reallocation',
    'priority_override',
    'substitute_suggested',
    'worker_coaching',
    'bottleneck_resolution',
    'sla_escalation',
    'stockout_reorder',
    'executive_summary',
  ]),
  severity: z.enum(['info', 'warning', 'critical']),
  affected_order_id: z.string().optional(),
  affected_product_id: z.string().optional(),
  problem_detected: z.string(),
  root_cause: z.string(),
  decision_rationale: z.string(),
  recommendation: z.string(),
  confidence: z.number().min(0).max(100),
  auto_executable: z.boolean(),
  action_payload: z
    .object({
      endpoint: z.string().optional(),
      method: z.string().optional(),
      body: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
});

export const WarehouseAnalysisOutputSchema = z.object({
  health_score: z.number().min(0).max(100),
  summary: z.string(),
  anomalies: z.array(AnomalyDecisionSchema),
});

export const ExecutiveSummaryOutputSchema = z.object({
  summary_type: z.enum(['warehouse_pulse', 'shift_debrief', 'order_diagnostics', 'inventory_outlook']),
  health_score: z.number().min(0).max(100),
  key_highlights: z.array(z.string()),
  critical_blockers: z.array(z.string()),
  actions_taken_count: z.number(),
  recommended_priorities: z.array(z.string()),
  raw_ai_narrative: z.string(),
});

export const OperationalQueryOutputSchema = z.object({
  answer: z.string(),
  sql_hint: z.string().optional(),
  recommended_actions: z.array(z.string()).optional(),
});
