import dbclient from "@/app/api/dbclient";
import dbTables from "@/app/lib/dbTables";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
  try{
    const id = request.nextUrl.pathname.split('/').pop();
    if(!id || id == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const {username} = await request.json();
    const response = await dbclient.query(`
      SELECT * FROM ${dbTables.contest_registrations} WHERE contest_id = $1 AND user_name = $2
    `, [id, username]);
    if(response.rowCount == 0) return NextResponse.json({ registered: false });
    return NextResponse.json({ registered: true });  
  }catch{
    console.error("Error checking registration");
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
