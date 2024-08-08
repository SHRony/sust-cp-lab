import React from "react";
import Image from "next/image";
import Card from "../cards/Card";
import { cfUserType } from "@/app/lib/types";


export default function cfUserInfo({CFUser}:{CFUser:cfUserType|null}){
  if(!CFUser) return <></>;
  const {maxRating, maxRank, lastActive, registered, contribution, avatar, name} = CFUser
  return (
    <Card style={{backgroundImage : 'url(profile_bg.png)', backgroundSize : '100% 100%'} } className="flex flex-col items-center bg-card w-170 min-h-10 py-8 rounded">
      <ProfileImage avatar={avatar} />
      <ProfileHeading text={name} />
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
    <div className="text-3xl font-bold text-text">
      {text}
    </div>
  )
}
const ProfileImage = ({avatar}:{avatar:string}) => {
  return (
    <div className="">
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
const ProfileInfoRow = ({label, value}:{label:string, value:string}) => {
  return (
    <div className="flex flex-row justify-start w-full p-2 pl-40">
      <div className="font-bold text-text w-40">
        {label} :
      </div>
      <div className="text-dim">
        {value}
      </div>
    </div>
  )
}