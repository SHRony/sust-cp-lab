import client from "@/app/api/dbclient";
import dbTables from "@/app/lib/dbTables";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
  try{
    let tmp = request.nextUrl.pathname.split('/');
    tmp.pop();
    const username = tmp.pop();
    if(!username || username == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const response = await client.query(`SELECT contest_id FROM ${dbTables.contest_registrations} WHERE user_name = $1`, [username]);
    console.log(username);
    return NextResponse.json({contests: response.rows.map((row) => row.contest_id)});
  }catch(e){
    console.log(e);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
