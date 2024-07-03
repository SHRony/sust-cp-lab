import client from "@/app/api/dbclient";
import dbTables from "@/app/lib/dbTables";
import { cfUserType } from "@/app/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getCFInfo } from "@/app/api/queries";
export const dynamic = 'force-dynamic';
async function addCFCache(username:string, cfUser:any) {
  console.log(username);
  cfUser.calenderSubmissions = [], cfUser.diffData = [], cfUser.catData = [], cfUser.ratingChanges = {labels: [], datasets: []}, cfUser.acTime = [];
    if(!username || !cfUser) return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    let info = JSON.stringify(cfUser);
    const response = await client.query(`
      INSERT INTO ${dbTables.cf_cache} (username, info) VALUES($1, $2)
      ON CONFLICT (username) DO UPDATE SET info = EXCLUDED.info
    `, [username, info]);
    if(response.rowCount == 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "Codeforces handle added successfully" });  
  }

export async function GET(request:NextRequest) {
  ;
  try{
    let tmp = request.nextUrl.pathname.split('/');
    tmp.pop();
    const username = tmp.pop();
    if(!username || username == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const response = await client.query(`SELECT handle FROM ${dbTables.cf_handles} WHERE username = $1`, [username]);
    // console.log(name);
    // if(response.rowCount == 0) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const cfHandles = response.rows.map((row) => row.handle);
    let user = await getCFInfo(cfHandles);
    // addCFCache(username, user);
    return NextResponse.json({user: user});
  }catch(e){
    console.log(e);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
