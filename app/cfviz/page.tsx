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

export default function CFViz(){
  const [user, setUser] = useState<cfUserType | null>(null);
  function changeUser(newUser:cfUserType | null){
    setUser(newUser);
  }

  return (
  <div className="flex flex-col items-center w-full pt-20 gap-20">
    <div className = "flex flex-row flex-wrap w-full justify-center items-stretch gap-20">
      <HandleInput changeUser = {changeUser}/>
      <CFUserInfo CFUser={user} />
    </div>
    <RatingLineChart CFUser={user} />
    <DifficultyBarChart CFUser={user} />
    <CatagoryBarChart CFUser={user}></CatagoryBarChart>
    <ScatterChart user={user}></ScatterChart>
    <CalenderHeatmap user={user}></CalenderHeatmap>
  </div>)
}