import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/api/dbclient';
import { user_type } from '@prisma/client';
import { getUserbyName } from '@/app/api/queries/user_queries';

export async function POST(request: NextRequest) {

  try {
    const username = await fetchUserName(request);
    const user = await getUserbyName(username);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const newUserType = determineNewUserType(user.user_type!);
    await updateUserType(username, newUserType);
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

async function fetchUserName(request: NextRequest) {
  const {username} = await request.json();
  return username;
}



function determineNewUserType(currentUserType: user_type) {
  return (currentUserType === 'pending_mentor' ? 'mentor' : 'admin' as user_type);
}

async function updateUserType(username: string, newUserType: user_type) {
  await prisma.sust_cp_lab_users.update({
    where: { username },
    data: { user_type: newUserType },
  });
}