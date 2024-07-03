import React, { useState } from "react";
import Image from "next/image";
import Card from "@/app/ui/cards/Card";
import UserCard from "@/app/ui/cards/UserCard";
import Link from "next/link";
import IconButton from "@mui/material/IconButton/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DoubleClickInput from "../input/DoubleClickInput";
import { teamType } from "@/app/lib/types";
import AccessProvider from "@/app/lib/AccessProvider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";

interface TeamCardProps {
  team: teamType;
  onClose: (team: teamType) => void;
  onRename: (team: string[], newTeamName: string) => void;
}

const TeamCard = ({ team, onClose, onRename }: TeamCardProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmClose = () => {
    onClose(team);
    handleClose();
  };

  return (
    <Card
      className={`flex flex-col  px-3 w-full justify-center items-center bg-white relative`}
    >
      <AccessProvider permittedUsers={["mentor", "admin"]}>
        <div className="flex justify-end absolute top-0 right-0 rounded-bl-3xl shadow-2xl border border-gray-300">
          <IconButton onClick={() => setOpen(true)}>
            <CloseIcon color="error" />
          </IconButton>
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm close</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this team?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleConfirmClose} color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </AccessProvider>
      <DoubleClickInput
        textClassName="font-bold px-2"
        inputClassName="font-bold bg-transparent px-2"
        initialValue={team.name}
        onChange={(newTeamName) => onRename(team.members, newTeamName)}
        textStyle={{
          color: "var(--primary)",
          backgroundColor: "var(--primaryContainer)",
          borderRadius: "50px",
        }}
      ></DoubleClickInput>
      <div className="mt-2 flex flex-col flex-wrap gap-4 w-full">
        {team.members.map((username) => (
          <Link key={username} href={`/profile/${username}`}>
            <p style={{ color: "var(--primary)" }} className="cursor-pointer">
              {username}
            </p>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default TeamCard;

