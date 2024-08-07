import prisma from "@/app/api/dbclient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try{
    const teamId = getTeamId(request);
    if(!teamId || teamId == -1) return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    await deleteTeam(teamId);
    return NextResponse.json({ success: true });
  }catch(e){
    console.error("Error deleting team:", e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getTeamId(request:NextRequest){
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

async function deleteTeam(teamId:number){
  await prisma.$transaction(async (prisma) => {
    await prisma.sust_cp_lab_team_members.deleteMany({
      where: {
        team_id: teamId
      }
    });
    await prisma.sust_cp_lab_teams.delete({
      where: {
        id: teamId
      }
    });
  })
}