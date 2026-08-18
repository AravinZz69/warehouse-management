import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role } = body;

    return NextResponse.json({
      success: true,
      user: {
        id: `user-${Date.now()}`,
        email: email || 'admin@ariawms.io',
        role: role || 'admin',
        full_name: 'Alexander Sterling',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 400 });
  }
}
