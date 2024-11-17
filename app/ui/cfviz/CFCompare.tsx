import axios from 'axios';
import { useEffect, useState } from 'react';
import ScatterChart from '@/app/ui/cfviz/ScatterChart';
import { cfUserType, ratingChangeType } from '@/app/lib/types';
import UserInfo from '@/app/ui/cfviz/CFUserInfo';
import Card from '@/app/ui/cards/Card';
import RatingLineChart from '@/app/ui/cfviz/RatingLineChart';
import { borderColors, backgroundColors } from "@/app/lib/colors";
import DifficultyCompareChart from './DifficultyCompareChart';

export default function CFCompare ({users} : {users : string[]}) {
  const [cfUsers, setCFUsers] = useState<cfUserType[]>([]);
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

  const combineRatingChanges = (users: cfUserType[]) => {
    // Get all unique labels from all users
    const labelSet = new Set<string>();
    users.forEach(user => {
      user.ratingChanges.labels.forEach(label => labelSet.add(label));
    });
    const labels = Array.from(labelSet).sort();

    let ret: ratingChangeType = {
      labels: labels,
      datasets: [],
    };

    let cnt = 0;
    // For each user, add their datasets
    users.forEach(user => {
      for (const data of user.ratingChanges.datasets) {
        let newData : { label : string; data : (number|null)[]; borderColor : string; backgroundColor : string } = {
          label: `${user.name} - ${data.label}`,
          data: [],
          borderColor: borderColors[cnt],
          backgroundColor: backgroundColors[cnt],
        };
        cnt = (cnt + 1) % borderColors.length;

        // Create a map of label to data for quick lookup
        let mp: Map<string, number | null> = new Map();
        for (let i = 0; i < user.ratingChanges.labels.length; i++) {
          mp.set(user.ratingChanges.labels[i], data.data[i]);
        }

        // Fill in data for all labels
        for (const label of labels) {
          newData.data.push(mp.has(label) ? mp.get(label)??null : null);
        }
        ret.datasets.push(newData);
      }
    });

    return ret;
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      if(users){
        const promises = users.map(user => getUserInfo(user));
      Promise.all(promises).then(res => {
        setCFUsers(res.filter(user => user !== null));
        setLoading(false);
      });
      }
    }
    fetchUserInfo();
  }, [users]);

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

  if(cfUsers.length === 0){
    return <div className="flex flex-col items-center justify-center h-full">
      <p className="text-center text-2xl">Loading...</p>
    </div>
  }

  return (
    <div className="flex flex-col gap-20 bg-card">
      {cfUsers.length > 0 && (
        <>
          <div className="flex flex-row flex-wrap w-full justify-center items-stretch gap-20">
            {cfUsers.map(user => (
              <UserInfo key={user.name} CFUser={user} />
            ))}
          </div>
          <RatingLineChart CFUser={createDummyUserFromLineData(combineRatingChanges(cfUsers))}/>
          <DifficultyCompareChart users={cfUsers}></DifficultyCompareChart>
        </>
      )}
    </div>
  )
}

function createDummyUserFromLineData(lineData: ratingChangeType) {
  let ret: cfUserType = {
    maxRating: 0,
    maxRank: "none",
    lastActive: "never",
    registered: "never",
    avatar: "https://userpic.codeforces.org/no-title.jpg",
    name: "dummy",
    contribution: 0,
    acTime: [],
    calenderSubmissions: [],
    catData: [],
    ratingChanges: lineData,
    diffData: [],
  };
  return ret;
}