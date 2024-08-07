import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/dbclient";

export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
  try{
    const id = getContestId(request);
    if(!id || id == -1) return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const {username} = await request.json() as {username: string};
    const registrationInfo = prisma.sust_cp_lab_contestregistrations.findUnique({
      where: {
        contest_id_user_name: {
          contest_id: id,
          user_name: username
        }
      }
    });
    if(!registrationInfo) return NextResponse.json({ registered: false });
    return NextResponse.json({ registered: true });  
  }catch{
    console.error("Error checking registration");
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getContestId(request:NextRequest) {
  let contestId = -1;
  try{ 
    let id = request.nextUrl.pathname.split('/').pop();
    contestId = parseInt(id!);
  }catch{
    contestId = -1;
  }
  return contestId;
}