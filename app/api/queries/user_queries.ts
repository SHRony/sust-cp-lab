import dbTables from "@/app/lib/dbTables";
import client from "@/app/api/dbclient";
import { userTableEntryType, userType } from "@/app/lib/types";
import Jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from "next/headers";

export const getUserInfo = async (username: string) => {
    const userResult = await client.query(`SELECT * FROM ${dbTables.users} WHERE username = $1`, [username]);
    if(!userResult.rows[0]) return null;
    const studentResult = await client.query(`SELECT * FROM ${dbTables.student_info} WHERE username = $1`, [username]);
    if(!studentResult.rows[0]) return null;
    const cfResult = await client.query(`SELECT handle FROM ${dbTables.cf_handles} WHERE username = $1`, [username]);
    const cfHandles = cfResult.rows.map(row => row.handle);
    const user:userType = {
      userName: userResult.rows[0].username,
      fullName: studentResult.rows[0].full_name,
      registrationNumber: studentResult.rows[0].registration_no,
      email: userResult.rows[0].email,
      vjudgeHandle: studentResult.rows[0].vjudge_handle,
      cfHandles: cfHandles,
      password: '',
      userType: userResult.rows[0].user_type,
      phone: studentResult.rows[0].phone,
    }
    return user;
}

export const getUsersList = async () => {
    try{
      const response = await client.query(`
        SELECT username, info FROM ${dbTables.cf_cache}
      `);
      const users = response.rows.map((row) => row);
       const ret:userTableEntryType[] = users.map((row) => {
          return {
            userName: row.username,
            maxRating: row.info.maxRating,
            maxRank: row.info.maxRank,
            id: row.username,
            avatar: row.info.avatar,
            contribution: row.info.contribution
          }
        });
      return ret;
    }catch{
      return [];
    }
  }
  
  export const isLoggedIn = async () => {
    try{
      const token = await cookies().get('token')?.value;
      if(token == undefined) return null;
      const decoaded = await Jwt.verify(token!, process.env.JWT_KEY!);
      if(!decoaded) return null;
      let user = decoaded as JwtPayload;
      const response = await client.query(`
        SELECT user_type FROM ${dbTables.users} WHERE username = $1
      `, [user.username]);
      let ret = {
        userName:user.username,
        userType: response.rows[0].user_type
      }
      return ret;
    }catch{
      return null;
    }
  }
  