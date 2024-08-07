import { getRegisteredContests } from "@/app/api/queries/contest_queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
  try{
    let tmp = request.nextUrl.pathname.split('/');
    tmp.pop();
    const username = tmp.pop();
    if(!username || username == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const ret = await getRegisteredContests(username);
    return NextResponse.json({contests: ret});
  }catch(e){
    console.log(e);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
