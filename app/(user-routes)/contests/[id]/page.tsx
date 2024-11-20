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
import { getContestInfo, getContestUsers, getContestTeams } from "@/app/api/queries/contest_queries";
import { getTfcs, getTfcRanks } from "@/app/api/queries/add_vjudge_queries";
import Contest from './ClientPage';

export default async function Page({params:{id}}:{params:{id:string}}) {
  const contestId = parseInt(id);
  const [contest, users, teams, tfcs, tfcRanks] = await Promise.all([
    getContestInfo(contestId),
    getContestUsers(contestId),
    getContestTeams(contestId),
    getTfcs(contestId),
    getTfcRanks(contestId)
  ]);

  if (!contest) {
    return <div>Contest not found</div>
  }

  return (
    <Contest 
      contest={contest} 
      users={users} 
      teams={teams} 
      teamFormingContests={tfcs}
      tfcRanks={tfcRanks}
    />
  )
}
