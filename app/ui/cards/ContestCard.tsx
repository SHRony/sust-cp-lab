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
        className={`flex relative flex-col items-start md:items-center gap-2 bg-card h-full z-10 rounded-md overflow-hidden ${
          contest.poster ? "row-span-2" : ""
        }`}
      >
        <div className="bg-card flex absolute right-0 rounded-bl-3xl shadow-2xl border border-gray-300">
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
        <div className="flex-1 flex flex-col justify-center items-start w-full p-2 pb-0 overflow-y-scroll grow" style={{ scrollbarWidth: "none" }}>
            <h2 className="text-xl font-bold text-gray-500 w-full pb-2">{contest.name}</h2>
            <p className={`text-sm rounded-full px-2 border ${
              contest.type.toLowerCase().includes('icpc') ? 'bg-red-100 text-red-400' : 'bg-gray-100 text-gray-600'
            }`}>
                {contest.type}
            </p>
          <div className="flex flex-col justify-center items-start gap-1">
            <p className="text-dim ">Venue: {contest.venue}</p>
            
            
          </div>
        </div>
          
      </Link>
         <div className="flex justify-between w-full">
         <p className="text-sm text-dim px-2 pb-2">
              {new Date(contest.date).getTime() > new Date().setHours(0, 0, 0, 0) ? `${Math.ceil((new Date(contest.date).getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24))} days left` : `Ended At: ${new Date(contest.date).toLocaleDateString()}`}
          </p>  
          <div className="grow flex justify-end">
          {new Date(contest.date).getTime() > new Date().setHours(0, 0, 0, 0) && (
          <AccessProvider permittedUsers={['student']}>
            <div className="w-full flex justify-end p-1">
              {registered ? (
                <Button disabled
                  variant="outlined"
                  startIcon={<CheckIcon />}
                  color="success"
                  className="min-w-full"
                >
                  Registered
                </Button>
              ) : (
                <Button variant="outlined" onClick={handleRegister}>
                  Register
                </Button>
              )}
            </div>
          </AccessProvider>
        )}
          </div>
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

