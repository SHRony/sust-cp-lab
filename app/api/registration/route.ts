import { NextResponse, NextRequest } from "next/server";
import {userType} from '@/app/lib/types'
import { addUser, addStudent } from "../auth";
export async function POST(request:NextRequest) {
 
  try{
    const user:userType = await request.json();
     if (!user.userName || !user.email || !user.password || (user.userType == 'student' && !user.fullName) || (user.userType == 'student' && !user.registrationNumber) || !user.userType) {
      console.log(user);
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }
    await addUser(user);
    if(user.userType == 'student')await addStudent(user);
    return NextResponse.json({ message: "User created successfully" });
  }catch(e){
    console.error("Error createing user");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}