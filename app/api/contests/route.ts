import { NextResponse, NextRequest } from 'next/server';
import { getContests } from '@/app/api/queries/contest_queries';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({contests:await getContests()});
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
