// write an api to get list of username and info from dbTables.cf_cache table
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getUsersListWithBsicCFInfo } from '@/app/api/queries/user_queries';
export async function GET(request:NextRequest) {
  try{
    return NextResponse.json({users: getUsersListWithBsicCFInfo()});
  }catch{
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

export { dynamic };
