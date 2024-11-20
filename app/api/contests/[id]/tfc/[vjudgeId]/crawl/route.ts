import { NextRequest, NextResponse } from "next/server";
import { crawlAndStoreVjudgeResults } from "@/app/api/queries/add_vjudge_queries";
import { isLoggedIn } from "@/app/api/queries/user_queries";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string, vjudgeId: string } }
) {
    try {
        // Check if user is logged in and is admin/mentor
        const user = await isLoggedIn();
        if (!user || !user.userType || !['admin', 'mentor'].includes(user.userType)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const vjudgeId = params.vjudgeId;
        
        if (!vjudgeId) {
            return NextResponse.json(
                { error: 'VJudge contest ID is required' },
                { status: 400 }
            );
        }

        // Crawl and store the results
        const result = await crawlAndStoreVjudgeResults(vjudgeId);

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Error crawling VJudge results:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to crawl VJudge results' },
            { status: 500 }
        );
    }
}
