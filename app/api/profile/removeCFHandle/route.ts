import { NextRequest, NextResponse } from 'next/server';
import dbTables from '@/app/lib/dbTables';
import client from '@/app/api/dbclient';

//post function for removing codeforces handle
export async function POST(request:NextRequest) {
  // write code to remove user and codeforces handles from database table dbTables.cf_handles
  const req = await request.json();
  try{
    const {cfHandle, userName} = req;
    if(!userName || !cfHandle) return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    const response = await client.query(`
      DELETE FROM ${dbTables.cf_handles} WHERE username = $1 AND handle = $2
    `, [userName, cfHandle]);
    if(response.rowCount == 0) return NextResponse.json({ error: "Codeforces handle not found" }, { status: 404 });
    return NextResponse.json({ message: "Codeforces handle removed successfully" });  
  }catch{
    console.error("Error removing codeforces handle");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
