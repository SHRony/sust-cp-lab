'use client'
import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { authContext } from "@/app/lib/AuthProvider";
import { redirect } from 'next/navigation';
import { cfUserType, userType } from '@/app/lib/types';

import axios from 'axios';
import UserInfo from '@/app/ui/cfviz/CFUserInfo';
import CalenderHeatmap from '@/app/ui/cfviz/CalenderHeatmap';
import CatagoryBarChart from '@/app/ui/cfviz/CatagoryBarChart';
import DifficultyBarChart from '@/app/ui/cfviz/DifficultyBarChart';
import RatingLineChart from '@/app/ui/cfviz/RatingLineChart';
import ScatterChart from '@/app/ui/cfviz/ScatterChart';
import UserCard from '@/app/ui/cards/UserCard';
import UserCardSkeleton from '@/app/ui/cards/UserCardSkeleton';

export default function Page({params : {username}} : {params : {username : string}}) {
  const router = useRouter();
  const auth = useContext(authContext);
  const [user, setUser] = useState<userType|null>(null);
  const [cfUser, setCfUser] = useState<cfUserType|null>(null);
  const [trigger, setTrigger] = useState(false);
  const addCFHandle = async (handle : string) => {
    if(user && user.cfHandles && !user.cfHandles.includes(handle)){
      setUser({...user, cfHandles: [...user.cfHandles, handle]});
      setTrigger(!trigger);
    }
  }
  const removeCFHandle = async (handle : string) => {
    if(user && user.cfHandles && user.cfHandles.includes(handle)){
      setUser({...user, cfHandles: user.cfHandles.filter((cfHandle) => cfHandle != handle)});
      setTrigger(!trigger);
    }
  }

  useEffect(() => {
     console.log(username);
    if(!username) redirect('/login');
    const yo = async() => {
      if(!username) return ;
      const res = await axios.get(`/api/userinfo?name=${username}`);
     
      if(res.data){
        setUser(res.data.user);
        let handles = res.data.user.cfHandles?.join(',') ?? '';
        axios.get(`/api/external/cfuserinfo?user=${handles}`).then((res) => {
          if(res.data){
            setCfUser(res.data);
            console.log(username);
            console.log(res.data)
            axios.post('/api/userinfo/addcache', {username : username, info : res.data});
          }
        }).catch((res)=>{
          setCfUser(null);
        });
      }
    }
    yo();

    
  }, [username]);
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <div className="flex flex-col items-center w-full pt-20 gap-20">
      <div className="flex flex-row flex-wrap w-full justify-center items-stretch gap-20">
        {/* basic userinfo here */}
        {
          user != null ? (
            <UserCard 
              phone={''} 
              password='' 
              userName={user.userName}
              fullName={user.fullName}
              email={user.email}
              vjudgeHandle={user.vjudgeHandle}
              cfHandles={user.cfHandles}
              registrationNumber={user.registrationNumber}
              addCFHandle={addCFHandle}
              removeCFHandle={removeCFHandle}
              >
                
              </UserCard>
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
    </div>
  );
}
