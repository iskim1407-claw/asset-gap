import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { input, results } = await req.json();
    const db = getDb();
    const stmt = db.prepare(
      'INSERT INTO simulations (monthly_salary, monthly_saving, current_asset, region_id, results) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(input.monthlySalary, input.monthlySaving, input.currentAsset, input.regionId, JSON.stringify(results));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
