// write an api to get list of username and info from dbTables.cf_cache table
import { NextRequest, NextResponse } from 'next/server';
import dbTables from '@/app/lib/dbTables';
import client from '@/app/api/dbclient';
export const dynamic = 'force-dynamic';
import { getUsersList } from '@/app/api/queries';
export async function GET(request:NextRequest) {
  try{
    return NextResponse.json({users: getUsersList()});
  }catch{
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
