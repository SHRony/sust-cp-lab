import { NextRequest, NextResponse } from "next/server";
import dbclient from "@/app/api/dbclient";
import dbTables from "@/app/lib/dbTables";
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if(!id || id == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    
    const response = await dbclient.query(`
      SELECT * FROM ${dbTables.contests} WHERE id = $1
    `, [id]);
    if(response.rowCount == 0) return NextResponse.json({ error: 'Contest not found' }, { status: 404 });
    const contest = response.rows[0];
    return NextResponse.json(contest);
  } catch (error) {
    console.error("Error querying database:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

