'use client'
import React, { useState } from "react";
import HandleInput from "../ui/cfviz/HandleInput";
import UserInfo from "../ui/cfviz/UserInfo";
import { Scatter } from "react-chartjs-2";
import { LinearScale } from "chart.js";
import { Chart as ChartJS, LineController, LineElement, PointElement, Title } from 'chart.js';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);

//rating curve, calender heatmap, number of contests participated in last among last hundred contest,
 type userType = Readonly<{
  maxRating: number | string;
  maxRank: string;
  lastActive: string;
  registered: string;
  contribution: number | string;
  avatar : string;
  name : string;
  acTime : {x : number, y : number}[]
}>;

export default function CFViz(){
  const [user, setUser] = useState<userType | null>(null);
  
  interface ChartData {
    datasets: {
      label: string;
      data: {x : number, y : number}[]; // Use the defined type
      backgroundColor: string;
    }[]; // Array of dataset objects
  }
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const data = {
    datasets: [
      {
        label: 'A dataset',
        data: Array.from({ length: 100 }, () => ({
          x: 4,
          y: 4,
        })),
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };
  function changeUser(newUser:userType | null){
    if(newUser){
      // data.datasets[0].data = newUser.acTime;
      console.log(data);
    }
    
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
        // <></>
        <Scatter data={
          {
            datasets: [
              {
                label: 'A dataset',
                data: user.acTime,
                backgroundColor: 'rgba(255, 99, 132, 1)',
              },
            ],
          }
        } /> // Add options for labels
      ) : (
        <></>
      )
    }
  </div>
}