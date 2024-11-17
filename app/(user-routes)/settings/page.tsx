import { getUserInfo, isLoggedIn } from "@/app/api/queries/user_queries";
import Settings from './client';
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await isLoggedIn();
  if (!user) redirect('/login');
  if (user.userType !== 'student') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <svg 
                className="w-8 h-8 text-yellow-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">
            Settings are only available for students. If you believe this is an error, please contact an administrator.
          </p>
        </div>
      </div>
    );
  }

  const userInfo = await getUserInfo(user.userName);
  if (!userInfo) return <div>Something went wrong, please refresh the page.</div>;

  // Pass userInfo as props to Settings if it exists
  return <Settings user={userInfo} />;
}
