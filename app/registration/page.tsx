'use client'
import React, { useState } from "react";
import Image from "next/image";
import { TextField } from "@mui/material";
import SubmitButton from "@/app/ui/buttons/SubmitButton";
import Link from "next/link";
import regIcon from "@/public/registration.svg";
import axios from 'axios';
import Card from "../ui/cards/Card";
export default function Register() {
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
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
  function handlePasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    setPassword(e.target.value);
  }
  function handleConfirmPasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    setConfirmPassword(e.target.value);
  }
  const validate = () => {
    return true;
  }
  async function handleSubmit(){
    if(!validate()) return;
    axios.post('/api/registration', {
      userName: userName,
      fullName: fullName,
      registrationNumber: registrationNumber,
      email: email,
      password: password,
    });
  }

  return <div className="w-full h-full flex justify-center items-strech py-10">
      <Card className="flex flex-row items-center items-strech rounded bg-white">
        <div style={{backgroundColor : 'var(--primary)'}} className="w-90 flex flex-col h-full items-center justify-center mr-6">
          <p className="text-xl text-white">Welcome to </p>
          <p className="text-2xl text-white">SUST CP Lab </p>
          <div style={{backgroundColor : 'var(--primary)', transform : 'translateX(10.5rem) rotate(45deg)'}} className="absolute h-12 w-12 rotate-45"></div>
        </div>
        <div className="flex flex-col w-96 p-5 gap-5 bg-white relative">
          <div className="flex flex-row text-2xl font-bold items-center justify-center">
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
            <div className="w-full">Register</div>
          </SubmitButton>
          <p>Already have an account ? <Link href={'login'}>Log In</Link></p>
        </div>
      </Card>
  </div>
}
