import { NextRequest, NextResponse } from 'next/server';
import { runGeminiJSON } from '@/lib/gemini/client';
import { buildQueryPrompt } from '@/lib/gemini/prompts';
import { OperationalQueryOutputSchema } from '@/lib/gemini/schemas';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '@/lib/supabase/mock-db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    const prompt = buildQueryPrompt(query, {
      products: INITIAL_PRODUCTS.map((p) => ({ sku: p.sku, name: p.name, price: p.selling_price })),
      orders: INITIAL_ORDERS.map((o) => ({ order_number: o.order_number, status: o.status, priority: o.priority_level })),
    });

    const res = await runGeminiJSON(prompt, OperationalQueryOutputSchema.parse);

    return NextResponse.json({ success: true, data: res });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process query' }, { status: 400 });
  }
}
