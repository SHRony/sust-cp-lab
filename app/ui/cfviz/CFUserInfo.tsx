import React from "react";
import Image from "next/image";
import Card from "../cards/Card";
type cfUserType = Readonly<{
  maxRating: number | string;
  maxRank: string;
  lastActive: string;
  registered: string;
  contribution: number | string;
  avatar:string;
  name : string;
}>;

export default function cfUserInfo({maxRating, maxRank, lastActive, registered, contribution, avatar, name}:cfUserType){
  return (
    <Card style={{backgroundImage : 'url(profile_bg.png)', backgroundSize : '100% 100%'} } className="flex flex-col items-center bg-white w-170 min-h-10 py-8 rounded">
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
      <div 
        className="flex justify-center items-center text-2xl font-bold text-gray-700 text-shadow-2xl text-center px-10 mb-5"
        style={{backgroundColor : 'var(--primaryContainer)', color : 'var(--primary)', borderRadius : '50px'}}
      >
        {name}
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-40">
        <div className="font-bold text-gray-700 w-40">
          Max Rating :
        </div>
        <div className="text-gray-600">
          {maxRating}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-40">
        <div className="font-bold text-gray-700 w-40">
          Max Rank :
        </div>
        <div className="text-gray-600">
          {maxRank}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-40">
        <div className="font-bold text-gray-700 w-40">
          Last Active :
        </div>
        <div className="text-gray-600">
          {lastActive}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-40">
        <div className="font-bold text-gray-700 w-40">
          Registered :
        </div>
        <div className="text-gray-600">
          {registered}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-40">
        <div className="font-bold text-gray-700 w-40">
          Contribution :
        </div>
        <div className="text-gray-600">
          {contribution}
        </div>
      </div>

    </Card>
  )
}