import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcrypt';
import {userType} from '@/app/lib/types'
import client from "./dbclient";
import dbTables from "@/app/lib/dbTables";

// must update this for other user types too
export const getUserInfo = async (username: string) => {
  const userResult = await client.query(`SELECT * FROM ${dbTables.users} WHERE username = $1`, [username]);
  if(!userResult.rows[0]) return null;
  const studentResult = await client.query(`SELECT * FROM ${dbTables.student_info} WHERE username = $1`, [username]);
  if(!studentResult.rows[0]) return null;
  const cfResult = await client.query(`SELECT handle FROM ${dbTables.cf_handles} WHERE username = $1`, [username]);
  const cfHandles = cfResult.rows.map(row => row.handle);
  const user = {
    userName: userResult.rows[0].username,
    fullName: studentResult.rows[0].full_name,
    registrationNumber: studentResult.rows[0].registration_no,
    email: userResult.rows[0].email,
    vjudgeHandle: studentResult.rows[0].vjudge_handle,
    cfHandles: cfHandles,
    password: '',
  }
  return user;
} 