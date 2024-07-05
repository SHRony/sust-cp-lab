import dbTables from "@/app/lib/dbTables";
import { NextRequest, NextResponse } from "next/server";
import dbclient from "@/app/api/dbclient";

export async function POST(request:NextRequest) {
const {id} = await request.json();
// console.log(id);
  try{
    
    if(!id || id == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const response = await dbclient.query(`
      DELETE FROM ${dbTables.contests} WHERE id = $1
    `, [id]);
    
    return NextResponse.json({ message: "Contest deleted successfully" });  
  }catch(e){
    console.log(e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
