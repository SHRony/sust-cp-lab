import { getContests, getRegisteredContestsList } from "@/app/api/queries/contest_queries";
import { contestType } from "@/app/lib/types";
import Contests from "@/app/contests/ClientPage";
export default async function Page() {
  const contests: contestType[] = (await getContests()) as contestType[] | [];
  const registeredContests: number[] = await getRegisteredContestsList() as number[] | [];
  return (
    <Contests contestsProps={contests} registeredContestsProps = {registeredContests}></Contests>
  );
}

