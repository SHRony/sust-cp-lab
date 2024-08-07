import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { getUserbyName} from "@/app/api/queries/user_queries";
import jwt from 'jsonwebtoken';
import { sust_cp_lab_users } from '@prisma/client';

const JWT_KEY:string = process.env.JWT_KEY!;

export async function POST(request:NextRequest) {
  try{
    const {userName, password} = await request.json();
    return validateCredentialsAndLogin(userName, password);    
  }catch{
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function validateCredentialsAndLogin(userName: string, password: string) {
    if (!userName || !password) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }
    const user = await getUserbyName(userName);
    if(!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const passwordDidMatch:boolean = await bcrypt.compare(password, user.password);
    if(!passwordDidMatch) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    generateLoginTokenAndSetCookie(user);
    return NextResponse.json({ message: "Login successful" });
}

async function generateLoginTokenAndSetCookie(user: sust_cp_lab_users) {
  const token = await generateAuthToken(user);
  const expires = new Date();
  expires.setMonth(expires.getMonth() + 1);
  cookies().set('token', token, { expires });
}

async function generateAuthToken(user: any) {
  return jwt.sign({ username: user.username}, JWT_KEY, { expiresIn: '720h' });
}
