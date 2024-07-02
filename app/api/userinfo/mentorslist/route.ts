import dbTables from "@/app/lib/dbTables";
import { NextRequest, NextResponse } from "next/server";
import client from "@/app/api/dbclient";
export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
  try{
    const response = await client.query(`
      SELECT username, email, user_type FROM ${dbTables.users} WHERE user_type != 'student'
    `);
    return NextResponse.json({users: response.rows});
  }catch{
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
