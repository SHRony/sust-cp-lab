'use client'
import React, { useState, useEffect, useContext } from 'react';
import { authContext } from "@/app/lib/AuthProvider";
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

const Profile = ({userParams, cfUserParams}:{userParams : userType|null, cfUserParams : cfUserType|null}) => {
  const auth = useContext(authContext);
  const [user, setUser] = useState<userType|null>(userParams);
  const [cfUser, setCfUser] = useState<cfUserType|null>(cfUserParams);
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
    const yo = async() => {
    
      let handles = user?.cfHandles?.join(',') ?? '';
      axios.get(`/api/external/cfuserinfo?user=${handles}`).then((res) => {
        if(res.data){
          setCfUser(res.data);
          axios.post('/api/userinfo/addcache', {username : user?.userName, info : res.data});
        }
      }).catch((res)=>{
        setCfUser(null);
      });
    }
    yo();

  }, [user?.cfHandles, user?.userName]);
  
  return (
    <div className="flex flex-col items-center w-full pt-20 gap-20">
      <div className="flex flex-row flex-wrap w-full justify-center items-stretch gap-20">
        {
          user != null && (
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
              userType='student'>
                
              </UserCard>
          )
        }
        <UserInfo CFUser={cfUser}/>
      </div>
      <RatingLineChart CFUser={cfUser}/>
      <DifficultyBarChart CFUser={cfUser}/>
      <CatagoryBarChart CFUser={cfUser}/>
      <ScatterChart user={cfUser}></ScatterChart>
      <CalenderHeatmap user={cfUser}></CalenderHeatmap>
    </div>
  );
}

export default Profile;
