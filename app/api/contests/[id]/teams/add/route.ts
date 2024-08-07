import prisma from "@/app/api/dbclient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const contestId = getContestId(request);
    if(!contestId || contestId == -1) return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const {name, members} = await request.json();
    const teamId = await addTeamAndGetId(contestId, name, members);
    return NextResponse.json({ id: teamId });
  } catch (error) {
    console.error('Error adding team:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getContestId(request:NextRequest){
  let tmp = request.nextUrl.pathname.split('/');
  tmp.pop();
  tmp.pop();
  let id = -1;
  try{
    id = Number(tmp.pop());
  }catch{
    id = -1;
  }
  return id;
}

async function addTeamAndGetId(contestId:number, name:string, members:string[]) {
  let teamId = -1;
  await prisma.$transaction(async (prisma) => {
    const team = await prisma.sust_cp_lab_teams.create({
      data: {
        name: name,
        contest: contestId
      }
    });

    teamId = team.id;
    await prisma.sust_cp_lab_team_members.createMany({
      data: members.map((member) => ({
        team_id: team.id,
        user_name: member
      }))
    })
  });
  return teamId;
}