import dbclient from "@/app/api/dbclient";
import { getContestTeams } from "@/app/api/queries";
import dbTables from "@/app/lib/dbTables";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
  try{
    let tmp = request.nextUrl.pathname.split('/');
    tmp.pop();
    const id = tmp.pop();
    if(!id || id == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const teams = await getContestTeams(id);
    return NextResponse.json(teams);
  }catch(e){
    console.error("Error getting teams for contest", e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
