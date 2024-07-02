import Jwt, { JwtPayload } from 'jsonwebtoken';
import { NextResponse, NextRequest } from "next/server";
import { addUser, addStudent } from "../auth";
import { cookies } from "next/headers";
import dbTables from '@/app/lib/dbTables';
import client from '../dbclient';
export const dynamic = 'force-dynamic';
export async function POST(request:NextRequest) {
  try{
    const token = await cookies().get('token')?.value;
    if(token == undefined) return NextResponse.json({ error: "Not logged in" }, { status: 201 });
    const decoaded = await Jwt.verify(token!, process.env.JWT_KEY!);
    let user = decoaded as JwtPayload;
    //get user type for the user from database
    const response = await client.query(`
      SELECT user_type FROM ${dbTables.users} WHERE username = $1
    `, [user.username]);
    user.userType = response.rows[0].user_type;
    return NextResponse.json({user: user});

  }catch{
    console.error("Error createing user");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}