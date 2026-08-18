export type ARIADecisionType =
  | 'anomaly_detected'
  | 'reallocation'
  | 'priority_override'
  | 'substitute_suggested'
  | 'worker_coaching'
  | 'bottleneck_resolution'
  | 'sla_escalation'
  | 'stockout_reorder'
  | 'executive_summary';

export type ARIASeverity = 'info' | 'warning' | 'critical';
export type ARIAExecutionMode = 'auto_triggered' | 'recommendation' | 'manual_dismissed';
export type ARIAExecutionStatus = 'pending' | 'executed' | 'failed' | 'dismissed';

export interface ARIADecision {
  id: string;
  decision_type: ARIADecisionType;
  severity: ARIASeverity;
  affected_order_id?: string;
  affected_product_id?: string;
  detected_problem: {
    title: string;
    description: string;
    metrics?: Record<string, unknown>;
  };
  root_cause_analysis: string;
  confidence_score: number; // 0 to 100
  suggested_action: {
    title: string;
    action_type: string;
    endpoint?: string;
    method?: string;
    body?: Record<string, unknown>;
  };
  execution_mode: ARIAExecutionMode;
  execution_status: ARIAExecutionStatus;
  executed_at?: string;
  created_at: string;
}

export type SummaryType = 'warehouse_pulse' | 'shift_debrief' | 'order_diagnostics' | 'inventory_outlook';

export interface ARIASummary {
  id: string;
  summary_type: SummaryType;
  period_start: string;
  period_end: string;
  health_score: number;
  key_highlights: string[];
  critical_blockers: string[];
  actions_taken_count: number;
  recommended_priorities: string[];
  raw_ai_narrative: string;
  created_at: string;
}
