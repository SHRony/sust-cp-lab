import { NextRequest, NextResponse } from "next/server";
import dbclient from "@/app/api/dbclient";
import dbTables from "@/app/lib/dbTables";
import { getContest } from "@/app/api/queries";
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/').pop();
    if(!id || id == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    
    const contest = await getContest(id);
    return NextResponse.json(contest);
  } catch (error) {
    console.error("Error querying database:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

