import {cfUserType, ratingChangeType} from '@/app/lib/types'
import { borderColors, backgroundColors } from "@/app/lib/colors";
import prisma from '@/app/api/dbclient';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';


export async function addCFHandle(cfHandle : string, userName : string){
  await prisma.sust_cp_lab_cf_handles.create({ data: { handle: cfHandle, username: userName } });
}

export async function removeCFHandle(cfHandle : string, userName : string){
  console.log(cfHandle, userName);
  await prisma.sust_cp_lab_cf_handles.deleteMany({ where: { handle: cfHandle, username: userName } });
}



export async function addCFCache(username:string, cfUser:cfUserType) {
    if(!username || !cfUser) return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    const response = await prisma.sust_cp_lab_cf_cache.upsert({
      where: {
        username: username
      },
      create: {
        username: username,
        info: cfUser
      },
      update: {
        username: username,
        info: cfUser
      }
    });
    console.log(response);
  }






function getTime(s : number){
    let m = Math.floor(s / 60);
    let h = Math.floor(m / 60);
    let d = Math.floor(h / 24);
    let M = Math.floor(d / 30);
    let Y = Math.floor(M / 12);
    
    if(Y > 0) return Y + " Years ago";
    if(M > 0) return M + " Months ago";
    if(d > 0) return d + " Days ago";
    if(h > 0) return h + " Hours ago";
    return m + " Minutes ago";
  
  }
  
  
  
  function getRank(rating:number){
    if(rating >= 3000) return "Legendary Grand Master";
    if(rating >= 2600) return "International Grand Master";
    if(rating >= 2400) return "Grand Master";
    if(rating >= 2300) return "International Master";
    if(rating >= 2100) return "Master";
    if(rating >= 1900) return "Candidate Master";
    if(rating >= 1600) return "Expert";
    if(rating >= 1400) return "Specialist";
    if(rating >= 1200) return "Pupil";
    if(rating > 0) return "Newbie";
    return "Unknown";
  }
  
  
  
  function getDate(timestamp:number) {
    timestamp = timestamp * 1000;
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0');  // Add leading zero for single-digit days
    
    // Combine year, month, and day in the desired format
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  
  
  async function fetchUserInfo(users:string[]){
    const userResponse = await fetch('https://codeforces.com/api/user.info?handles='+users?.join(";"));
    const userData = await userResponse.json();
    const userResult = userData.result;
    const contribution = userResult.reduce((mx:number, x:any)=>{ mx = Math.max(mx, x.contribution); return mx;}, 0);
    const lastActive = getTime(
      userResult.reduce((mn:any, x:any) => {
        mn = Math.min(mn, Math.floor(Date.now()/ 1000) - x.lastOnlineTimeSeconds);
        return mn
      }, 1000000000)
    );  
    const maxRating = userResult.reduce((mx:number, x:any)=>{ mx = Math.max(mx, x.maxRating); return mx;}, 0);
    const registered = getTime(
      userResult.reduce((mx:number, x:any)=>{
        mx = Math.max(mx, Math.floor(Date.now()/1000) - x.registrationTimeSeconds);
        return mx
      }, 0));
    const maxRank = getRank(maxRating);

    // Prioritize avatar selection
    let avatar = "https://userpic.codeforces.org/no-title.jpg";
    // First try to find a user with a custom avatar
    const userWithAvatar = userResult.find((user: any) => 
      user.titlePhoto && 
      !user.titlePhoto.includes('no-title.jpg') && 
      !user.titlePhoto.includes('no-avatar.jpg')
    );
    if (userWithAvatar) {
      avatar = userWithAvatar.titlePhoto;
    } else {
      // If no custom avatar found, use the first available avatar
      avatar = userResult[0]?.titlePhoto || avatar;
    }
    
    // Name handling logic
    let name = "undefined";
    
    // First priority: Find a user with both first and last name
    const userWithBothNames = userResult.find((user: any) => 
      user.firstName && user.lastName
    );
    
    if (userWithBothNames) {
      name = `${userWithBothNames.firstName} ${userWithBothNames.lastName}`;
    } else {
      // Second priority: Find a user with either first or last name
      const userWithSomeName = userResult.find((user: any) => 
        user.firstName || user.lastName
      );
      
      if (userWithSomeName) {
        name = userWithSomeName.firstName || userWithSomeName.lastName;
      }
    }
    
    return [maxRating, maxRank, registered, lastActive, avatar, name, contribution];
}
  
  
  async function fetchSubmissionsInfo(users:string[]) {
    let solvedProblems:any = [];
    let mn = 1000000;
    let acTime:{x:number, y:number}[] = []; 
    let dateCnt = new Map();
    let stProblems = new Map();
    let iteration:number = 0;
    for(const user of users){
      let url = "https://codeforces.com/api/user.status?handle=" + user;
      let statusResponse = await fetch(url);
      let statusData = await statusResponse.json();
      let statusResult = statusData.result;
  
      for(const submission of statusResult) {
        let problemName = submission.problem.name;
        let date = getDate(submission.creationTimeSeconds);
        dateCnt.set(date, dateCnt.has(date) ? dateCnt.get(date) + 1 : 1);
        if(submission.verdict == 'OK' && !stProblems.has(problemName)){
          mn = Math.min(mn, Math.round(submission.creationTimeSeconds / 86400));
          if(submission.problem.rating){
            acTime.push({
              x: Math.round(submission.creationTimeSeconds / 86400),
              y: submission.problem.rating
            })
          }
          stProblems.set(problemName, 1);
          solvedProblems.push(submission.problem);
        }
      }
    }
    for(let i = 0; i < acTime.length; i++){
      acTime[i].x = acTime[i].x - mn;
    }
    let calenderSubmissions:{date : string, count : number}[] = [];
    dateCnt.forEach((value, key) => {
      calenderSubmissions.push({
        date : key, 
        count : value
      });
    });
    let diffCount = new Map();
    let catCount = new Map();
    for(const problem of solvedProblems){
      if(problem.rating && problem.rating != "") diffCount.set(problem.rating , diffCount.has(problem.rating) ? diffCount.get(problem.rating) + 1 : 1);
      for(const tag of problem.tags){
        catCount.set(tag, catCount.has(tag) ? catCount.get(tag) + 1 : 1);
      }
    }
    let catData: { x: any; y: any; }[] = [];
    catCount.forEach((value, key)=>{
      catData.push({
        x : key,
        y : value
      });
    });
    const cmpcat = (a:any, b:any)=>{
      return b.y - a.y;
    }
    const cmpdif = (a:any, b:any)=>{
      return a.x - b.x;
    }
    catData.sort(cmpcat);
    let diffData: { x: any; y: any; }[] = [];
    for(let i = 800; i <= 3500; i += 100) if(!diffCount.has(i)) diffCount.set(i, 0);
    diffCount.forEach((value, key)=>{
      diffData.push({
        x : key,
        y : value
      });
    });
    diffData.sort(cmpdif);
    return {acTime, calenderSubmissions, diffData, catData};
  }
  
  async function fetchRatingInfo(users : string[]){
    let ratingChangeMaps = [];
      let stRatingChangeDates = new Map();
      let ratingChanges:ratingChangeType = {
        labels : [],
        datasets : [],
      };
      let iteration:number = 0;
      for(const user of users){
        
        let url = " https://codeforces.com/api/user.rating?handle=" + user;
        let ratingResponse = await fetch(url);
        let ratingData = await ratingResponse.json();
        let ratingResult = ratingData.result;
        let ratingChangeArray : (number | null) [] = [];
        let mp = new Map();
        for(const elem of ratingResult){
          mp.set(getDate(elem.ratingUpdateTimeSeconds),elem.newRating);
          stRatingChangeDates.set(getDate(elem.ratingUpdateTimeSeconds), 1);
        }
        ratingChangeMaps.push(mp);
        let curRatingChange : { label : string; data : (number|null)[];borderColor : string; backgroundColor : string } = {
          label : user,
          data : ratingChangeArray,
          borderColor : borderColors[iteration],
          backgroundColor : backgroundColors[iteration],
        };
        ratingChanges.datasets.push(curRatingChange);
        iteration = (iteration + 1) % 6;
      }
      stRatingChangeDates.forEach((value, key)=>{
        ratingChanges.labels.push(key);
      });
      ratingChanges.labels.sort();
      for(const date of ratingChanges.labels){
        for(let i = 0; i < users.length; i++){
          ratingChanges.datasets[i].data.push(ratingChangeMaps[i].has(date) ? ratingChangeMaps[i].get(date) : null);
        }
      }
      return ratingChanges;
  }
  
  export async function getCFInfo(users:string[]){
    let fokka:cfUserType = {
      contribution : 0,
      lastActive : 'never',
      maxRating : 0,
      maxRank : 'none',
      registered : 'never',
      avatar : "https://userpic.codeforces.org/no-title.jpg",
      name : "",
      acTime : [],
      calenderSubmissions : [],
      diffData : [],
      catData : [],
      ratingChanges : {labels: [], datasets: []}
    }
      if(users == null || users.length == 0){
        //return empty user
        
        return fokka;
      }
      try{
        const {acTime, calenderSubmissions, diffData, catData} = await fetchSubmissionsInfo(users);
          const [maxRating, maxRank, registered, lastActive, avatar, name, contribution] = await fetchUserInfo(users);
          // const [acTime] = await fetchSubmissionsInfo(users);
          const ratingChanges = await fetchRatingInfo(users);
          let user:cfUserType = {
            contribution : contribution,
            lastActive : lastActive,
            maxRating : maxRating,
            maxRank : maxRank,
            registered : registered,
            avatar : avatar,
            name : name,
            acTime : acTime,
            calenderSubmissions : calenderSubmissions,
            diffData : diffData,
            catData : catData,
            ratingChanges : ratingChanges
          };
       return user;
      }catch{
        return fokka;
      }
      
  }