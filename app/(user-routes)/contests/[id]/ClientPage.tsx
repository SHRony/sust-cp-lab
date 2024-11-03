'use client'
import axios from 'axios';
import { useState } from 'react';
import {Button } from '@mui/material';
import Link from 'next/link';
import { contestType, teamType, userTableEntryType } from '@/app/lib/types';
import TeamCard from '@/app/ui/cards/TeamCard';
import AddIcon from '@mui/icons-material/Add';
import AccessProvider from '@/app/lib/AccessProvider';
import UserTable from '@/app/ui/tables/UserTable';
import Image from 'next/image';
import Card from '@/app/ui/cards/Card';
export default function Contest({contest, users, teams}:{contest: contestType|null, users: userTableEntryType[], teams: teamType[]}) {
  if (!contest) {
    return <div>Contest not found</div>
  }

  return (
    <div className="text-gray-600">
      <div className="flex flex-col gap-4 p-4 border-b">
        <div className="flex flex-col">
          <div className='flex flex-row'>
            <div className="text-3xl font-bold text-left grow">{contest.name}</div>
            
          </div>
          <div className="flex flex-row flex-wrap gap-4">
            <p className="text-lg text-dim">Venue : {contest.venue}</p>
            <p className="text-lg text-dim">
              Date: {new Date(contest.date).toLocaleDateString()}
            </p>
            <p className="text-lg text-dim">
              Type: {contest.type}
            </p>
            
          </div>
        
        </div>
        <div className="flex flex-row gap-20">
          <p className="text-lg text-dim text-left ">{contest.description}</p>
          {contest.poster && <Image src={contest.poster} alt="poster" width={300} height={300}></Image>}
        </div>
        <div className="flex justify-begin">
              <AccessProvider permittedUsers={['admin', 'mentor']}>
                <Link href={`/contests/${contest.id}/createteams`} className="">
                  <Button variant="outlined" className="w-48"
                    startIcon = {<AddIcon/>}
                    >
                      Create Teams :
                    </Button>
                </Link>
              </AccessProvider>
            </div>


      </div>
      <div className="flex flex-col gap-4 p-4 border-b">
        <h3 className="text-2xl font-semibold ">Teams :</h3>
        <div className='flex flex-row flex-wrap p-4 gap-4'>
          {teams.map((team, index) => (
            <div key={index} className="mb-4 w-64 items-stretch">
              <TeamCard team = {team} onClose={() =>{}} onRename={()=>{}} />
            </div>
        ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 border-b">
        <h3 className="text-2xl font-semibold mt-10">Registered Users :</h3>
        <div style={{ overflowX: 'scroll', scrollbarWidth: 'none', width: '100%' }}>
        <UserTable users={users}></UserTable>
        </div>
      </div>

  </div>
  )
}

