import { NextResponse, NextRequest } from "next/server";
import { updateVjudgeHandle } from '@/app/api/queries/user_queries';
export async function POST(request:NextRequest) {
  // // write code to update vjudge handle
  try{
     await tryToUpdateVjudgeHandle(request);
    return NextResponse.json({ message: "Vjudge handle updated successfully" });  
  }catch{
    console.error("Error updating vjudge handle");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function tryToUpdateVjudgeHandle(request:NextRequest) {
  const {vjudgeHandle, userName} = await request.json();
  await updateVjudgeHandle(vjudgeHandle, userName);
}