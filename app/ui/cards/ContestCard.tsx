import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "./Card";
import { contestType } from "@/app/lib/types";
import AccessProvider from "@/app/lib/AccessProvider";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton/IconButton";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import axios from "axios";
import { authContext } from "@/app/lib/AuthProvider";
import CircularProgress from '@mui/material/CircularProgress';
import { DirectionAwareHover } from "../aceternity/direction-aware-hover";
export default function ContestCard({ contest, onClose, onRegister, registered, closable = true}: { contest: contestType, onClose: (id: number) => void, onRegister: () => void , registered: boolean, closable?: boolean}) {
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const auth = useContext(authContext);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = async () => {
    try {
      setRemoving(true);
      setOpen(false);
      const res = await axios.post(`/api/contests/delete`, {id : contest.id})
      if(res.status == 200) onClose(contest.id);
      else setRemoving(false);
    } catch(error) {
      console.error(error);
      setRemoving(false);
    }
  }
  const handleCancel = () => {
    handleClose();
  };
  const handleRegister = async () => {
    try {
      const res = await axios.post(`/api/contests/${contest.id}/registration`, { username: auth?.user?.userName || '' });
      if(res.status == 200){
        onRegister();
      }
    } catch (error) {
      console.error('Error registering for contest:', error);
      alert('Error registering for contest. Please try again.');
    }
    
  };
 
  return (
    <>
      <Card
        className={`flex relative flex-col items-start md:items-center gap-4 bg-card h-full z-10 rounded-md overflow-hidden ${
          contest.poster ? "row-span-2" : ""
        }`}
      >
        <div className="bg-card flex absolute right-0 rounded-bl-3xl shadow-2xl border border-gray-300" style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
          {
            closable && <AccessProvider permittedUsers={['admin', '_'+contest.author]}>
             <IconButton onClick={handleOpen} disabled={removing}>
                {removing ? <CircularProgress size={24} /> : <CloseIcon color="error" />}
              </IconButton>
            </AccessProvider>
          }
        </div>
        <Link href={`/contests/${contest.id}`}>

        <div className="min-h-4">
          {contest.poster && (
            <Image
              src={contest.poster}
              alt="Contest logo"
              width={340}
              height={100}
              style={{ width: "340px", maxHeight: "220px",objectFit: "cover" }}
            />
            
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center items-start min-h-48 w-full p-4 overflow-y-scroll gap-3 grow" style={{ scrollbarWidth: "none" }}>
            <h2 className="text-2xl font-bold text-center w-full">{contest.name}</h2>
          <div className="flex flex-col justify-center items-start gap-2">
            <p className="text-lg font-semibold text-dim ">{contest.venue}</p>
            <p className="text-sm text-dim">{contest.description}</p>
            <p className="text-sm text-dim">
              Date: {new Date(contest.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-dim">
              Type: {contest.type}
            </p>
          </div>
        </div>
          
      </Link>
          <div className="w-full flex">
          <AccessProvider permittedUsers={['student']}>
            {registered ? (
              <Button disabled
                variant="outlined"
                startIcon={<CheckIcon />}
                color="success"
              >
                Registered
              </Button>
            ) : (
              <Button variant="outlined" onClick={handleRegister}>
                Register
              </Button>
            )}
          </AccessProvider>
        </div>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Close Contest</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this contest?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

