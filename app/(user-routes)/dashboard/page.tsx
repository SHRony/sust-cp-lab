import { isLoggedIn } from "@/app/api/queries/user_queries";
import { getCFInfo } from "@/app/api/queries/cf_queries";
import { getContests } from "@/app/api/queries/contest_queries";
import { Suspense } from "react";
import ClientPage from "./ClientPage";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await isLoggedIn();
  if (!user) {
    redirect('/login');
  }

  // Get user's CF info if they have CF handles
  let cfInfo = null;
  if (user.cfHandles && user.cfHandles.length > 0) {
    cfInfo = await getCFInfo(user.cfHandles);
  }

  // Get recent contests
  const contests = await getContests();
  const recentContests = contests.slice(0, 5); // Get 5 most recent contests

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPage user={user} cfInfo={cfInfo} contests={recentContests} />
    </Suspense>
  );
}