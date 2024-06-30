import React from "react";
import Image from "next/image";
import Card from "@/app/ui/cards/Card";
import UserCard from "@/app/ui/cards/UserCard";

export default function TeamCard({ team, teamName }: { team: string[], teamName: string }) {
  return (
    <Card
      className={`flex flex-col items-center justify-center bg-white p-4 w-full`}
    >
      <h2 className="text-2xl font-bold text-center w-full">{teamName}</h2>
      <div className="flex flex-col flex-wrap gap-4">
        {team.map((username) => (
          <p key={username}>{username}</p>
        ))}
      </div>
    </Card>
  );
}
