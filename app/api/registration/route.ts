import { NextResponse, NextRequest } from "next/server";
import {userType} from '@/app/lib/types'
import { PrismaClient } from "@prisma/client";
import { ITXClientDenyList } from "@prisma/client/runtime/library";
import { prisma } from "../dbclient";
import {hashPassword} from "@/app/api/queries/utils";
import { getUserbyEmail, getUserbyName } from "../queries/user_queries";

export async function POST(request:NextRequest) {
 
  try{
    const user:userType = await request.json();
    if (!user.userName || !user.email || !user.password || (user.userType == 'student' && !user.fullName) || (user.userType == 'student' && !user.registrationNumber) || !user.userType) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }
    if(await getUserbyName(user.userName)) return NextResponse.json({ error: "username already exists" }, { status: 400 });
    if(await getUserbyEmail(user.email)) return NextResponse.json({ error: "email already exists" }, { status: 400 });
    await performRegistration(user);
    return NextResponse.json({ message: "User created successfully" });
  }catch(e){
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function performRegistration(user: userType) {
  try{
    await tryToPerformRegistration(user);
    return {success: true};
  }catch(e){
    return {success: false, error: e};
  }
}

async function tryToPerformRegistration(user: userType) {
  prisma.$transaction(async (prisma) => {
    await saveUserInfoIntoDatabase(user, prisma);
    if(user.userType == 'student') await saveStudentInfoIntoDatabase(user, prisma);
  })
}
async function saveUserInfoIntoDatabase(user : userType, prisma : Omit<PrismaClient, ITXClientDenyList>){
  user.password = await hashPassword(user.password);
  await prisma.sust_cp_lab_users.create({
    data: {
      username: user.userName,
      email: user.email,
      password: user.password,
      user_type: user.userType
    }
  });
}
async function saveStudentInfoIntoDatabase(user : userType, prisma : Omit<PrismaClient, ITXClientDenyList>){
  await prisma.sust_cp_lab_student_info.create({
    data: {
      username: user.userName,
      full_name: user.fullName,
      registration_no: user.registrationNumber||"",
      vjudge_handle: user.vjudgeHandle
    }
  })
  };