import { NextRequest, NextResponse } from 'next/server';
import { runGeminiJSON } from '@/lib/gemini/client';
import { buildWarehouseAnalysisPrompt } from '@/lib/gemini/prompts';
import { WarehouseAnalysisOutputSchema } from '@/lib/gemini/schemas';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PURCHASE_ORDERS, INITIAL_WORKERS, INITIAL_ARIA_DECISIONS } from '@/lib/supabase/mock-db';

export async function POST(req: NextRequest) {
  try {
    const prompt = buildWarehouseAnalysisPrompt({
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      purchase_orders: INITIAL_PURCHASE_ORDERS,
      workers: INITIAL_WORKERS,
      pulse_score: 92,
    });

    const analysis = await runGeminiJSON(prompt, WarehouseAnalysisOutputSchema.parse);

    // Process detected anomalies & auto-trigger if confidence >= 85
    for (const anomaly of analysis.anomalies) {
      const isAuto = anomaly.confidence >= 85.0 && anomaly.auto_executable;

      const newDecision = {
        id: `dec-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        decision_type: anomaly.type as any,
        severity: anomaly.severity as any,
        affected_order_id: anomaly.affected_order_id,
        affected_product_id: anomaly.affected_product_id,
        detected_problem: {
          title: anomaly.problem_detected,
          description: anomaly.root_cause,
        },
        root_cause_analysis: anomaly.decision_rationale,
        confidence_score: anomaly.confidence,
        suggested_action: {
          title: anomaly.recommendation,
          action_type: anomaly.action_payload?.endpoint ? 'api_call' : 'manual',
          endpoint: anomaly.action_payload?.endpoint,
          method: anomaly.action_payload?.method,
          body: anomaly.action_payload?.body,
        },
        execution_mode: isAuto ? ('auto_triggered' as const) : ('recommendation' as const),
        execution_status: isAuto ? ('executed' as const) : ('pending' as const),
        executed_at: isAuto ? new Date().toISOString() : undefined,
        created_at: new Date().toISOString(),
      };

      INITIAL_ARIA_DECISIONS.unshift(newDecision as any);
    }

    return NextResponse.json({
      success: true,
      data: analysis,
      active_decisions: INITIAL_ARIA_DECISIONS,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to run ARIA autonomous analysis' }, { status: 500 });
  }
}
