'use client'
import React, { useState } from "react";
import HandleInput from "@/app/ui/cfviz/HandleInput";
import CFUserInfo from "@/app/ui/cfviz/CFUserInfo";
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

  return (
  <div className="flex flex-col items-center w-full pt-20 gap-20">
    <div className="flex flex-row flex-wrap w-full justify-center items-stretch gap-20">
      <HandleInput changeUser = {changeUser}>

      </HandleInput>
      
      {
        user != null ? (
          <CFUserInfo maxRating={user.maxRating} maxRank={user.maxRank} lastActive={user.lastActive} registered={user.registered} contribution={user.contribution} avatar={user.avatar} name={user.name}></CFUserInfo>
        ) : (
          <></>
        )
      }
    </div>
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
    

  </div>)
}