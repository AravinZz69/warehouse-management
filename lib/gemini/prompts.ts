export function buildWarehouseAnalysisPrompt(telemetry: {
  products: any[];
  orders: any[];
  purchase_orders: any[];
  workers: any[];
  pulse_score: number;
}): string {
  return `You are ARIA (Autonomous Real-time Inventory & Warehouse AI Engine).
Analyze the following warehouse live telemetry data and detect stockouts, SLA risks, process bottlenecks, worker anomalies, or replenishment needs.

TELEMETRY DATA:
${JSON.stringify(telemetry, null, 2)}

Produce a JSON object conforming strictly to this JSON Schema:
{
  "health_score": number (0 to 100),
  "summary": string,
  "anomalies": [
    {
      "type": "stockout_reorder" | "priority_override" | "bottleneck_resolution" | "reallocation" | "sla_escalation" | "substitute_suggested",
      "severity": "info" | "warning" | "critical",
      "affected_order_id": string (optional),
      "affected_product_id": string (optional),
      "problem_detected": string,
      "root_cause": string,
      "decision_rationale": string,
      "recommendation": string,
      "confidence": number (0 to 100),
      "auto_executable": boolean (true if confidence >= 85),
      "action_payload": {
        "endpoint": string,
        "method": string,
        "body": object
      }
    }
  ]
}

Return ONLY valid JSON. No markdown code blocks, no intro/outro text.`;
}

export function buildExecutiveSummaryPrompt(metrics: {
  period: string;
  total_orders_fulfilled: number;
  total_revenue: number;
  sla_compliance_pct: number;
  health_score: number;
  decisions_executed: number;
  stockout_skus: string[];
}): string {
  return `You are ARIA, Chief Logistics AI Officer. Generate a comprehensive Executive Shift Debrief & Operations Handover Report.

METRICS SUMMARY:
${JSON.stringify(metrics, null, 2)}

Respond with a JSON object strictly matching this schema:
{
  "summary_type": "shift_debrief",
  "health_score": ${metrics.health_score},
  "key_highlights": [string, string, string],
  "critical_blockers": [string],
  "actions_taken_count": ${metrics.decisions_executed},
  "recommended_priorities": [string, string],
  "raw_ai_narrative": string
}

Return ONLY valid JSON.`;
}

export function buildQueryPrompt(query: string, contextData: any): string {
  return `You are ARIA Terminal AI. Answer the following operational query accurately based on warehouse data context.

USER QUERY: "${query}"

CONTEXT DATA:
${JSON.stringify(contextData, null, 2)}

Respond with a JSON object strictly matching:
{
  "answer": string,
  "sql_hint": string (optional),
  "recommended_actions": [string] (optional)
}

Return ONLY valid JSON.`;
}
