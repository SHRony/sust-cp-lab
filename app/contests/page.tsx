import { getContests } from "@/app/api/queries";
import { contestType } from "@/app/lib/types";
import Contests from "@/app/contests/ClientPage";
export default async function Page() {
  const contests: contestType[] = (await getContests()) as contestType[] | [];
  return (
    <Contests contestsProps={contests}></Contests>
  );
}

