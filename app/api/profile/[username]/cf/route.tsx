import prisma from "@/app/api/dbclient";
import { NextRequest, NextResponse } from "next/server";
import { getCFInfo } from "@/app/api/queries/cf_queries";
export const dynamic = 'force-dynamic';
export async function addCFCache(username:string, cfUser:any) {
  console.log(username);
  cfUser.calenderSubmissions = [], cfUser.diffData = [], cfUser.catData = [], cfUser.ratingChanges = {labels: [], datasets: []}, cfUser.acTime = [];
    if(!username || !cfUser) return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    let info = JSON.stringify(cfUser);
    const response = await prisma.sust_cp_lab_cf_cache.upsert({
      where: {
        username: username
      },
      create: {
        username: username,
        info: info
      },
      update: {
        username: username,
        info: info
      }
    });
    return NextResponse.json({ message: "Codeforces handle added successfully" });  
  }

export async function GET(request:NextRequest) {
  ;
  try{
    let tmp = request.nextUrl.pathname.split('/');
    tmp.pop();
    const username = tmp.pop();
    if(!username || username == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const response = await prisma.sust_cp_lab_cf_handles.findMany({ where: { username: username } });
    const cfHandles = response.map((row) => row.handle);
    let user = await getCFInfo(cfHandles);
    addCFCache(username, user);
    return NextResponse.json({user: user});
  }catch(e){
    console.log(e);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
