'use client'
import React, { useState, useEffect, useContext, use } from 'react';
import { authContext } from "@/app/lib/AuthProvider";
import { redirect } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import { cfUserType, userType } from '../lib/types';

import axios from 'axios';
import UserInfo from '../ui/cfviz/CFUserInfo';
import CalenderHeatmap from '../ui/cfviz/CalenderHeatmap';
import CatagoryBarChart from '../ui/cfviz/CatagoryBarChart';
import DifficultyBarChart from '../ui/cfviz/DifficultyBarChart';
import RatingLineChart from '../ui/cfviz/RatingLineChart';
import ScatterChart from '../ui/cfviz/ScatterChart';
import UserCard from '../ui/cards/UserCard';
import UserCardSkeleton from '../ui/cards/UserCardSkeleton';
export default function Page() {
  const auth = useContext(authContext);
  const [user, setUser] = useState<userType|null>(null);
  const [cfUser, setCfUser] = useState<cfUserType|null>(null);
  const searchParams = useSearchParams();
  useEffect(() => {
    let username:string|undefined|null = searchParams.get('username');
    if(!username && auth?.signedIn) username = auth?.user?.userName;
    // if(auth && !(auth.signedIn) && !username) redirect('/login');
    if(!username) return ;
    axios.get(`/api/userinfo?name=${username}`).then((res) => {
      if(res.data){
        setUser(res.data.user);
        console.log(res.data.user);
      }
    }).catch((res)=>{

    });
  }, [searchParams, auth]);

  return (
  <div className="flex flex-col items-center w-full pt-20 gap-20">
    <div className="flex flex-row flex-wrap w-full justify-center items-stretch gap-20">
      {/* basic userinfo here */}
      {
        user != null ? (
          <UserCard phone={''} password='' userName={user.userName} fullName={user.fullName} email={user.email} vjudgeHandle={user.vjudgeHandle} cfHandles={user.cfHandles} registrationNumber={user.registrationNumber}></UserCard>
        ):(
          <UserCardSkeleton></UserCardSkeleton>
        )
      }
      {
        cfUser != null ? (
          <UserInfo maxRating={cfUser.maxRating} maxRank={cfUser.maxRank} lastActive={cfUser.lastActive} registered={cfUser.registered} contribution={cfUser.contribution} avatar={cfUser.avatar} name={cfUser.name}></UserInfo>
        ) : (
          <></>
        )
      }
    </div>
    {
      cfUser != null ? (
        <RatingLineChart lineData={cfUser.ratingChanges}></RatingLineChart>
      ) : (
        <></>
      )
    }
    {
      cfUser != null ? (
        <DifficultyBarChart barData={cfUser.diffData}></DifficultyBarChart>
      ) : (
        <></>
      )
    }
    {
      cfUser != null ? (
        <CatagoryBarChart barData={cfUser.catData}></CatagoryBarChart>
      ) : (
        <></>
      )
    }

    {
      cfUser != null ? (
        <ScatterChart user={cfUser}></ScatterChart>
      ) : (
        <></>
      )
    }
    {
      cfUser != null ? (
        <CalenderHeatmap user={cfUser}></CalenderHeatmap>
      ) : (
        <></>
      )
    }
    

  </div>)
}
