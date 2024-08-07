import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card, Button } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import vjudge from '@/public/vjudge.png'
import { contestType, teamType, userType } from '@/app/lib/types';
import { GridColDef, GridCellParams, DataGrid } from '@mui/x-data-grid';
import TeamCard from '@/app/ui/cards/TeamCard';
import AddIcon from '@mui/icons-material/Add';
import AccessProvider from '@/app/lib/AccessProvider';
import { getContestInfo, getContestTeams, getContestUsers } from '@/app/api/queries/contest_queries';
import Contest from './ClientPage';
export default async function Page({params:{id}}:{params:{id:string}}) {
  const contest = await getContestInfo(Number(id));
  const users = await getContestUsers(Number(id)); 
  const teams = await getContestTeams(Number(id));
  if (!contest) {
    return <div>Contest not found</div>
  }

  return (
    <Contest contest={contest} users={users} teams={teams}></Contest>
  )
}

