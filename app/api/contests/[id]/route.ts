import { NextRequest, NextResponse } from "next/server";
import { getContestInfo } from "@/app/api/queries/contest_queries";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const contestId = parseContestId(request);
    return await tryToGetContestInfo(contestId);
  } catch (error) {
    console.error("Error querying database:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const parseContestId = (request:NextRequest) => {
  let tmp = request.nextUrl.pathname.split('/');
  let contestId = -1;
  try{
    contestId = Number(tmp.pop());
  }catch{
    contestId = -1;
  }
  return contestId;
}

const tryToGetContestInfo = async (contestId:number) => {
  if(!contestId || contestId == -1) return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
  const contest = await getContestInfo(contestId);
  return NextResponse.json(contest);
}