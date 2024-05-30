'use client'
import React, { useState } from "react";
import HandleInput from "@/app/ui/cfviz/HandleInput";
import UserInfo from "@/app/ui/cfviz/UserInfo";
import ScatterChart from "@/app/ui/cfviz/ScatterChart";
import CalenderHeatmap from "@/app/ui/cfviz/CalenderHeatmap";
import CatagoryBarChart from "../ui/cfviz/CatagoryBarChart";
import DifficultyBarChart from "../ui/cfviz/DifficultyBarChart";
import RatingLineChart from "../ui/cfviz/RatingLineChart";
import { cfUserType } from "../lib/types";

//rating curve, calender heatmap, number of contests participated in last among last hundred contest,

export default function CFViz(){
  const [user, setUser] = useState<cfUserType | null>(null);
  function changeUser(newUser:cfUserType | null){
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
        <RatingLineChart lineData={user.ratingChanges}></RatingLineChart>
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