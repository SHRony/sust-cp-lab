import prisma from "@/app/api/dbclient";
import { userTableEntryType, userType } from "@/app/lib/types";
import { user_type } from "@prisma/client";
import Jwt from 'jsonwebtoken';
import { cookies } from "next/headers";


export const updateVjudgeHandle = async (vjudgeHandle : string, userName : string) => {
  await prisma.sust_cp_lab_student_info.update({
    where: {
      username: userName
    },
    data: {
      vjudge_handle: vjudgeHandle
    }
  });
}
export const getUserInfo = async (username: string) => {
    const userResult = await prisma.sust_cp_lab_users.findUnique({
        where: {
            username: username
        }
    });
    if(userResult == null) return null;
    const studentResult = await prisma.sust_cp_lab_student_info.findUnique({
        where: {
            username: username
        }
    });
    if(!studentResult) return null;
    const cfHandles = await getCFHandles(username);
    const user:userType = {
      userName: userResult.username,
      fullName: studentResult.full_name,
      registrationNumber: studentResult.registration_no,
      email: userResult.email,
      vjudgeHandle: studentResult.vjudge_handle,
      cfHandles: cfHandles,
      password: '',
      userType: userResult.user_type,
      phone: '',
    }
    return user;
}
export const getCFHandles = async (username: string)=>{
  const cfResult = await prisma.sust_cp_lab_cf_handles.findMany({
    where: {
      username: username
    }
  });
  return cfResult.map(row => row.handle);
} 

export const getUsersListWithBsicCFInfo = async () => {
    try{
      const response = await prisma.sust_cp_lab_cf_cache.findMany({});
      const users = response.map((row) => row);
       const ret:userTableEntryType[] = users.map((row) => {
          const info = row.info as {
            maxRating: number;
            maxRank: string;
            avatar: string;
            contribution: number;};
          return {
            userName: row.username,
            maxRating: info.maxRating,
            maxRank: info.maxRank,
            id: row.username,
            avatar: info.avatar,
            contribution: info.contribution
          }
        });
      return ret;
    }catch{
      return [];
    }
  }
  
  export const isLoggedIn = async (): Promise<{userName: string; userType: user_type} | null> => {
    try{
      const token = await cookies().get('token')?.value;
      if(token == undefined) return null;
      const user = await Jwt.verify(token!, process.env.JWT_KEY!) as {username: string; user_type: user_type};
      if(!user) return null;
      const response = await getUserbyName(user.username);
      let ret = {
        userName: user.username,
        userType: user.user_type,
      }
      return ret;
    }catch{
      return null;
    }
  }
  
  
  export async function getUserbyName(userName: string) {
    const result = await prisma.sust_cp_lab_users.findUnique({
      where: {
        username: userName,
      },
    });
    return result;
  }
  export async function getUserbyEmail(email: string) {
    const result = await prisma.sust_cp_lab_users.findUnique({
      where: {
        email: email,
      },
    });
    return result;
  }