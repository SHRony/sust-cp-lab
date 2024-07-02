import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import {userType} from '@/app/lib/types'
import client from "./dbclient";
import dbTables from "@/app/lib/dbTables";
import jwt from 'jsonwebtoken';
const JWT_KEY:string = process.env.JWT_KEY!;
export const dynamic = 'force-dynamic';
export const addUser = async (user : userType) => {
  user.password = await bcrypt.hash(user.password, 10);
  try{
    const response =  await client.query(`
    INSERT INTO ${dbTables.users} (username, email, password, user_type) VALUES($1, $2, $3, $4)
  `, [user.userName, user.email, user.password, user.userType]);
  }catch(e){
    console.log(e);
  }
}
export const addStudent = async (user : userType) => {
  const response =  await client.query(`
    INSERT INTO ${dbTables.student_info} (username, full_name, registration_no, vjudge_handle) VALUES($1, $2, $3, $4)
  `, [user.userName, user.fullName, user.registrationNumber, user.vjudgeHandle]);
}
export async function getUser(userName: string) {
  const result = await client.query(`SELECT * FROM ${dbTables.users} WHERE username = $1`, [userName]);
  return result.rows[0];
}

export async function generateAuthToken(user: any) {
  return jwt.sign({ username: user.username}, JWT_KEY, { expiresIn: '720h' });
}
