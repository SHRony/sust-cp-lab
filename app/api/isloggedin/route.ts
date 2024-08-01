import Jwt, { JwtPayload } from 'jsonwebtoken';
import { NextResponse, NextRequest } from "next/server";
import { isLoggedIn } from '@/app/api/queries/user_queries';
export const dynamic = 'force-dynamic';
export async function POST(request:NextRequest) {
  try{
    const user = await isLoggedIn();
    if(!user) return NextResponse.json({ error: "Not logged in" }, { status: 201 });
    return NextResponse.json({user: user});
  }catch{
    console.error("Error createing user");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}