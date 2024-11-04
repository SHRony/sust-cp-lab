import { getUserInfo, isLoggedIn } from "@/app/api/queries/user_queries";
import Settings from './client';

export default async function Page() {
  const user = await isLoggedIn();
  if (!user) return <div>Something went wrong, please refresh the page.</div>;
  if (user.userType !== 'student') return <div>Settings are only available for students.</div>;

  const userInfo = await getUserInfo(user.userName);
  if (!userInfo) return <div>Something went wrong, please refresh the page.</div>;

  // Pass userInfo as props to Settings if it exists
  return <Settings user={userInfo} />;
}
