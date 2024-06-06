import { userType } from '@/app/lib/types';
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import client from "@/app/api/dbclient";
import dbTables from '@/app/lib/dbTables';
export async function POST(request:NextRequest) {
  // // write code to update vjudge handle
  const req = await request.json();
  try{
     const {vjudgeHandle, userName} = req;
    if(!userName || !vjudgeHandle) return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    const response = await client.query(`
      UPDATE ${dbTables.student_info} SET vjudge_handle = $1 WHERE username = $2
    `, [vjudgeHandle, userName]);
    if(response.rowCount == 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "Vjudge handle updated successfully" });  
  }catch{
    console.error("Error updating vjudge handle");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}