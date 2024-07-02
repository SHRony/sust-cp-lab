import dbTables from "@/app/lib/dbTables";
import { NextRequest, NextResponse } from "next/server";
import dbclient from "../../dbclient";

export async function POST(request:NextRequest) {
  try{
    const data = await request.json();
    const id = data.id;
    const response = await dbclient.query(`
      DELETE FROM ${dbTables.contests} WHERE id = $1
    `, [id]);
    if(response.rowCount == 0) return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    return NextResponse.json({ message: "Contest deleted successfully" });  
  }catch{
    console.error("Error deleting contest");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
