import { NextRequest, NextResponse } from "next/server";
import { contestType } from "@/app/lib/types";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/app/api/dbclient";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_API_KEY!,
  api_secret: process.env.CLOUD_API_SECRET!,
});

export async function POST(request: NextRequest) {
  const contest: contestType = await request.json();  
  try {
    await tryToCreateContest(contest);
    return NextResponse.json({ message: "Contest created successfully" });  
  } catch (error) {
    console.error("Error creating contest:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


const tryToCreateContest = async (contest: contestType) => {
  contest.poster = await generatePosterUrl(contest);
  await prisma.sust_cp_lab_contests.create({
    data: contest
  });
}

async function generatePosterUrl(contest: contestType) {
  if(contest.poster && isValidDataURL(contest.poster)){
    try {
      const imageUploadResult = await cloudinary.uploader.upload(contest.poster);
      return imageUploadResult.secure_url;
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
}

const isValidDataURL = (dataURL: string) => {
  const regex = /^data:([a-z]+\/[a-z]+(;[a-z\-]+=[a-z\-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@\/?%\s]*$/i;
  return !!dataURL.match(regex);
};