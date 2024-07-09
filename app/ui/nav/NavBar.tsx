'use client';
import React, { useContext, useEffect } from "react";
import NavButton from '@/app/ui/buttons/NavButton';
import logoutIcon from '@/public/logout_white.png'
import profileIcon from '@/public/profile.svg'
import Image from "next/image";
import { authContext } from "@/app/lib/AuthProvider";
import AccessProvider from "@/app/lib/AccessProvider";
import Brightness4Icon from '@mui/icons-material/Brightness4';
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
      <NavButton url="" type="icon" onClick={() => {document.body.classList.toggle('theme-dark'), document.body.classList.toggle('theme-light')}}>
        <Brightness4Icon sx={{color: 'white'}} />
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
      <NavButton url="" type="icon" onClick={() => {document.body.classList.toggle('theme-dark'), document.body.classList.toggle('theme-light')}}>
        <Brightness4Icon sx={{color: 'white'}} />
      </NavButton>
    </>
  }
  // useEffect(() => {
  //   console.log(auth);
  // },[auth])
  return <div className='bg-nav h-20 flex flex-row justify-between items-center w-full p-1 tablet:px-4 laptop:px-16'>
    <div className='h-full flex flex-row justify-evenly items-center mobile:gap-0 tablet:gap-2 laptop:gap-8'>
      <NavButton url="/" type="text">
        Home
      </NavButton>
      <NavButton url="/contests" type="text">
        Contests
      </NavButton>
      <NavButton url="/cfviz" type="text">
        CF Viz
      </NavButton>
      <NavButton url="" type="text">
        Forum
      </NavButton>
      <NavButton url="/users" type="text">
        Users
      </NavButton>
      
    </div>
    <div className='h-full flex flex-row justify-evenly items-center'>
      {/* {<AccessProvider permittedUsers={['admin', 'student', 'mentor', 'pending_mentor']}>{logOutButtonSet()}</AccessProvider>}
      {<AccessProvider permittedUsers={[]}>{logInButtonSet()}</AccessProvider>} */}

      {(!auth || auth.loading) ? <></> : (auth?.signedIn ? logOutButtonSet() : logInButtonSet())}
    </div>
  </div>
}