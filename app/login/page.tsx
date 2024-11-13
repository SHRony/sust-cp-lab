'use client'
import React, { useState } from "react";
import TextField from "@/app/ui/input/TextField";
import { Button } from "@mui/material";
import lockIcon from '@/public/lock.svg'
import Image from "next/image";
import Link from "next/link";
import SubmitButton from "../ui/buttons/SubmitButton";
import axios from "axios";
import { authContext } from "../lib/AuthProvider";
import Card from "../ui/cards/Card";
import spinnerIcon from '@/public/spinner.gif'
import loaderIcon from '@/public/loader.gif'
export default function LogIn(){
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const auth = React.useContext(authContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errorSource, setErrorSource] = useState('');
  function handleUserChange(e:React.ChangeEvent<HTMLInputElement>){
    if(errorSource == 'username') setError(''), setErrorSource('');
    setUserName(e.target.value);
  }
  function handlePasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    if(errorSource == 'password') setError(''), setErrorSource('');
    setPassword(e.target.value);
  }
  const validate = () => {
    // add the validation logic for the form here
    if(userName == ''){
      setError('username required'), setErrorSource('username');
      return false;
    }
    if(password.length < 3){
      setError('Password must be at least 3 characters'), setErrorSource('password');
      return false;
    }
    return true;
  }
  async function handleSubmit(){
    setLoading(true);
    const isValid = validate();
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
      try{
        if (axios.isAxiosError(error) && error.response && error.response.data) {
          const errorData = error.response.data as { error: string };
          if (errorData.error === "Incorrect password") {
            setError('Incorrect password');
            setErrorSource('password');
          } else if (errorData.error === "User not found") {
            setError('User not found');
            setErrorSource('username');
          }else{
            alert('Unknown error, report to admin');
          }
        }
      }
      catch(e){
        alert('Unknown error, report to admin');
      }
    }
    setLoading(false);
    

  }
  if(success) {
    return <div className="w-full h-full flex justify-center items-center my-40">
      <Image src={loaderIcon} alt="loader" />
    </div>
  }
  return <div className="w-full h-full flex justify-center items-center">
      <Card className="flex flex-row items-center rounded bg-white h-96 rounded-xl overflow-hidden">
        <div style={{backgroundColor : 'var(--primary)'}} className="hidden tablet:flex w-90 flex flex-col h-full items-center justify-center mr-6 text-gray-600">
          <p className="text-xl text-white">Welcome to </p>
          <p className="text-2xl text-white">SUST CP Lab </p>
          <div className="absolute h-12 w-12 rotate-45 bg-primary transform translate-x-[10.5rem]" style={{transform: 'translateX(10.5rem) rotate(45deg)'}}></div>
        </div>
        <div className="flex flex-col w-90 tablet:w-96 gap-5 py-2 px-5 bg-white">
          <div className="flex flex-col items-center rounded gap-5">
            <div className="flex flex-row text-2xl font-bold items-center">
              <Image 
                src={lockIcon}
                height={26}
                width={26}
                alt=""
              >

              </Image>
              <p className="pl-5 text-gray-800">
              Login
              </p>
            </div>
            <TextField
              label="User name"
              onChange={handleUserChange}
              value={userName}
              errorMessage={errorSource == 'username' ? error : undefined}
            />
            <TextField
              label="Password"
              type = "password"
              onChange={handlePasswordChange}
              value={password}
              errorMessage={errorSource == 'password' ? error : undefined}
            />
            <SubmitButton clickHandler={handleSubmit} disabled={loading}>
              <div className="flex w-full items-center justify-center p-1 gap-2">{loading ? <Image src={spinnerIcon} height={24} width={24} alt="loading"/> : <></>}Sign In</div>
            </SubmitButton>
            <p>Dont have an account ? <Link href={'registration'}>Sign UP</Link></p>
          </div>
        </div>
      </Card>
  </div>
}
