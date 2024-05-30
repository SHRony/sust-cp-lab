import Jwt from 'jsonwebtoken';
import { NextResponse, NextRequest } from "next/server";
import {userType} from '@/app/lib/types'
import { addUser, addStudent } from "../auth";
import { cookies } from "next/headers";
export async function POST(request:NextRequest) {
  try{
    const token = await cookies().get('token')?.value;
    if(token == undefined) return NextResponse.json({ error: "Not logged in" }, { status: 201 });
    const decoaded = await Jwt.verify(token!, process.env.JWT_KEY!);
    return NextResponse.json({user: decoaded});

  }catch{
    console.error("Error createing user");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}