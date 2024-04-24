import React from "react";
import Image from "next/image";
type userType = Readonly<{
  maxRating: number | string;
  maxRank: string;
  lastActive: string;
  registered: string;
  contribution: number | string;
  avatar:string;
  name : string;
}>;

export default function UserInfo({maxRating, maxRank, lastActive, registered, contribution, avatar, name}:userType){
  return (
    <div style={{backgroundImage : 'url(profile_bg.png)', backgroundSize : '100% 100%'} } className="flex flex-col items-center bg-white bg-opacity-75 backdrop-blur drop-shadow-3xl w-full max-w-lg min-h-10 mt-10 py-8">
      <div className="">
        <Image
        src={avatar}
        width={120}
        height={120}
        style={{height:'120px', width : '120px', borderColor : 'var(--secondary)'}}
        className="block filter drop-shadow-3xl mb-5 rounded-full border-8"
        layout="fixed"
        objectFit="contain"
        alt="Profile"
      />
      </div>
      <div className="w-full flex justify-center items-center text-2xl font-bold text-gray-700 text-shadow-2xl text-center">
        {name}
      </div>
      <div className="flex flex-row justify-start w-full p-2 ml-60">
        <div className="font-bold text-gray-700 w-40">
          Max Rating :
        </div>
        <div className="text-gray-600">
          {maxRating}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 ml-60">
        <div className="font-bold text-gray-700 w-40">
          Max Rank :
        </div>
        <div className="text-gray-600">
          {maxRank}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 ml-60">
        <div className="font-bold text-gray-700 w-40">
          Last Active :
        </div>
        <div className="text-gray-600">
          {lastActive}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 ml-60">
        <div className="font-bold text-gray-700 w-40">
          Registered :
        </div>
        <div className="text-gray-600">
          {registered}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 ml-60">
        <div className="font-bold text-gray-700 w-40">
          Contribution :
        </div>
        <div className="text-gray-600">
          {contribution}
        </div>
      </div>

    </div>
  )
}