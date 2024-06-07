// write an api to get list of username and info from dbTables.cf_cache table
import { NextRequest, NextResponse } from 'next/server';
import dbTables from '@/app/lib/dbTables';
import client from '@/app/api/dbclient';
export async function GET(request:NextRequest) {
  try{
    const response = await client.query(`
      SELECT username, info FROM ${dbTables.cf_cache}
    `);
    return NextResponse.json({users: response.rows});
  }catch{
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
