import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_INVENTORY } from '@/lib/supabase/mock-db';

export async function GET() {
  return NextResponse.json({ success: true, data: INITIAL_INVENTORY });
}
