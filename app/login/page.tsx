'use client'
import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import lockIcon from '@/public/lock.svg'
import Image from "next/image";
import Link from "next/link";
import SubmitButton from "../ui/buttons/SubmitButton";
import axios from "axios";
import { authContext } from "../lib/AuthProvider";
import Card from "../ui/cards/Card";
import spinnerIcon from '@/public/spinner.gif'
export default function LogIn(){
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const auth = React.useContext(authContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  function handleUserChange(e:React.ChangeEvent<HTMLInputElement>){
    setUserName(e.target.value);
  }
  function handlePasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    setPassword(e.target.value);
  }
  const validate = async () => {
    // add the validation logic for the form here
    if(userName == '' || password == '') return false;
    if(password.length < 3) return false;
    return true;
  }
  async function handleSubmit(){
    setLoading(true);
    const isValid = await validate();
    if(!isValid){
      setLoading(false);
      return;
    }
    try {
      if(await auth!.signIn(userName, password)) {
        window.location.href = '/profile';
        setSuccess(true);
      };
      
    } catch (error) {
      console.error("Error registering user:", error);
      alert('please try again');
    }
    setLoading(false);
    

  }
  if(success) {
    return <div className="w-full h-full flex justify-center items-center my-40">
      <div className="h-20 w-20 border-b-2 border-green-500 rounded-full animate-spin"></div>
    </div>
  }
  return <div className="w-full h-full flex justify-center items-strech py-40">
      <Card className="flex flex-row items-center items-strech rounded bg-white">
        <div style={{backgroundColor : 'var(--primary)'}} className="w-90 flex flex-col h-full items-center justify-center mr-6">
          <p className="text-xl text-white">Welcome to </p>
          <p className="text-2xl text-white">SUST CP Lab </p>
          <div style={{backgroundColor : 'var(--primary)', transform : 'translateX(10.5rem) rotate(45deg)'}} className="absolute h-12 w-12 rotate-45"></div>
        </div>
        <div className="flex flex-col w-96 gap-5 p-5 bg-white">
          <div className="flex flex-col items-center rounded gap-5">
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
              <div className="flex w-full items-center justify-center">{loading ? <Image src={spinnerIcon} height={24} width={24} alt="loading"/> : 'Sign In'}</div>
            </SubmitButton>
            <p>Dont have an account ? <Link href={'registration'}>Sign UP</Link></p>
          </div>
        </div>
      </Card>
  </div>
}