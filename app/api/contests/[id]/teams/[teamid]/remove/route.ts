import dbclient from "@/app/api/dbclient";
import dbTables from "@/app/lib/dbTables";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log('yo');
  try{
    let tmp = request.nextUrl.pathname.split('/');
    tmp.pop();
    const teamId = tmp.pop();
    if(!teamId || teamId == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const response = await dbclient.query(`
      DELETE FROM ${dbTables.teams} WHERE id = $1
    `, [teamId]);
    const membersresponse = await dbclient.query(`
      DELETE FROM ${dbTables.team_members} WHERE team_id = $1
    `, [teamId]);
    if(response.rowCount == 0 || membersresponse.rowCount == 0) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  }catch(e){
    console.error("Error deleting team:", e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
