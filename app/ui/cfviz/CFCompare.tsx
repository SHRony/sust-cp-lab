import axios from 'axios';
import { useEffect, useState } from 'react';
import ScatterChart from '@/app/ui/cfviz/ScatterChart';
import { cfUserType, ratingChangeType } from '@/app/lib/types';
import UserInfo from '@/app/ui/cfviz/CFUserInfo';
import Card from '@/app/ui/cards/Card';
import RatingLineChart from '@/app/ui/cfviz/RatingLineChart';
import { borderColors, backgroundColors } from "@/app/lib/colors";
import DifficultyCompareChart from './DifficultyCompareChart';
export default function CFCompare ({user1Name, user2Name} : {user1Name : string, user2Name : string}) {
  const [user1, setUser1] = useState<cfUserType|null>(null);
  const [user2, setUser2] = useState<cfUserType|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getUserInfo = async (username : string) => {
    setLoading(true);
    const res = await axios.get(`/api/userinfo?name=${username}`);
    if(res.data){
      const handles = res.data.user.cfHandles?.join(',') ?? '';
      const cfRes = await axios.get(`/api/external/cfuserinfo?user=${handles}`);
      if(cfRes.data){
        return cfRes.data;
      }
    }
    setError('Error fetching user info');
    setLoading(false);
    return null;
  }

  const combineRatingChanges = (x: ratingChangeType, y: ratingChangeType) => {
    const st = new Set([...x.labels, ...y.labels]);
    const labels = Array.from(st);
    labels.sort();
    let cnt = 0;
    // make labels unique
    labels.filter((value, index, self) => self.indexOf(value) === index);
    let ret : ratingChangeType = {
      labels : labels,
      datasets : [],
    };
    for(const data of x.datasets){
      
      let newData:{
        label : string;
        data : (number|null)[];
        borderColor : string;
        backgroundColor : string;
    
      } = {
        label : data.label,
        data : [],
        borderColor : borderColors[cnt],
        backgroundColor : backgroundColors[cnt],
      };
      cnt = (cnt + 1) % 6;
    
    let mp = new Map();
    for(let i = 0; i < x.labels.length; i++){
      mp.set(x.labels[i], data.data[i]);
    }
    for (const label of labels){
      newData.data.push(mp.has(label) ? mp.get(label) : null);
    }
    ret.datasets.push(newData);
  }
  for (const data of y.datasets){
    
    let newData:{
      label : string;
      data : (number|null)[];
      borderColor : string;
      backgroundColor : string;
  
    } = {
      label : data.label,
      data : [],
      borderColor : borderColors[cnt],
      backgroundColor : backgroundColors[cnt],
    };
    cnt = (cnt + 1) % 6;
    let mp = new Map();
    for(let i = 0; i < y.labels.length; i++){
      mp.set(y.labels[i], data.data[i]);
    }
    for (const label of labels){
      newData.data.push(mp.has(label) ? mp.get(label) : null);
    }
    ret.datasets.push(newData);

  }
  return ret;
}
  useEffect(() => {
    const fetchUserInfo = async () => {
    const res1 = await getUserInfo(user1Name);
    const res2 = await getUserInfo(user2Name);
    setUser1(res1);
    setUser2(res2);
    setLoading(false);
  }
    fetchUserInfo();
  }, [user1Name, user2Name]);

  if(loading){
    return <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
    </div>
  }

  if(error){
    return <div className="flex flex-col items-center justify-center h-full">
      <p className="text-center text-2xl">{error}</p>
    </div>
  }

  if(!user1 || !user2){
    return <div className="flex flex-col items-center justify-center h-full">
      <p className="text-center text-2xl">Loading...</p>
    </div>
  }

  return (
    <div className="flex flex-col gap-20 bg-card">
      {user1 && user2 && (
        <>
          <div className="flex flex-row flex-wrap w-full justify-center items-stretch gap-20">
            <UserInfo maxRating = {user1.maxRating} maxRank = {user1.maxRank} lastActive = {user1.lastActive} registered = {user1.registered} contribution = {user1.contribution} avatar = {user1.avatar} name = {user1Name}/>
            <UserInfo maxRating = {user2.maxRating} maxRank = {user2.maxRank} lastActive = {user2.lastActive} registered = {user2.registered} contribution = {user2.contribution} avatar = {user2.avatar} name = {user2Name} />
          </div>
          <RatingLineChart lineData={combineRatingChanges(user1.ratingChanges, user2.ratingChanges)}/>
          <DifficultyCompareChart barData1={user1.diffData} barData2={user2.diffData}></DifficultyCompareChart>
        </>
      )}
      {/* <div className="flex flex-col gap-5">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gray-400 rounded-full mr-2"></div>
          <p className="text-lg font-semibold">{user1Name}</p>
        </div>
        <ScatterChart user1={user1} user2={user2} />
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gray-400 rounded-full mr-2"></div>
          <p className="text-lg font-semibold">{user2Name}</p>
        </div>
        <ScatterChart user1={user2} user2={user1} />
      </div> */}
    </div>
  )
}

