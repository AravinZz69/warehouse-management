import { NextRequest, NextResponse } from 'next/server';
import { runGeminiJSON } from '@/lib/gemini/client';
import { buildExecutiveSummaryPrompt } from '@/lib/gemini/prompts';
import { ExecutiveSummaryOutputSchema } from '@/lib/gemini/schemas';

export async function POST(req: NextRequest) {
  try {
    const prompt = buildExecutiveSummaryPrompt({
      period: 'Shift Handover (06:00 - 14:00)',
      total_orders_fulfilled: 184,
      total_revenue: 42850,
      sla_compliance_pct: 99.1,
      health_score: 92,
      decisions_executed: 4,
      stockout_skus: ['SKU-LAPT-001'],
    });

    const summary = await runGeminiJSON(prompt, ExecutiveSummaryOutputSchema.parse);

    return NextResponse.json({ success: true, data: summary });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 400 });
  }
}
