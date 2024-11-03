// 652225

import { NextResponse, NextRequest } from "next/server";
import { cfUserType } from "@/app/lib/types";
import { getCFInfo } from "@/app/api/queries/cf_queries";
export const dynamic = 'force-dynamic';





export async function GET(request:NextRequest) {
  try{
    const userResponse = await fetch("https://vjudge.net/contest/652225");
  }catch(e){
    console.log(e);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
