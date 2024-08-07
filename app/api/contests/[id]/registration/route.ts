import prisma from "@/app/api/dbclient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
  try{
    const contestId = getContestId(request);
    if(!contestId || contestId == -1) return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const {username} = await request.json();
    if(!username || username == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    await performContestRegistration(contestId, username);
    return NextResponse.json({ message: 'Contest registration successful' });  
  }catch{
    console.error("Error registering for contest");
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
function getContestId(request:NextRequest){
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

async function performContestRegistration(contestId:number, username:string){
  await prisma.sust_cp_lab_contestregistrations.create({
    data: {
      contest_id: contestId,
      user_name: username
    }
  });
}