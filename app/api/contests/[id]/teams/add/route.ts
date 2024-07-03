import dbclient from "@/app/api/dbclient";
import dbTables from "@/app/lib/dbTables";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // const dbg = await request.json();
  try {
    const tmp = request.nextUrl.pathname.split('/');
    tmp.pop(), tmp.pop();
    const id = tmp.pop();
    if(!id || id == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const {name, members} = await request.json();
    const response = await dbclient.query(`
      INSERT INTO ${dbTables.teams} (name, contest) VALUES ($1, $2) RETURNING id;
    `, [name, id]);
    const team_id = response.rows[0].id;
    members.forEach(async (user:string) => {
      await dbclient.query(`
        INSERT INTO ${dbTables.team_members} (team_id, user_name) VALUES ($1, $2);
      `, [team_id, user]);
    }); 
    return NextResponse.json({ id: team_id });
  } catch (error) {
    console.error('Error adding team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
