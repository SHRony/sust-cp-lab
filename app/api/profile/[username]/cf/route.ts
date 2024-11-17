import prisma from "@/app/api/dbclient";
import { NextRequest, NextResponse } from "next/server";
import { getCFInfo } from "@/app/api/queries/cf_queries";
export const dynamic = 'force-dynamic';
import { addCFCache } from "@/app/api/queries/cf_queries";
export async function GET(request:NextRequest) {
  ;
  try{
    let tmp = request.nextUrl.pathname.split('/');
    tmp.pop();
    const username = tmp.pop();
    if(!username || username == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const response = await prisma.sust_cp_lab_cf_handles.findMany({ where: { username: username } });
    const cfHandles = response.map((row) => row.handle);
    let user = await getCFInfo(cfHandles);
    try{
      addCFCache(username, user);
    }catch(e){
      console.log(e);
    }
    return NextResponse.json({user: user});
  }catch(e){
    console.log(e);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
