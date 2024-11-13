'use client'
import React, { useState } from "react";
import Image from "next/image";
import TextField from "@/app/ui/input/TextField";
import SubmitButton from "@/app/ui/buttons/SubmitButton";
import Link from "next/link";
import regIcon from "@/public/lock.svg";
import axios from 'axios';
import Card from "../ui/cards/Card";
import spinnerIcon from '@/public/spinner.gif'
import loaderIcon from '@/public/loader.gif'


export default function Register() {
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errorSource, setErrorSource] = useState('');
  function handleUserNameChange(e:React.ChangeEvent<HTMLInputElement>){
    if(errorSource == 'username') setError(''), setErrorSource('');
    setUserName(e.target.value);
  }
  function handleFullNameChange(e:React.ChangeEvent<HTMLInputElement>){
    if(errorSource == 'fullName') setError(''), setErrorSource('');
    setFullName(e.target.value);
  }
  function handleRegistrationNumberChange(e:React.ChangeEvent<HTMLInputElement>){
    if(errorSource == 'registrationNumber') setError(''), setErrorSource('');
    setRegistrationNumber(e.target.value);
  }
  function handleEmailChange(e:React.ChangeEvent<HTMLInputElement>){
    if(errorSource == 'email') setError(''), setErrorSource('');
    setEmail(e.target.value);
  }
  function handlePasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    if(errorSource == 'password') setError(''), setErrorSource('');
    setPassword(e.target.value);
  }
  function handleConfirmPasswordChange(e:React.ChangeEvent<HTMLInputElement>){
    if(errorSource == 'confirmPassword') setError(''), setErrorSource('');
    setConfirmPassword(e.target.value);
  }
  const validate = async () => {
    // add the validation logic here
    if(userName.length < 3){
      setError('Username must be at least 3 characters'), setErrorSource('username');
      return false;
    }
    // username can't have white spaces or special characters other than _
    if(userName != userName.replace(/[^a-zA-Z0-9_]/g, '')){
      setError('Username only have alphanumeric and _'), setErrorSource('username');
      return false;
    }
    if(fullName.length < 3){
      setError('Full name must be at least 3 characters'), setErrorSource('fullName');
      return false;
    }
    // full name can only have alphanumeric and spaces and .
    if(fullName != fullName.replace(/[^a-zA-Z0-9 .]/g, '')){
      setError('Full name only have alphanumeric, spaces and dots'), setErrorSource('fullName');
      return false;
    }
    if(registrationNumber.length < 3){
      setError('Registration number must be at least 3 characters'), setErrorSource('registrationNumber');
      return false;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(email)){
      setError('Invalid email'), setErrorSource('email');
      return false;
    }
    if(password.length < 3){
      setError('Password must be at least 3 characters'), setErrorSource('password');
      return false;
    }
    if(password != confirmPassword){
      setError('Passwords do not match'), setErrorSource('confirmPassword');
      return false;
    }    
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
        console.log(res.data);
        setSuccess(true);
        window.location.href = '/login';
      }else{
        console.log(res);
        alert('please try again');
      }
    } catch (error) {
      try{
         if (axios.isAxiosError(error) && error.response && error.response.data) {
          const errorData = error.response.data as { error: string };
          if (errorData.error === "username already exists") {
            setError('username already exists');
            setErrorSource('username');
          } else if (errorData.error === "email already exists") {
            setError('email already exists');
            setErrorSource('email');
          }
          else{
            alert('Unknown error, report to admin');
          }
        }

      }catch(e){
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
  return <div className="w-full flex justify-center items-strech py-10">
      <Card className="flex flex-row items-center items-strech rounded bg-white tablet:h-[44rem] rounded-xl overflow-hidden">
        <div style={{backgroundColor : 'var(--primary)'}} className="w-90 hidden tablet:flex flex-col h-full items-center justify-center mr-6">
          <p className="text-xl text-white">Welcome to </p>
          <p className="text-2xl text-white">SUST CP Lab </p>
          <div style={{backgroundColor : 'var(--primary)', transform : 'translateX(10.5rem) rotate(45deg)'}} className="absolute h-12 w-12 rotate-45"></div>
        </div>
        <div className="flex flex-col w-90 tablet:w-96 p-5 gap-5 bg-white relative text-gray-600">
          <div className="flex flex-row text-2xl font-bold items-center justify-center">
            <Image 
              src={regIcon}
              height={26}
              width={26}
              alt=""
            >

            </Image>
            <p className="pl-5 text-gray-700">
            Register
            </p>
          </div>
          <TextField
            label="User name"
            onChange={handleUserNameChange}
            value={userName}
            errorMessage={errorSource == 'username' ? error : undefined}
            
          />
          <TextField
            label="Full Name"
            onChange={handleFullNameChange}
            value={fullName}
            errorMessage={errorSource == 'fullName' ? error : undefined}
          />
          <TextField
            type="number"
            label="Registration Number"
            onChange={handleRegistrationNumberChange}
            value={registrationNumber}
            errorMessage={errorSource == 'registrationNumber' ? error : undefined}
          />
          <TextField
            type="email"
            label="Email"
            onChange={handleEmailChange}
            value={email}
            errorMessage={errorSource == 'email' ? error : undefined}
          />
          <TextField
            label="Password"
            type="password"
            onChange={handlePasswordChange}
            value={password}
            errorMessage={errorSource == 'password' ? error : undefined}
          />
          <TextField
            label="Confirm Password"
            type="password"
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
            errorMessage={errorSource == 'confirmPassword' ? error : undefined}
          />
          <SubmitButton clickHandler={handleSubmit} disabled={loading}>
              <div className="flex w-full items-center justify-center p-1 gap-2">{loading ? <Image src={spinnerIcon} height={24} width={24} alt="loading"/> : <></>}Create Account</div>
            </SubmitButton>
          <p>Already have an account ? <Link href={'login'}>Log In</Link></p>
        </div>
      </Card>
  </div>
}
