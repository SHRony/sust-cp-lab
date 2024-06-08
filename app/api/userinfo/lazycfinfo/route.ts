// write get api to get the info object from cf_cache table by username
import { NextRequest, NextResponse } from 'next/server';
import dbTables from '@/app/lib/dbTables';
import client from '@/app/api/dbclient';
export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
  try{
    let username = request.nextUrl.searchParams.get('name');
    if(!username || username == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const response = await client.query(`
      SELECT info FROM ${dbTables.cf_cache} WHERE username = $1
    `, [username]);
    if(response.rowCount == 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const info = (response.rows[0].info);
    return NextResponse.json({info: info});
  }catch{
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}