import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/dbclient";

export async function POST(request:NextRequest) {
const {id} = await request.json();
// console.log(id);
  try{
    
    if(!id || id == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    await prisma.sust_cp_lab_contests.delete({
      where: {
        id
      }
    });
    
    return NextResponse.json({ message: "Contest deleted successfully" });  
  }catch(e){
    console.log(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
