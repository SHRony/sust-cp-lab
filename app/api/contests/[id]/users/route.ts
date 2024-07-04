import dbclient from "@/app/api/dbclient";
import { getContestUsers } from "@/app/api/queries";
import dbTables from "@/app/lib/dbTables";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
  try{
    const tmp = request.nextUrl.pathname.split('/');
    tmp.pop();
    const id = tmp.pop();
    if(!id || id == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const users = await getContestUsers(id);
    return NextResponse.json({users: users});
  }catch(e){
    console.log(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
