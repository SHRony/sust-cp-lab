'use client';
import React, { useContext } from "react";
import NavButton from '@/app/ui/buttons/NavButton';
import logoutIcon from '@/public/logout_white.png'
import profileIcon from '@/public/profile.svg'
import Image from "next/image";
import { authContext } from "@/app/lib/AuthProvider";
export default function NavBar(){
  const auth = useContext(authContext);
  const handleLogout = async () => {
    await auth?.signOut();
  }
  function logInButtonSet(){
    return <>
      <NavButton url="/login" type="text">
        LogIn
      </NavButton>
      <NavButton url="/registration" type="text">
        Registration
      </NavButton>
    </>
  }
  function logOutButtonSet(){
    return <>
    <NavButton url="/profile" type="icon">
        <Image
          src={profileIcon}
          width={25}
          height={25}
          className="block"
          alt="Profile"
        />
      </NavButton>
      <NavButton url="" type="icon" onClick={handleLogout}>
        <Image
          src={logoutIcon}
          width={25}
          height={25}
          className="block"
          alt="Logout"
          
        />
      </NavButton>
    </>
  }
  return <div style={{backgroundColor : 'var(--primary)'}} className='h-20 flex flex-row justify-between items-center w-full p-1'>
    <div className='h-full flex flex-row justify-evenly items-center px-16'>
      <NavButton url="/" type="text">
        Home
      </NavButton>
      <NavButton url="" type="text">
        Contests
      </NavButton>
      <NavButton url="/cfviz" type="text">
        CF Viz
      </NavButton>
      <NavButton url="" type="text">
        Forum
      </NavButton>
      <NavButton url="" type="text">
        Users
      </NavButton>
      
    </div>
    <div className='h-full flex flex-row justify-evenly items-center px-16'>
      {(!auth || auth.loading) ? <></> : (auth?.signedIn ? logOutButtonSet() : logInButtonSet())}
    </div>
  </div>
}