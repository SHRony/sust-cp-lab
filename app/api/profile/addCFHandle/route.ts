import { NextRequest, NextResponse } from 'next/server';
import dbTables from '@/app/lib/dbTables';
import client from '@/app/api/dbclient';

//post function for adding codeforces handle
export async function POST(request:NextRequest) {
  // write code to add user and codeforces handles into database table dbTables.cf_handles
  const req = await request.json();
  try{
    const {cfHandle, userName} = req;
    if(!userName || !cfHandle) return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    const response = await client.query(`
      INSERT INTO ${dbTables.cf_handles} (username, handle) VALUES($1, $2)
    `, [userName, cfHandle]);
    console.log(response);
    if(response.rowCount == 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "Codeforces handle added successfully" });  
  }
  catch{
    console.error("Error adding codeforces handle");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}