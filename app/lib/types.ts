export type userType = Readonly<{
  maxRating: number | string;
  maxRank: string;
  lastActive: string;
  registered: string;
  contribution: number | string;
  avatar : string;
  name : string;
  acTime : {x : number, y : number}[]
  calenderSubmissions : {date : string, count : number}
}>;