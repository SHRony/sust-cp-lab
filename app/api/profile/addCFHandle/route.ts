import { NextRequest, NextResponse } from 'next/server';
import { addCFHandle } from '@/app/api/queries/cf_queries';

//post function for adding codeforces handle
export async function POST(request:NextRequest) {
  try{
    await tryToAddCFHandle(request);
    return NextResponse.json({ message: "Codeforces handle added successfully" }); 
  }
  catch{
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
async function tryToAddCFHandle(request:NextRequest) {
  const {cfHandle, userName} = await request.json();
  await addCFHandle(cfHandle, userName);
 
}