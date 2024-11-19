import { NextRequest, NextResponse } from "next/server";
import client from "@/app/api/dbclient";
import { getUserInfo, isLoggedIn } from "@/app/api/queries/user_queries";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        let user = await isLoggedIn();
        if (!user || (user.userType !== 'admin' && user.userType !== 'mentor')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { vjudge_id, name } = await req.json();
        
        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Check if contest exists
        const contest = await client.sust_cp_lab_contests.findUnique({
            where: { id: parseInt(params.id) }
        });

        if (!contest) {
            return NextResponse.json({ error: "Contest not found" }, { status: 404 });
        }

        // Create or get vjudge contest
        const vjudgeContest = await client.sust_cp_lab_vjudge_contests.upsert({
            where: { vjudge_id },
            create: {
                vjudge_id,
                is_result_available: false
            },
            update: {}
        });

        // Create team forming contest
        const teamFormingContest = await client.sust_cp_lab_team_forming_contests.create({
            data: {
                name,
                contest_id: contest.id,
                vjudge_contest_id: vjudgeContest.id
            }
        });

        return NextResponse.json(teamFormingContest);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        const tfcs = await client.sust_cp_lab_team_forming_contests.findMany({
            where: { contest_id: parseInt(params.id) }
        });

        return NextResponse.json(tfcs);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
