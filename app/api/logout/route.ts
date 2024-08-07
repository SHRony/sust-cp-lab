import Jwt from 'jsonwebtoken';
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
export async function POST(request:NextRequest) {
  try{
    cookies().delete('token');
    return NextResponse.json({message: "logout successful"});
  }catch{
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}