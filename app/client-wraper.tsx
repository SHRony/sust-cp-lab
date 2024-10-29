"use client"

import { $Enums } from "@prisma/client";
import { usePathname } from "next/navigation";
import AuthProvider from "./lib/AuthProvider";
import SideNav from "./ui/nav/side-nav";


const LayoutWrapper = ({ user, children }: {
user:{
    userName: string;
    userType: $Enums.user_type | null;
} | null,  
children: React.ReactNode }) => {
    const pathname = usePathname();
    if(pathname == "/login" || pathname == "/register" || pathname == "/") return <>{children}</>;
    if(user == null){
        window.location.href = '/login';
        return <></>;
    }
    return (
        <AuthProvider userProps={user}>
          <SideNav/>
          <div className="flex flex-col grow h-full overflow-y-scroll bg-white rounded-xl [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500" >
            {children}
          </div>
        </AuthProvider>
    )
}
export default LayoutWrapper;