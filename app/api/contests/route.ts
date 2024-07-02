import { NextResponse, NextRequest } from 'next/server';
import dbclient from '@/app/api/dbclient';
import dbTables from '@/app/lib/dbTables';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const response = await dbclient.query(
      `SELECT * FROM ${dbTables.contests} ORDER BY date DESC`
    );
    const contests = response.rows.map((row) => row);
    console.log(contests);
    return NextResponse.json(contests);
  } catch (error) {
    console.error('Error querying database:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
