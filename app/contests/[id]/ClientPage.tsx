'use client'
import axios from 'axios';
import { useState } from 'react';
import { Card, Button } from '@mui/material';
import Link from 'next/link';
import { contestType, teamType, userTableEntryType } from '@/app/lib/types';
import TeamCard from '@/app/ui/cards/TeamCard';
import AddIcon from '@mui/icons-material/Add';
import AccessProvider from '@/app/lib/AccessProvider';
import UserTable from '@/app/ui/tables/UserTable';
import Image from 'next/image';
export default function Contest({contest, users, teams}:{contest: contestType|null, users: userTableEntryType[], teams: teamType[]}) {
  if (!contest) {
    return <div>Contest not found</div>
  }

  return (
    <div>
    <Card className="flex flex-col gap-4 mt-20 p-4">
      <div className="flex flex-col">
         <div className='flex flex-row'>
          <div className="text-3xl font-bold text-left grow">{contest.name}</div>
          <div className="flex justify-end">
            <AccessProvider permittedUsers={['admin', 'mentor']}>
              <Link href={`/contests/${contest.id}/createteams`} className="">
                <Button variant="contained" className="w-48" sx={{
                    background: 'var(--primary)',
                    '&:hover': {
                      background: 'var(--primary) !important',
                      color: 'var(--onPrimary) !important',
                    },
                  }}
                  startIcon = {<AddIcon/>}
                  >
                    Create Teams
                  </Button>
              </Link>
            </AccessProvider>
          </div>
         </div>
        <div className="flex flex-row flex-wrap gap-4">
          <p className="text-lg text-gray-600">Venue : {contest.venue}</p>
          <p className="text-lg text-gray-600">
            Date: {new Date(contest.date).toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-600">
            Type: {contest.type}
          </p>
          
        </div>
       
      </div>
      <div className="flex flex-row gap-20">
        <p className="text-lg text-gray-600 text-left ">{contest.description}</p>
        {contest.poster && <Image src={contest.poster} alt="poster" width={300} height={300}></Image>}
      </div>
      <div className="flex flex-row justify-between">
        <Link href={`/contests/${contest.id}/createteams`} className="">
        </Link>
      </div>


    </Card>
    <h3 className="text-2xl font-semibold mt-10">Teams</h3>
    <div className='flex flex-row flex-wrap p-4 gap-4'>
      {teams.map((team, index) => (
        <div key={index} className="mb-4 w-64 items-stretch">
          <TeamCard team = {team} onClose={() =>{}} onRename={()=>{}} />
        </div>
    ))}
    </div>
    <h3 className="text-2xl font-semibold mt-10">Registered Users</h3>
    <div style={{ overflowX: 'scroll', scrollbarWidth: 'none', width: '100%' }}>
     <UserTable users={users}></UserTable>
    </div>


  </div>
  )
}

