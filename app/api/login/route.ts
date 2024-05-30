import { userType } from '@/app/lib/types';
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import client from "../dbclient";
import { getUser, generateAuthToken } from "../auth";
export async function POST(request:NextRequest) {
  try{
    const {userName, password} = await request.json();
     if (!userName || !password) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }
    const user = await getUser(userName);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = await generateAuthToken(user);
      cookies().set('token', token);
      return NextResponse.json({ token: token, userType: user.user_type });
    }else if(!user){
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }else {
      return NextResponse.json({ error: "Internal error during encryption" }, { status: 500 });
    }
    
  }catch{
    console.error("Error logging in");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}