'use client'
import React, { useState } from "react";
import Image from "next/image";
import { TextField } from "@mui/material";
import SubmitButton from "@/app/ui/buttons/SubmitButton";
import Link from "next/link";
import regIcon from "@/public/registration.svg"
export default function Register() {
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [codeforcesHandle, setCodeforcesHandle] = useState('');
  const [vjudgeHandle, setVjudgeHandle] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleUserNameChange(e:React.ChangeEvent<HTMLInputElement>){
    setUserName(e.target.value);
  }
  function handleFullNameChange(e:React.ChangeEvent<HTMLInputElement>){
    setFullName(e.target.value);
  }
  function handleRegistrationNumberChange(e:React.ChangeEvent<HTMLInputElement>){
    setRegistrationNumber(e.target.value);
  }
  function handleEmailChange(e:React.ChangeEvent<HTMLInputElement>){
    setEmail(e.target.value);
  }
  function handlePhoneNumberChange(e:React.ChangeEvent<HTMLInputElement>){
    setPhoneNumber(e.target.value);
  }
  function handleCodeforcesHandleChange(e:React.ChangeEvent<HTMLInputElement>){
    setCodeforcesHandle(e.target.value);
  }
  function handleVjudgeHandleChange(e:React.ChangeEvent<HTMLInputElement>){
    setVjudgeHandle(e.target.value);
  }
  function handlePasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    setPassword(e.target.value);
  }
  function handleConfirmPasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    setConfirmPassword(e.target.value);
  }
  function handleSubmit(){

  }

  return <div className="w-full h-full flex justify-center items-center margin-auto flex-grow">
      <div className="flex flex-col items-center w-400 bg-white bg-opacity-75 backdrop-blur drop-shadow-3xl max-w-xl rounded p-10 gap-y-5">
        <div className="flex flex-row text-2xl font-bold items-center">
          <Image 
            src={regIcon}
            height={26}
            width={26}
            alt=""
          >

          </Image>
          <p className="pl-5">
           Register
          </p>
        </div>
      <TextField
        label="User name"
        variant="standard"
        onChange={handleUserNameChange}
        className="w-full"
      />
      <TextField
        label="Full Name"
        variant="standard"
        onChange={handleFullNameChange}
        className="w-full"
      />
      <TextField
        label="Registration Number"
        variant="standard"
        onChange={handleRegistrationNumberChange}
        className="w-full"
      />
      <TextField
        label="Email"
        variant="standard"
        onChange={handleEmailChange}
        className="w-full"
      />
      <TextField
        label="Phone number"
        variant="standard"
        onChange={handlePhoneNumberChange}
        className="w-full"
      />
      <TextField
        label="Codeforces Handle"
        variant="standard"
        onChange={handleCodeforcesHandleChange}
        className="w-full"
      />
      <TextField
        label="Vjudge Handle"
        variant="standard"
        onChange={handleVjudgeHandleChange}
        className="w-full"
      />
      <TextField
        label="Password"
        variant="standard"
        type="password"
        onChange={handlePasswordChange}
        className="w-full"
      />
      <TextField
        label="Confirm Password"
        variant="standard"
        type="password"
        onChange={handleConfirmPasswordChange}
        className="w-full"
      />
      <SubmitButton clickHandler={handleSubmit}>
        <div className="w-300">Register</div>
      </SubmitButton>
      <p>Already have an account ? <Link href={'login'}>Log In</Link></p>
      </div>
  </div>
}
