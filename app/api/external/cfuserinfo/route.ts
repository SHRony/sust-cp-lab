import { NextResponse, NextRequest } from "next/server";
import { cfUserType } from "@/app/lib/types";
import { getCFInfo } from "@/app/api/queries/cf_queries";
export const dynamic = 'force-dynamic';





export async function GET(request:NextRequest) {
  try{
    let param = request.nextUrl.searchParams.get('user');
    if(!param){
      let ret:cfUserType = {
        contribution : 0,
        lastActive : 'never',
        maxRating : 0,
        maxRank : 'none',
        registered : 'never',
        avatar : "https://userpic.codeforces.org/no-title.jpg",
        name : "",
        acTime : [],
        calenderSubmissions : [],
        diffData : [],
        catData : [],
        ratingChanges : {labels: [], datasets: []}
      }
      return NextResponse.json(ret);
    }
    const users:string[] = param?.split(",");
    const user = await getCFInfo(users);
    return NextResponse.json(user);
  }catch(e){
    console.log(e);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
