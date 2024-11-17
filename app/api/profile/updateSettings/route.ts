import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/api/dbclient';
import { cookies } from 'next/headers';
import { isLoggedIn } from '@/app/api/queries/user_queries';

export async function POST(request: NextRequest) {
  try {
    const user = await isLoggedIn();
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { userName, fullName, phone, vjudgeHandle } = await request.json();

    // Verify the user is updating their own profile
    if (user.userName !== userName) {
      return NextResponse.json(
        { error: 'Not authorized to update this profile' },
        { status: 403 }
      );
    }

    // Update user info in student_info table
    const updatedStudentInfo = await prisma.sust_cp_lab_student_info.upsert({
      where: {
        username: userName
      },
      create: {
        username: userName,
        full_name: fullName,
        registration_no: user.registrationNumber || '',
        vjudge_handle: vjudgeHandle
      },
      update: {
        full_name: fullName,
        vjudge_handle: vjudgeHandle
      }
    });

    return NextResponse.json({
      message: 'Settings updated successfully',
      user: {
        ...user,
        fullName: updatedStudentInfo.full_name,
        vjudgeHandle: updatedStudentInfo.vjudge_handle
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
