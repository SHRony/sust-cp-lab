import React from "react";
import NavButton from '@/app/ui/buttons/NavButton';
import logoutIcon from '@/public/logout_white.png'
import profileIcon from '@/public/profile.svg'
import Image from "next/image";
import isLoggedIn from "@/app/utils/isLoggedIn";
export default function NavBar(){
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
    <NavButton url="" type="icon">
        <Image
          src={profileIcon}
          width={25}
          height={25}
          className="block"
          alt="Profile"
        />
      </NavButton>
      <NavButton url="" type="icon">
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
  return <div style={{backgroundColor : 'var(--surfaceContainer)'}} className='h-20 flex flex-row justify-between items-center w-full p-1'>
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
      {isLoggedIn() ? logOutButtonSet() : logInButtonSet()}
    </div>
  </div>
}