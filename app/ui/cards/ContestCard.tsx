import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "./Card";
import { contestType } from "@/app/lib/types";
import AccessProvider from "@/app/lib/AccessProvider";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton/IconButton";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export default function ContestCard({ contest, onClose }: { contest: contestType, onClose: (id: number) => void }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmClose = () => {
    onClose(contest.id);
    handleClose();
  };

  return (
    <>
      <Card
        className={`flex flex-col items-start md:items-center gap-4 bg-white ${
          contest.poster ? "row-span-2" : ""
        }`}
      >
        {contest.poster && (
          <div className="">
            <Image
              src={contest.poster}
              alt="Contest logo"
              layout={'responsive'}
              width={340}
              height={100}
              style={{ maxHeight: "220px" }}
            />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-center items-start min-h-48 w-full p-4 bg-white overflow-y-scroll gap-3 grow" style={{ scrollbarWidth: "none" }}>
          <Link href={`/contests/${contest.id}`}>
            <h2 className="text-2xl font-bold text-center w-full">{contest.name}</h2>
          </Link>
          <div className="flex flex-col justify-center items-start gap-2">
            <p className="text-lg font-semibold text-gray-600">{contest.venue}</p>
            <p className="text-sm text-gray-600">{contest.description}</p>
            <p className="text-sm text-gray-600">
              Date: {new Date(contest.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Type: {contest.type}
            </p>
          </div>
        </div>
        <AccessProvider permittedUsers={['admin', '_'+contest.author]}>
          <div className="w-full flex justify-end">
            <IconButton onClick={handleOpen}>
              <CloseIcon color="error" />
            </IconButton>
          </div>
        </AccessProvider>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Close Contest</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to close this contest?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmClose} autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

