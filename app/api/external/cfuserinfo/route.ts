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
export async function GET(request:NextRequest) {
  
  try{
    let param = request.nextUrl.searchParams.get('user');
    if(!param || param == '') return NextResponse.json({ error: 'Missing parameters' }, { status: 500 });
    const users = param?.split(",");
    const response = await fetch('https://codeforces.com/api/user.info?handles='+users?.join(";"));
    const userData = await response.json();
    const userResult = userData.result;
    const contribution = userResult.reduce((mx:number, x:any)=>{ mx = Math.max(mx, x.contribution); return mx;}, 0);
    const lastActive = getTime(
      userResult.reduce((mn:any, x:any) => {
        mn = Math.min(mn, Math.floor(Date.now()/ 1000) - x.lastOnlineTimeSeconds);console.log(Date.now());
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
    
  
  
  
  
  
    let user = {
      contribution : contribution,
      lastActive : lastActive,
      maxRating : maxRating,
      maxRank : maxRank,
      registered : registered,
      avatar : avatar,
      name : name

    };
    return NextResponse.json(user);
  }catch{
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
