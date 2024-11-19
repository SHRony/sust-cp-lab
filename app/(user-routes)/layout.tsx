'use client';
import SideNav from "../ui/nav/side-nav";

export default function Layout({children} : Readonly<{children:React.ReactNode}>){
  return (
    <div className="laptop:p-4 flex flex-row h-screen w-screen bg-gray-100 gap-1 laptop:gap-4">
      <SideNav/>
      <div className="flex flex-col grow h-full overflow-y-scroll bg-white rounded-xl [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500" >
          {children}
      </div>
    </div>
  );
}