// write get api to get the info object from cf_cache table by username
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/api/dbclient';
export const dynamic = 'force-dynamic';

export async function GET(request:NextRequest) {
  try{
    const info = await tryToGetLazyCFInfo(request);
    return NextResponse.json({info: info});
  }catch{
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

async function tryToGetLazyCFInfo(request:NextRequest) {
  const {username} = await request.json();
  const info = await prisma.sust_cp_lab_cf_cache.findUnique({where: {username: username}});
  return info?.info || null;
}