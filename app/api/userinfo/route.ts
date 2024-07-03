import { NextResponse, NextRequest } from "next/server";
import { getUserInfo } from "../queries";
export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
  try{
    let username = request.nextUrl.searchParams.get('name');
    if(!username || username == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const user = await getUserInfo(username);
    return NextResponse.json({user: user});
  }catch{
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
