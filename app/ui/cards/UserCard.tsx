import { userType } from "@/app/lib/types";
import Card from "./Card";
import Image from "next/image";
import editIcon from '@/public/edit.png';
import closeIcon from '@/public/close.png';

import { Input, Skeleton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {authContext} from "@/app/lib/AuthProvider";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import AccessProvider from "@/app/lib/AccessProvider";
export default function UserCard({userName, fullName, registrationNumber, email, vjudgeHandle, cfHandles, phone, addCFHandle, removeCFHandle} : userType & {addCFHandle : (handle : string) => void, removeCFHandle : (handle : string) => void}) {
  const auth = useContext(authContext);

  return (
    <Card className="flex flex-col items-start bg-card w-80 tablet:w-120 laptop:w-160 min-h-10 py-8 rounded text-gray-600">
      <div 
        className="flex justify-center items-center text-2xl font-bold text-shadow-2xl text-center px-10 mb-5 bg-blue-100 text-blue-600 rounded-r-full border-l-2 border-blue-600"
      >
        {userName}
      </div>
      <ProfileInfoRow label="Full Name" value={fullName} />
      <ProfileInfoRow label="Email" value={email} />
      <ProfileInfoRow label="Phone" value={phone ? phone : 'Not Set'} />
      <ProfileInfoRow label="Reg Number" value={registrationNumber ? registrationNumber : 'Not Set'} />
      <ProfileInfoRow label="Vjudge Handle" value={vjudgeHandle ? vjudgeHandle : 'Not Set'} />

      <div className="flex flex-row justify-start w-full p-2">
        <div className="font-bold text-text w-40 leading-8">
          CF Handles :
        </div>
        <div className="flex flex-row flex-wrap gap-2 items-start">
          {
            cfHandles?.map((handle)=>{
              return (
                <div 
                  key={handle} 
                  className="flex flex-row items-center rounded border px-4 bg-green-100 text-green-600 rounded-full"
                  >
                    <a 
                      className="flex font-bold h-7 items-center" 
                      href={'https://codeforces.com/profile/' + handle}
                      >
                        {handle}
                    </a>
                  
                </div>
              )
            })
          }

        </div>
      </div>
    </Card>
  )
}
export const ProfileInfoRow = ({label, value}:{label:string, value:string}) => {
  return (
    <div className="flex flex-row justify-start w-full p-2 wrap">
      <div className="font-bold text-text w-40">
        {label} :
      </div>
      <div className="text-dim">
        {value}
      </div>
    </div>
  )
}