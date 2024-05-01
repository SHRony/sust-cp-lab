'use client'
import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import lockIcon from '@/public/lock.svg'
import Image from "next/image";
import Link from "next/link";
import SubmitButton from "../ui/buttons/SubmitButton";
export default function LogIn(){
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  
  function handleUserChange(e:React.ChangeEvent<HTMLInputElement>){
    setUserName(e.target.value);
  }
  function handlePasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    setPassword(e.target.value);
  }
  function handleSubmit(){

  }

  return <div className="w-full h-full flex justify-center items-center margin-auto flex-grow">
      <div className="flex flex-col items-center w-400 bg-white bg-opacity-75 backdrop-blur drop-shadow-3xl max-w-xl h-80 rounded p-10 gap-y-5">
        <div className="flex flex-row text-2xl font-bold items-center">
          <Image 
            src={lockIcon}
            height={26}
            width={26}
            alt=""
          >

          </Image>
          <p className="pl-5">
           Login
          </p>
        </div>
      <TextField
        label="User name"
        variant="standard"
        onChange={handleUserChange}
        className="w-full"
      />
      <TextField
        label="Password"
        variant="standard"
        type = "password"
        onChange={handlePasswordChange}
        className="w-full"
      />
      <SubmitButton clickHandler={handleSubmit}>
        <div className="w-300">Login</div>
      </SubmitButton>
      <p>Don't have an account ? <Link href={'registration'}>Sign UP</Link></p>
      </div>
  </div>
}