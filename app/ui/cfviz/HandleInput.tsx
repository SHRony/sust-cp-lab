'use client';
import React, { useState } from "react";
import Image from "next/image";
import cfLogo from "@/public/cf.svg";
import TextField from '@mui/material/TextField';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import { Button, CircularProgress, IconButton, Snackbar, SnackbarContent } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { cfUserType } from "@/app/lib/types";
import Card from "../cards/Card";

export default function HandleInput({changeUser}:Readonly<{changeUser: (newUser: cfUserType | null) => void;}>) {
  const [input, setInput] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  function handleChange(e:React.ChangeEvent<HTMLInputElement>){
   setInput (e.target.value);
  };
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpen(false);
    if (reason === 'clickaway') {
      return;
    }
  };
  const snackBarAction = (
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
    try{
      changeUser(await fetchCFStats(input));
    }catch(e){
      console.log(e);
    }
    setLoading(false);
  }

  return (
    <Card style={null} className="
    flex flex-col justify-between items-center bg-card w-170 rounded pb-32">
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
            />
        </Box>
        <div className="ml-5 flex justify-center items-center translate-y-1">
          <ShowStatsButton isLoading={isLoading} handleClick={handleSubmit}/>
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
          action={snackBarAction}
          className="bg-red-600 bg-opacity-80"
        />
      </Snackbar>
    </Card>
  );
}


function ShowStatsButton({isLoading, handleClick}:{isLoading: boolean, handleClick: () => void}) {
  if (!isLoading) {
    return (
      <Button
        size="small"
        aria-label="search"
        onClick={handleClick}
        variant="contained"
        color="primary"
      >
        <SearchIcon fontSize="small" />
        Show stats
      </Button>
    )
  }else{
    return (
      <Button
        size="small"
        aria-label="search"
        onClick={handleClick}
        variant="contained"
        color="primary"
        disabled
      >
        <CircularProgress size={16} color="inherit" sx={{ mr: 2 }} />
          Loading...
      </Button>
    )
  }
}

async function fetchCFStats(inputHandles: string) {
  const res = await fetch(`/api/external/cfuserinfo?user=${inputHandles}`);
  return await res.json();
}