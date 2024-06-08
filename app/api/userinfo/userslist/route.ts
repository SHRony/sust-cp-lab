// write an api to get list of username and info from dbTables.cf_cache table
import { NextRequest, NextResponse } from 'next/server';
import dbTables from '@/app/lib/dbTables';
import client from '@/app/api/dbclient';
export async function GET(request:NextRequest) {
  try{
    // write a code to join cf_cache and users table where SELECT ${dbTables.cf_cache}.username, ${dbTables.cf_cache}.info FROM ${dbTables.cf_cache} INNER JOIN ${dbTables.users} ON ${dbTables.cf_cache}.username = ${dbTables.users}.usernameSELECT ${dbTables.cf_cache}.username, ${dbTables.cf_cache}.info FROM ${dbTables.cf_cache} INNER JOIN ${dbTables.users} ON ${dbTables.cf_cache}.username = ${dbTables.users}.username matches and then return the username and info, if info doesn't exist return null as info
    const res = await client.query(
      `SELECT ${dbTables.users}.username, ${dbTables.cf_cache}.info FROM ${dbTables.cf_cache} FULL OUTER JOIN ${dbTables.users} ON ${dbTables.cf_cache}.username = ${dbTables.users}.username`
    );
    const users = res.rows.map(row => {
      return {
        username: row.username,
        info: row.info ? row.info : null
      }
    });
    return NextResponse.json({users: users});
  }catch{
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
