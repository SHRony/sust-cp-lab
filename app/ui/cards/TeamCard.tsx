import React from "react";
import Image from "next/image";
import Card from "@/app/ui/cards/Card";
import UserCard from "@/app/ui/cards/UserCard";
import Link from "next/link";
import IconButton from "@mui/material/IconButton/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DoubleClickInput from "../input/DoubleClickInput";
import { teamType } from "@/app/lib/types";
import AccessProvider from "@/app/lib/AccessProvider";

interface TeamCardProps {
  team : teamType;
  onClose: (team: teamType) => void;
  onRename: (team: string[], newTeamName: string) => void;
}

const TeamCard = ({ team, onClose, onRename }: TeamCardProps) => {
  return (
    <Card
      className={`flex flex-col  px-3 w-full justify-center items-center bg-white`}
    >
      <AccessProvider permittedUsers={['mentor', 'admin']}>
        <div className="flex justify-end w-full">
          <IconButton style={{ position: 'relative', right: '-1.2rem', top : '-.2rem' }} onClick={() => onClose(team)}>
            <CloseIcon />
          </IconButton>
        </div>
      </AccessProvider>
      <DoubleClickInput
        textClassName="font-bold px-2"
        inputClassName="font-bold bg-transparent px-2"
        initialValue={team.name}
        onChange={newTeamName => onRename(team.members, newTeamName)}
        textStyle={{
          color: 'var(--primary)',
          backgroundColor: 'var(--primaryContainer)',
          borderRadius: '50px',
        }}
      ></DoubleClickInput>
      <div className="mt-2 flex flex-col flex-wrap gap-4 w-full">
        {team.members.map((username) => (
          <Link key={username} href={`/profile/${username}`}>
            <p style={{color : 'var(--primary)'}} className="cursor-pointer">{username}</p>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default TeamCard;

