import { Sort } from "@mui/icons-material";
import { NextResponse, NextRequest } from "next/server";
import { ratingChangeType } from "@/app/lib/types";
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
function getRank(r:number){
  if(r >= 3000) return "Legendary Grand Master";
  if(r >= 2600) return "International Grand Master";
  if(r >= 2400) return "Grand Master";
  if(r >= 2300) return "International Master";
  if(r >= 2100) return "Master";
  if(r >= 1900) return "Candidate Master";
  if(r >= 1600) return "Expert";
  if(r >= 1400) return "Specialist";
  if(r >= 1200) return "Pupil";
  if(r > 0) return "Newbie";
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

const borderColors:string[] =  [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];
const backgroundColors = [
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
  "rgba(75, 192, 192, 0.2)",
  "rgba(153, 102, 255, 0.2)",
  "rgba(255, 159, 64, 0.2)",
];

export async function GET(request:NextRequest) {
  
  try{
    let param = request.nextUrl.searchParams.get('user');
    if(!param || param == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const users:string[] = param?.split(",");
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
    const avatar = userResult[0].avatar;
    const name = userResult[0].firstName + " " + userResult[0].lastName;
    







    let solvedProblems:any = [];
    let mn = 1000000;
    let acTime = [];
    let dateCnt = new Map();
    let stProblems = new Map();
    let ratingChangeMaps = [];
    let stRatingChangeDates = new Map();
    let ratingChanges:ratingChangeType = {
      labels : [],
      datasets : [],
    };
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
      for(let i = 0; i < acTime.length; i++){
        acTime[i].x = acTime[i].x - mn;
      }






      url = " https://codeforces.com/api/user.rating?handle=" + user;
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
      for(let i = 0; i < users.length; i++){
        ratingChanges.datasets[i].data.push(ratingChangeMaps[i].has(key) ? ratingChangeMaps[i].get(key) : null);
      }
      ratingChanges.labels.push(key);
    });
    ratingChanges.labels.sort();
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









    let user = {
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
    return NextResponse.json(user);
  }catch{
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
