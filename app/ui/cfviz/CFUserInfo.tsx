import React from "react";
import Image from "next/image";
import Card from "../cards/Card";
import { cfUserType } from "@/app/lib/types";
import { ProfileInfoRow } from "@/app/ui/cards/UserCard";

export default function cfUserInfo({CFUser}:{CFUser:cfUserType|null}){
  if(!CFUser) return <></>;
  const {maxRating, maxRank, lastActive, registered, contribution, avatar, name} = CFUser
  return (
    <Card className="flex flex-col items-start bg-card w-80 tablet:w-120 laptop:w-160 min-h-10 py-8 rounded">
      <ProfileHeading text={name} />
      <ProfileImage avatar={avatar} />
      
      <ProfileInfoRow label="Max Rating" value={maxRating.toString()} />
      <ProfileInfoRow label="Max Rank" value={maxRank} />
      <ProfileInfoRow label="Last Active" value={lastActive} />
      <ProfileInfoRow label="Registered" value={registered} />
      <ProfileInfoRow label="Contribution" value={contribution.toString()} />
    </Card>
  )
}

const ProfileHeading = ({text}:{text:string}) => {
  return (
    <div className="flex justify-center items-center text-2xl font-bold text-shadow-2xl text-center px-10 mb-5 bg-blue-100 text-blue-600 rounded-r-full">
      {text}
    </div>
  )
}
const ProfileImage = ({avatar}:{avatar:string}) => {
  return (
    <div className="w-full flex justify-center">
      <Image
      src={avatar}
        width={120}
        height={120}
        style={{height:'120px', width : '120px', borderColor : 'var(--primaryContainer)'}}
        className="block filter drop-shadow-3xl mb-5 rounded-full border-8"
        layout="fixed"
        objectFit="contain"
        alt="Profile"
      />
    </div>
  )
}
