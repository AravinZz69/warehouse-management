import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_ARIA_DECISIONS } from '@/lib/supabase/mock-db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ decisionId: string }> }) {
  const { decisionId } = await params;

  const decision = INITIAL_ARIA_DECISIONS.find((d) => d.id === decisionId);

  if (!decision) {
    return NextResponse.json({ error: 'ARIA Decision record not found' }, { status: 404 });
  }

  decision.execution_status = 'executed';
  decision.executed_at = new Date().toISOString();

  return NextResponse.json({
    success: true,
    message: `ARIA decision ${decisionId} executed successfully`,
    data: decision,
  });
}
