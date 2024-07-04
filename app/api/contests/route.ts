import { NextResponse, NextRequest } from 'next/server';
import dbclient from '@/app/api/dbclient';
import dbTables from '@/app/lib/dbTables';
import { getContests } from '@/app/api/queries';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(getContests);
  } catch (error) {
    console.error('Error querying database:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
