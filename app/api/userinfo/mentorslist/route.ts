import { NextRequest, NextResponse } from "next/server";
import prisma from '@/app/api/dbclient';
export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest) {
  try{
    const mentors = getNonStudentUsers();
    return NextResponse.json({users: mentors});
  }catch{
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

async function getNonStudentUsers() {
  const mentors = await prisma.sust_cp_lab_users.findMany(
    {
      where: {
        user_type: {
          not: 'student'
        }
      }
    }
  );
  return mentors;
}