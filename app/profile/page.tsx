'use client'
import React, { useState, useEffect, useContext, Suspense } from 'react';
import { authContext } from "@/app/lib/AuthProvider";
import { redirect } from 'next/navigation';
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

type UserInfoComponentProps = {
  name: any;
};

const UserInfoComponent: React.FC<UserInfoComponentProps> = ({ name }) => {
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
    let username:string|null = name ?? null;
    if(!username && auth?.signedIn) username = auth?.user?.userName??null;
    if(!username && auth && !auth.loading && !auth.signedIn) redirect('/login');
    if(!username) return ;
    console.log(username);
    axios.get(`/api/userinfo?name=${username}`).then((res) => {
      if(res.data){
        setUser(res.data.user);
        let handles = res.data.user.cfHandles?.join(',') ?? '';
        axios.get(`/api/external/cfuserinfo?user=${handles}`).then((res) => {
          if(res.data){
            setCfUser(res.data);
            console.log(res.data);
            axios.post('api/userinfo/addcache', {username : username, info : res.data});
          }
        }).catch((res)=>{
          setCfUser(null);
        });
      }
    }).catch((res)=>{
      setUser(null);
    });
    
    
  }, [name, auth, trigger]);
  useEffect(() => {
    console.log(user);
  }, [user])
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

export default function Page() {
  const [username, setUsername] = useState<string|null> (null); // Store username in state

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search); // Use standard URLSearchParams
    setUsername(searchParams.get('username'));
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserInfoComponent name={username} />
    </Suspense>
  )
}