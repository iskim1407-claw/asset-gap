import { NextRequest, NextResponse } from 'next/server';
import { SCENARIOS, simulate, SimulationInput } from '@/lib/data';

export async function POST(req: NextRequest) {
  try {
    const input: SimulationInput = await req.json();
    const results = SCENARIOS.map(s => simulate(input, s));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}
