import React, { useState, useEffect, useContext, Suspense } from 'react';
import { cfUserType, userType } from '@/app/lib/types';
import { getCFInfo, getUserInfo } from '@/app/api/queries';
import Profile from '@/app/ui/profile/profile';

export default async function Page({params : {username}} : {params : {username : string}}) {
  const user: userType|null = await getUserInfo(username);
  const cfUser: cfUserType|null = await getCFInfo(user?.cfHandles||[]);
  return (
    <Profile userParams={user} cfUserParams={cfUser}>

    </Profile>
  )
}
