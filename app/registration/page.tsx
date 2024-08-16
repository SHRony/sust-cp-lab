'use client'
import React, { useState } from "react";
import Image from "next/image";
import { TextField } from "@mui/material";
import SubmitButton from "@/app/ui/buttons/SubmitButton";
import Link from "next/link";
import regIcon from "@/public/registration.svg";
import axios from 'axios';
import Card from "../ui/cards/Card";
import spinnerIcon from '@/public/spinner.gif'

export default function Register() {
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
  const validate = async () => {
    // add the validation logic here
    if(password != confirmPassword) return false;
    if(userName == '' || fullName == '' || registrationNumber == '' || email == '' || password == '' || confirmPassword == '') return false;
    //validate email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(email)) return false;
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
      const res = await axios.post('/api/registration', {
        userName: userName,
        fullName: fullName,
        registrationNumber: registrationNumber,
        email: email,
        password: password,
        userType: "student",
      });
      if (res.status == 200) {
        setSuccess(true);
        window.location.href = '/login';
      } else {
        console.log(res.data.error);
        alert('please try again');
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert('please try again');
    }

    setLoading(false);
  }
  if(success) {
    return <div className="w-full h-full flex justify-center items-center my-10">
      <div className="h-20 w-20 border-b-2 border-green-500 rounded-full animate-spin"></div>
    </div>
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
            <div className="flex w-full items-center justify-center">{loading ? <Image src={spinnerIcon} height={24} width={24} alt=""/> : 'Register'}</div>
          </SubmitButton>
          <p>Already have an account ? <Link href={'login'}>Log In</Link></p>
        </div>
      </Card>
  </div>
}
