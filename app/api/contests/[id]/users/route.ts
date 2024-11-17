import { getContestUsers } from "@/app/api/queries/contest_queries";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
  try{
    const contestId = getContestId(request);
    return await tryToGetContestUsers(contestId);
  }catch(e){
    console.log(e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
const getContestId = (request:NextRequest) => {
  const tmp = request.nextUrl.pathname.split('/');
  tmp.pop();
  let contestId = -1;
  try{
    contestId = Number(tmp.pop());
  }catch{
    contestId = -1;
  }
  return contestId;
}
async function tryToGetContestUsers(contestId:number){
  if(!contestId || contestId == -1) return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
  const users = await getContestUsers(contestId);
  return NextResponse.json({users: users});
}