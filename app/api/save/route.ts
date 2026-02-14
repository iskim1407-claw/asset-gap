import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // In production, we rely on localStorage on the client side
    // Server-side saving is optional and disabled on serverless
    console.log('Simulation saved:', JSON.stringify(data).slice(0, 200));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
