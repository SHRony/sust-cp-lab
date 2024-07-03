import dbclient from "@/app/api/dbclient";
import dbTables from "@/app/lib/dbTables";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
  try{
    const tmp = request.nextUrl.pathname.split('/');
    tmp.pop();
    const id = tmp.pop();
    if(!id || id == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const registrationResults = await dbclient.query(`SELECT user_name FROM ${dbTables.contest_registrations} WHERE contest_id = $1`, [id]);
    const registeredUsers = registrationResults.rows.map((row) => row.user_name);
    const cfResult = await dbclient.query(`SELECT * FROM ${dbTables.cf_cache}`);
    const users = cfResult.rows.filter((row) => registeredUsers.includes(row.username));
    return NextResponse.json({users: users});
  }catch(e){
    console.log(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
