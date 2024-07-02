import { NextRequest, NextResponse } from 'next/server'
import dbTables from '@/app/lib/dbTables';
import client from '@/app/api/dbclient';

export async function POST(request:NextRequest) {
  // write code to add user and codeforces handles into database table dbTables.cf_handles
  const req = await request.json();
  console.log(req);
  try{
    let {username} = req;
    if(!username) return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    const response = await client.query(`
      SELECT user_type FROM ${dbTables.users} WHERE username = $1
    `, [username]);
    if(response.rowCount == 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const userType = response.rows[0].user_type;
    if(userType == 'pending_mentor'){
      await client.query(`
        UPDATE ${dbTables.users} SET user_type = 'mentor' WHERE username = $1
      `, [username]);
    }
    else{
      await client.query(`
        UPDATE ${dbTables.users} SET user_type = 'admin' WHERE username = $1
      `, [username]);
    }
    return NextResponse.json({ message: "User updated successfully" });  
  }
  catch{
    console.error("Error updating user");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
