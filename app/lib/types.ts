import { user_type } from "@prisma/client";

export type ratingChangeType = {
  labels : string[];
  datasets : {
    label : string;
    data : (number|null)[];
    borderColor : string;
    backgroundColor : string;
  }[]
};
export type cfUserType = {
  maxRating: number;
  maxRank: string;
  lastActive: string;
  registered: string;
  contribution: number | string;
  avatar : string;
  name : string;
  acTime : {x : number, y : number}[];
  calenderSubmissions : {date : string, count : number}[];
  diffData : { x: any; y: any; }[];
  catData : { x: any; y: any; }[];
  ratingChanges : ratingChangeType;
};
export type userType = {
  userName: string;
  fullName: string;
  registrationNumber: string | null;
  email: string;
  phone: string | null;
  vjudgeHandle: string | null;
  cfHandles: string[] | null;
  password: string;
  userType: user_type | null;
};
export type AuthContextType = {
  signedIn: boolean;
  loading: boolean;
  user: null | userStateType;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}
export type userStateType = {
  userName: string;
  userType: user_type|null;
};
//contestType. Contest has properties like name, venue, description, date, type, poster image.
export type contestType = {
  name: string;
  venue: string;
  description: string;
  date: string;
  type: string;
  poster?: string|null;
  id: number;
  author: string;
}

export type teamType = {
  id?: number;
  contest?: number;
  name: string;
  members: string[];
}
export type userTableEntryType = {
  userName: string;
  maxRating: string | number;
  maxRank: string;
  id: string;
  avatar: string;
  contribution: string | number;
};


