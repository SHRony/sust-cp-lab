import { NextResponse, NextRequest } from "next/server";

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
    let st = new Map();
    for(const user of users){
      let url = "https://codeforces.com/api/user.status?handle=" + user;
      let statusResponse = await fetch(url);
      let statusData = await statusResponse.json();
      let statusResult = statusData.result;

      for(const submission of statusResult) {
        let problemName = submission.problem.name;
        let date = getDate(submission.creationTimeSeconds);
        dateCnt.set(date, dateCnt.has(date) ? dateCnt.get(date) + 1 : 1);
        if(submission.verdict == 'OK' && !st.has(problemName)){
          mn = Math.min(mn, Math.round(submission.creationTimeSeconds / 86400));
          if(submission.problem.rating){
            acTime.push({
              x: Math.round(submission.creationTimeSeconds / 86400),
              y: submission.problem.rating
            })
          }
          st.set(problemName, 1);
          solvedProblems.push(submission.problem);
        }
      }
      for(let i = 0; i < acTime.length; i++){
        acTime[i].x = acTime[i].x - mn;
      }
      
    }
    let calenderSubmissions:{date : string, count : number}[] = [];
    dateCnt.forEach((value, key) => {
      // console.log(`Key: ${key}, Value: ${value}`);
      calenderSubmissions.push({
        date : key, 
        count : value
      });
    });
    let diffCount = new Map();
    let catCount = new Map();
    for(const problem of solvedProblems){
      diffCount.set(problem.rating , diffCount.has(problem.rating) ? diffCount.get(problem.rating) + 1 : 1);
      for(const tag of problem.tags){
        catCount.set(tag, catCount.has(tag) ? catCount.get(tag) + 1 : 1);
      }
    }
  
  
    let user = {
      contribution : contribution,
      lastActive : lastActive,
      maxRating : maxRating,
      maxRank : maxRank,
      registered : registered,
      avatar : avatar,
      name : name,
      acTime : acTime,
      calenderSubmissions : calenderSubmissions
    };
    return NextResponse.json(user);
  }catch{
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
