import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    alerts: [
      {
        id: 'alt-01',
        type: 'danger',
        title: 'Safety Stock Breach',
        message: 'SKU-LAPT-001 available quantity is 8 units (Threshold: 10 units).',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: 'alt-02',
        type: 'warning',
        title: 'SLA Risk Countdown',
        message: 'Order ORD-20260818-8001 has 3 hours remaining to SLA breach.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        read: false,
      },
    ],
  });
}
