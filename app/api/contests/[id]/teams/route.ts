import dbclient from "@/app/api/dbclient";
import dbTables from "@/app/lib/dbTables";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
  try{
    let tmp = request.nextUrl.pathname.split('/');
    tmp.pop();
    const id = tmp.pop();
    if(!id || id == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const response = await dbclient.query(`
      SELECT * FROM ${dbTables.teams} WHERE contest = $1
    `, [id]);
    let teams:any = [];
    for(const row of response.rows){
      const memberRes = await dbclient.query(`
          SELECT * FROM ${dbTables.team_members} WHERE team_id = $1
        `, [row.id]);
      
      teams.push({
        id: row.id,
        name: row.name,
        members: memberRes.rows.map((r) => r.user_name),
      });
    }
    return NextResponse.json(teams);
  }catch(e){
    console.error("Error getting teams for contest", e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
