'use client'
import React, { useState } from "react";
import HandleInput from "../ui/cfviz/HandleInput";
import UserInfo from "../ui/cfviz/UserInfo";

//rating curve, calender heatmap, number of contests participated in last among last hundred contest,

type userType = Readonly<{
  maxRating: number | string;
  maxRank: string;
  lastActive: string;
  registered: string;
  contribution: number | string;
  avatar : string;
  name : string;
}>;

export default function CFViz(){
  const [user, setUser] = useState<userType | null>(null);
  function changeUser(newUser:userType | null){
    setUser(newUser);
  }
  return <div className="p-20 flex flex-col items-center">
    <HandleInput changeUser = {changeUser}>

    </HandleInput>
    {
      user != null ? (
        <UserInfo maxRating={user.maxRating} maxRank={user.maxRank} lastActive={user.lastActive} registered={user.registered} contribution={user.contribution} avatar={user.avatar} name={user.name}></UserInfo>
      ) : (
        <></>
      )
    }
  </div>
}