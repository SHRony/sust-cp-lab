export type ratingChangeType = {
  labels : string[];
  datasets : {
    label : string;
    data : (number|null)[];
    borderColor : string;
    backgroundColor : string;
  }[]
};
export type cfUserType = Readonly<{
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
export type userType = {
  userName: string;
  fullName: string;
  registrationNumber: string | null;
  email: string;
  phone: string | null;
  vjudgeHandle: string | null;
  cfHandles: string[] | null;
  password: string;
};
export type AuthContextType = {
  signedIn: boolean;
  loading: boolean;
  user: null | { /* Define user object properties */ };
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}
export type userStateType = {
  userName: string;
  userType: string;
};