'use client'
import React from "react";
import Image from "next/image";
import cfLogo from "@/public/cf.svg"
import TextField from '@mui/material/TextField';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import SubmitButton from '@/app/ui/buttons/SubmitButton'
import SearchIcon from '@mui/icons-material/Search';
export default function HandleInput(){
  function handleSubmit(){
    console.log("yo bro");
  }
  return (
    <div className="flex flex-col justify-between items-center bg-white bg-opacity-50 backdrop-blur drop-shadow-lg w-full h-48 rounded py-10">
      <Image
        src={cfLogo}
        width={50}
        height={50}
        className="block border-2 border-black rounded-full p-1"
        alt="Profile" 
      />
      <div className="flex flex-row items-center justify-center" >
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField label="CF Handles" variant="standard" />
        </Box>
        <div className="ml-5 flex justify-center items-center translate-y-1">
          <SubmitButton clickHandler={handleSubmit} >
            <SearchIcon className="mr-1"></SearchIcon>
            Show stats
          </SubmitButton>
        </div>
      </div>
    </div>
  )
}