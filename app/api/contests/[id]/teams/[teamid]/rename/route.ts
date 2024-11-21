import { NextResponse } from "next/server";
import prisma from "@/app/api/dbclient";

export async function POST(
  request: Request,
  { params }: { params: { id: string; teamid: string } }
) {
  try {
    const { name } = await request.json();
    
    // Validate input
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: "Invalid team name" },
        { status: 400 }
      );
    }

    // Update team name
    const updatedTeam = await prisma.sust_cp_lab_teams.update({
      where: {
        id: parseInt(params.teamid),
        contest: parseInt(params.id)     
      },
      data: {
        name: name
      }
    });
    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error('Error renaming team:', error);
    return NextResponse.json(
      { error: "Failed to rename team" },
      { status: 500 }
    );
  }
}
