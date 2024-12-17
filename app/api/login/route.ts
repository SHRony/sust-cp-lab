import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { getUserbyName, getCFHandles } from "@/app/api/queries/user_queries";
import jwt from 'jsonwebtoken';
import { sust_cp_lab_users } from '@prisma/client';
import prisma from '@/app/api/dbclient';
import { getCFInfo, addCFCache } from "../queries/cf_queries";

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
    
    // Add CF cache for students
    if (user.user_type === 'student') {
       tryToAddCFCache(userName);
    }

    generateLoginTokenAndSetCookie(user);
    return NextResponse.json({ 
      message: "Login successful",
      userType: user.user_type 
    });
}

async function generateLoginTokenAndSetCookie(user: sust_cp_lab_users) {
  const token = await generateAuthToken(user);
  const expires = new Date();
  expires.setMonth(expires.getMonth() + 1);
  cookies().set('token', token, { expires });
}

async function generateAuthToken(user: sust_cp_lab_users) {
  return jwt.sign({ 
    username: user.username,
    userType: user.user_type
  }, JWT_KEY, { expiresIn: '720h' });
}

async function tryToAddCFCache(username: string) {
  const handles = await getCFHandles(username);
  const response = await prisma.sust_cp_lab_cf_handles.findMany({ where: { username: username } });
    const cfHandles = response.map((row) => row.handle);
    let user = await getCFInfo(cfHandles);    
    addCFCache(username, user);
    
    // Add empty CF cache or update existing one
}
