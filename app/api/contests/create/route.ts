import { NextRequest, NextResponse } from "next/server";
import { contestType } from "@/app/lib/types";
import { v2 as cloudinary } from "cloudinary";
import dbclient from "@/app/api/dbclient";
import dbTables from "@/app/lib/dbTables";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_API_KEY!,
  api_secret: process.env.CLOUD_API_SECRET!,
});

export async function POST(request: NextRequest) {
  const isValidDataURL = (dataURL: string) => {
    const regex = /^data:([a-z]+\/[a-z]+(;[a-z\-]+=[a-z\-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@\/?%\s]*$/i;
    return !!dataURL.match(regex);
  };
  const contest: contestType = await request.json();  
  if(contest.poster && isValidDataURL(contest.poster)){
    try {
      console.log('')
      if (typeof contest.poster === "string") {
        const result = await cloudinary.uploader.upload(contest.poster);
        contest.poster = result.secure_url;
      } else {
        contest.poster = null;
      }
    } catch (error) {
      console.error("Error creating contest:", error);
      return NextResponse.json({ error: "Error uploading photo" }, { status: 500 });
    }
  } else {
    contest.poster = null;
  }
  try {
    const response = await dbclient.query(`
      INSERT INTO ${dbTables.contests} (name, venue, description, date, type, poster, author) VALUES($1, $2, $3, $4, $5, $6, $7)
    `, [contest.name, contest.venue, contest.description, contest.date, contest.type, contest.poster, contest.author]);
    if(response.rowCount == 0) return NextResponse.json({ error: "Contest not created" }, { status: 500 });
    return NextResponse.json({ message: "Contest created successfully" });  
  } catch (error) {
    console.error("Error creating contest:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  

}

