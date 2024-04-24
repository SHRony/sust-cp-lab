'use client';
import React, { useState } from "react";
import Image from "next/image";
import cfLogo from "@/public/cf.svg";
import TextField from '@mui/material/TextField';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import SubmitButton from '@/app/ui/buttons/SubmitButton';
import SearchIcon from '@mui/icons-material/Search';
import { useRef } from "react";
import submitIcon from '@/public/plane.png'
import { Button, IconButton, Snackbar, SnackbarContent } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import spinnerIcon from '@/public/spinner.gif'
type userType = Readonly<{
  maxRating: number | string;
  maxRank: string;
  lastActive: string;
  registered: string;
  contribution: number | string;
  avatar : string;
  name : string;
  acTime : {x : number, y : number}[]
}>;

export default function HandleInput({changeUser}:Readonly<{changeUser: (newUser: userType | null) => void;}>) {
  const [input, setInput] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  function handleChange(e:React.ChangeEvent<HTMLInputElement>){
   setInput (e.target.value);
  };
  function startSpinner(){
    setLoading(true);
  }
  function stopSpinner(){
    setLoading(false);
  }
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  
  async function handleSubmit() {
    setLoading(true);
    await fetch(`/api/external/cfuserinfo?user=${input}`).then(
      (res) => {
        if(res.status == 200){
          res.json().then((val) => {
            console.log(val);
            changeUser(val);
          });
        }else{
          setOpen(true);
        }
        
      }
    ).catch(() => {
    });
    setLoading(false);
    
  }
  return (
    <div style={{position:'relative'}} className="relative flex flex-col justify-between items-center bg-white bg-opacity-75 backdrop-blur drop-shadow-3xl w-full max-w-xl h-80 rounded pb-32">
      <Image
        src={cfLogo}
        width={80}
        height={80}
        className="block filter drop-shadow-3xl p-4 mb-5"
        alt="Profile" />
      <div className="flex flex-row items-center justify-center">
        <Box className='shadow-sm' sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          
          <TextField
            label="CF Handles"
            variant="standard"
            onChange={handleChange}
            className="autofill:bg-red-200"
            />
        </Box>
        <div className="ml-5 flex justify-center items-center translate-y-1">
          <SubmitButton clickHandler={handleSubmit}>
            {
              isLoading ? (
                <Image
                  src={spinnerIcon}
                  width={20}
                  height={20}
                  className="mr-2"
                  alt="Profile" />
              ):(
                <Image
                  src={submitIcon}
                  width={20}
                  height={20}
                  className="mr-2"
                  alt="Profile" />
              )
            }
            
            Show stats
          </SubmitButton>
        </div>
      </div>
      <Snackbar
      open={open}
      autoHideDuration={1000}
      onClose={handleClose}
      style={{
        position: 'absolute',
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} 
    >
      <SnackbarContent
        message="Couldn't complete request"
        action={action}
        className="bg-red-600 bg-opacity-80"
      />
  </Snackbar>
    </div>
  );
}
