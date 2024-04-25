'use client'
import React, { useState } from "react";
import HandleInput from "@/app/ui/cfviz/HandleInput";
import UserInfo from "@/app/ui/cfviz/UserInfo";
import { userType } from "@/app/lib/types";
import ScatterChart from "@/app/ui/cfviz/ScatterChart";
import CalenderHeatmap from "@/app/ui/cfviz/CalenderHeatmap";
import CatagoryBarChart from "../ui/cfviz/CatagoryBarChart";
import DifficultyBarChart from "../ui/cfviz/DifficultyBarChart";


//rating curve, calender heatmap, number of contests participated in last among last hundred contest,

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
    {
      user != null ? (
        <DifficultyBarChart barData={user.diffData}></DifficultyBarChart>
      ) : (
        <></>
      )
    }
    {
      user != null ? (
        <CatagoryBarChart barData={user.catData}></CatagoryBarChart>
      ) : (
        <></>
      )
    }

    {
      user != null ? (
        <ScatterChart user={user}></ScatterChart>
      ) : (
        <></>
      )
    }
    {
      user != null ? (
        <CalenderHeatmap user={user}></CalenderHeatmap>
      ) : (
        <></>
      )
    }
    

  </div>
}