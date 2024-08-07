import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/api/dbclient';
export const dynamic = 'force-dynamic';

export async function POST(request:NextRequest) {
  try{
    await tryToCacheCFInfo(request);
    return NextResponse.json({ message: "Codeforces handle added successfully" });  
  }
  catch{
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
async function tryToCacheCFInfo(request:NextRequest) {
  let {username, info} = await request.json();
  info.calenderSubmissions = [], info.diffData = [], info.catData = [], info.ratingChanges = [], info.acTime = [];
  await prisma.sust_cp_lab_cf_cache.upsert({
    create: {
      username: username,
      info: info
    },
    update: {
      info: info
    },
    where: {
      username: username
    }
  });
  
}
