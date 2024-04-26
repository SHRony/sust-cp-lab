export type ratingChangeType = {
  labels : string[];
  datasets : {
    label : string;
    data : number[];
    borderColor : string;
    backgroundColor : string;
  }[]
};
export type userType = Readonly<{
  maxRating: number | string;
  maxRank: string;
  lastActive: string;
  registered: string;
  contribution: number | string;
  avatar : string;
  name : string;
  acTime : {x : number, y : number}[];
  calenderSubmissions : {date : string, count : number};
  diffData : { x: any; y: any; }[];
  catData : { x: any; y: any; }[];
  ratingChanges : ratingChangeType;
}>;