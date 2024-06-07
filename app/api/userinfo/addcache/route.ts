// write a post function which get a username and cfUserType object and add it to dbTables.cf_cache table making the cfUsrType object a json object
import { NextRequest, NextResponse } from 'next/server';
import dbTables from '@/app/lib/dbTables';
import client from '@/app/api/dbclient';

export async function POST(request:NextRequest) {
  // write code to add user and codeforces handles into database table dbTables.cf_handles
  const req = await request.json();
  try{
    let {username, info} = req;
    info.calenderSubmissions = [], info.diffData = [], info.catData = [], info.ratingChanges = [], info.acTime = [];
    if(!username || !info) return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    info = JSON.stringify(info);
    const response = await client.query(`
      INSERT INTO ${dbTables.cf_cache} (username, info) VALUES($1, $2)
      ON CONFLICT (username) DO UPDATE SET info = EXCLUDED.info
    `, [username, info]);
    if(response.rowCount == 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "Codeforces handle added successfully" });  
  }
  catch{
    console.error("Error adding codeforces handle");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
