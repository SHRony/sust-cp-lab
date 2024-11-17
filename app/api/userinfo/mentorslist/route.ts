import { NextRequest, NextResponse } from "next/server";
import prisma from '@/app/api/dbclient';
export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
  try {
    const mentors = await getMentorUsers();
    return NextResponse.json({users: mentors});
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

async function getMentorUsers() {
  const mentors = await prisma.sust_cp_lab_users.findMany({
    where: {
      user_type: {
        in: ['mentor', 'pending_mentor', 'admin']
      }
    },
    orderBy: {
      username: 'asc'
    }
  });
  return mentors;
}