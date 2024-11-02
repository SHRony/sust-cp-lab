"use client"

import { $Enums } from "@prisma/client";
import { usePathname } from "next/navigation";
import AuthProvider from "./lib/AuthProvider";
import SideNav from "./ui/nav/side-nav";
import { useRouter } from 'next/router';


const LayoutWrapper = ({ user, children }: {
user:{
    userName: string;
    userType: $Enums.user_type | null;
} | null,  
children: React.ReactNode }) => {
    const pathname = usePathname();
    if(pathname == "/login" || pathname == "/register" || pathname == "/") return <AuthProvider userProps={user}>{children}</AuthProvider>;
    return (
        <AuthProvider userProps={user}>
          <div className="p-4 flex flex-row h-screen w-screen bg-gray-100 gap-4">
          <SideNav/>
          <div className="flex flex-col grow h-full overflow-y-scroll bg-white rounded-xl [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500" >
            {children}
          </div>
          </div>
        </AuthProvider>
    )
}
export default LayoutWrapper;