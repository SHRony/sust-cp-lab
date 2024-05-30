import { NextResponse, NextRequest } from "next/server";
import {userType} from '@/app/lib/types'
import { addUser, addStudent } from "../auth";
export async function POST(request:NextRequest) {
  try{
    const user:userType = await request.json();
     if (!user.userName || !user.email || !user.password || !user.fullName || !user.registrationNumber) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }
    await addUser(user);
    await addStudent(user);
    return NextResponse.json({ message: "User created successfully" });
  }catch{
    console.error("Error createing user");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}