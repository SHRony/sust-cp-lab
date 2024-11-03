'use client';
import React, { ReactNode, useContext } from "react";
import logoutIcon from '@/public/logout_white.png'
import profileIcon from '@/public/profile.svg'
import Image from "next/image";
import { authContext } from "@/app/lib/AuthProvider";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { usePathname } from "next/navigation";
import { Button, IconButton } from "@mui/material";
import Link from "next/link";
import homeIcon from '@/public/home.svg';
import logo from '@/public/logo.png';
import trophyIcon from '@/public/trophy.svg';
import statIcon from '@/public/stat.svg';
import settingsIcon from '@/public/settings.svg';
import usersIcon from '@/public/users.svg';
import signOutIcon from '@/public/sign-out.svg';
import writeIcon from '@/public/write.svg';

const nvaLinks = [
  {
    url: "/dashboard",
    icon: homeIcon,
    text: "Dashboard"
  }, 
  {
    url: "/contests",
    icon: trophyIcon,
    text: "Contests"
  },
  {
    url: "/cfviz",
    icon: statIcon,
    text: "Cfviz",
  },
  {
    url: "/forum",
    icon: writeIcon,
    text: "Forum",
  },
  {
    url: "/users",
    icon: usersIcon,
    text: "Users"
  }, 
  {
    url: "/profile",
    icon: profileIcon,
    text: "Profile"
  },
  {
    url: "/settings",
    icon: settingsIcon,
    text: "Settings"
  }
  
]
export default function SideNav(){
  const auth = useContext(authContext);
  const handleLogout = async () => {
    await auth?.signOut();
  }
  return <div className='flex flex-col justify-start items-center h-full w-48 bg-white shadow rounded-xl'>
    <div className='flex flex-col justify-start items-center grow text-gray-600 gap-2'>
      <div className="pb-12">
        <Link href="/">
          <div className='flex flex-row justify-begin items-center w-48 text-2xl font-bold text-gray-900 p-4 gap-4'>
            <Image src={logo} alt="" width={30} height={30}/>
            CP-LAB
          </div>
        </Link>
      </div>
      {
        nvaLinks.map((link) => (
          <SideNavButton url={link.url} type="text" key={link.text}>
            <Image src={link.icon} alt="" width={16} height={16}/> {link.text}
          </SideNavButton>
        ))
      }
      
    </div>
    <div className='flex flex-col justify-start items-center'>
        <div className="flex flex-row text-gray-600 w-48 h-12 font-bold items-center gap-2 p-4 hover:bg-blue-100 cursor-pointer" onClick={handleLogout}>
          <Image src={signOutIcon} alt="" width={25} height={25}/>
          Signout
        </div>
      {/* {(!auth || auth.loading) ? <></> : (auth?.signedIn ? logOutButtonSet() : logInButtonSet())} */}
    </div>
  </div>
}

const SideNavButton = ({children, url, type, onClick} : Readonly<{children:ReactNode|string, url : string, type : string, onClick?:() => void | Promise<void> | null}>) =>{
  const pathname = usePathname();
  return (
    <Link href={url} className="w-full">{
      type != 'icon' ? (
        <div className={`flex flex-row text-gray-600 w-48 h-12 font-bold items-center gap-2 p-4 hover:bg-blue-100 ${pathname.startsWith(url) ? 'border-l-2 border-l-blue-600 text-blue-600' : ''}`}>
          {children}
        </div>
      ) : (
        <div className='h-full flex flex-row rounded-full'><IconButton style={{padding : '20px'}} onClick={onClick}>{children}</IconButton></div>
      ) 
    }
    </Link>
  );
}