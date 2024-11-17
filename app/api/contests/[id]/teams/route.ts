import { getContestTeams } from "@/app/api/queries/contest_queries";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
  try{
    const contestId = getContestId(request);
    return await tryToGetContestTeams(contestId);
  }catch(e){
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const getContestId = (request:NextRequest) => {
  let tmp = request.nextUrl.pathname.split('/');
  tmp.pop();
  let id = -1;
  try{
    id = Number(tmp.pop());
  }catch{
    id = -1;
  }
  return id;
}

const tryToGetContestTeams = async (contestId:number) => {
  if(!contestId || contestId == -1) return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
  const teams = await getContestTeams(contestId);
  return NextResponse.json(teams);
}