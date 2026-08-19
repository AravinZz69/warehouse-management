import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role } = body;

    const response = NextResponse.json({
      success: true,
      user: {
        id: `user-${Date.now()}`,
        email: email || 'admin@ariawms.io',
        role: role || 'admin',
        full_name: 'Alexander Sterling',
      },
    });

    response.cookies.set('aria_session', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 400 });
  }
}
