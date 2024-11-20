import { NextResponse } from "next/server";
import { getTfcRanks } from "@/app/api/queries/add_vjudge_queries";
import { TFCRanksType } from "@/app/ui/tfc/TFCRanks";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contestId = parseInt(params.id);
    if (isNaN(contestId)) {
      return NextResponse.json(
        { error: "Invalid contest ID" },
        { status: 400 }
      );
    }

    const tfcRanks = await getTfcRanks(contestId);
    
    // Transform the data to match TFCRanksType
    const transformedRanks: TFCRanksType[] = tfcRanks.map(tfc => ({
      id: tfc.tfc_id.toString(),
      name: tfc.tfc_name,
      ranks: tfc.rankings.map(rank => ({
        rank: rank.rank,
        username: rank.username,
        solved: rank.solved,
        penalty: rank.penalty,
        problems: rank.problems
      })),
      problems: tfc.problems
    }));

    return NextResponse.json(transformedRanks);
  } catch (error) {
    console.error("Error fetching TFC ranks:", error);
    return NextResponse.json(
      { error: "Failed to fetch TFC ranks" },
      { status: 500 }
    );
  }
}
