import dbclient from "@/app/api/dbclient";
import dbTables from "@/app/lib/dbTables";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
  try{
    const id = request.nextUrl.pathname.split('/').pop();
    if(!id || id == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const {username} = await request.json();
    const response = await dbclient.query(`
      INSERT INTO ${dbTables.contestRegistrations} (contest_id, user_name) VALUES($1, $2)
    `, [id, username]);
    if(response.rowCount == 0) return NextResponse.json({ error: 'Contest registration failed' }, { status: 500 });
    return NextResponse.json({ message: 'Contest registration successful' });  
  }catch{
    console.error("Error registering for contest");
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
