import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: `user-${Date.now()}`,
        ...body,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
  }
}
