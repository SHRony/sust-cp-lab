import { NextRequest, NextResponse } from 'next/server';
import dbTables from '@/app/lib/dbTables';
import client from '@/app/api/dbclient';
import { removeCFHandle } from '../../queries/cf_queries';

//post function for removing codeforces handle
export async function POST(request:NextRequest) {
  // write code to remove user and codeforces handles from database table dbTables.cf_handles
  const req = await request.json();
  try{
    tryToRemoveCFHandle(request);
    return NextResponse.json({ message: "Codeforces handle removed successfully" });  
  }catch{
    console.error("Error removing codeforces handle");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function tryToRemoveCFHandle(request:NextRequest) {
  const {cfHandle, userName} = await request.json();
  await removeCFHandle(cfHandle, userName);
  
}

