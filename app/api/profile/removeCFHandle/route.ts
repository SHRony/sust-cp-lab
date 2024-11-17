import { NextRequest, NextResponse } from 'next/server';
import dbTables from '@/app/lib/dbTables';
import client from '@/app/api/dbclient';
import { removeCFHandle } from '../../queries/cf_queries';

export async function POST(request: NextRequest) {
  try {
    const { cfHandle, userName } = await request.json();
    
    if (!cfHandle || !userName) {
      return NextResponse.json(
        { error: "CF handle and username are required" },
        { status: 400 }
      );
    }

    await removeCFHandle(cfHandle, userName);
    return NextResponse.json({ message: "Codeforces handle removed successfully" });
  } catch (error) {
    console.error("Error removing codeforces handle:", error);
    return NextResponse.json(
      { error: "Failed to remove CF handle" },
      { status: 500 }
    );
  }
}
