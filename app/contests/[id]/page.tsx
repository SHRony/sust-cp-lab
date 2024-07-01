'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card, Button } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import vjudge from '@/public/vjudge.png'
import { contestType } from '@/app/lib/types';

export default function Page({params:{id}}:{params:{id:number}}) {
  const [contest, setContest] = useState<contestType | null>(null);

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(`/api/contests/${id}`);
        const data = response.data;
        if (data) {
          setContest(data);
        } else {
          setContest(null);
        }
      } catch (error) {
        console.error("Error fetching contest:", error);
        setContest(null);
      }
    };
    fetchContest();
  }, [id]);

  if (!contest) {
    return <div>Contest not found</div>
  }

  return (
    <Card className="flex flex-col gap-4 mt-20 p-4">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold text-left w-full">{contest.name}</h2>
        <div className="flex flex-row flex-wrap gap-4">
          <div className="flex flex-col items-center justify-center w-12">
            <Image src={vjudge} alt="Vjudge Logo" width={30} height={30} />
          </div>
          <p className="text-lg text-gray-600">Venue : {contest.venue}</p>
          <p className="text-lg text-gray-600">
            Date: {new Date(contest.date).toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-600">
            Type: {contest.type}
          </p>
        </div>
      </div>
      <p className="text-lg text-gray-600 text-left">{contest.description}</p>
      <div className="flex flex-row justify-between">
        <h3 className="text-2xl font-semibold text-left w-full">Team Forming Contests</h3>
        <Link href={`/contests/${contest.id}/createteams`} className="">
          <Button
          variant="contained"
          className="w-48 m-2"
          sx={{
            background: 'var(--primary)',
            '&:hover': {
              background: 'var(--primary) !important',
              color: 'var(--onPrimary) !important',
            },
          }}
        >
            Add TFC
          </Button>
        </Link>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4 rounded" >
          <div className="flex items-center justify-center w-12 h-full" >
            <Image src={vjudge} alt="Vjudge Logo" width={30} height={30} />
          </div>
          <p className="text-lg p-1 rounded" style={{backgroundColor: 'var(--primaryContainer)', color: 'var(--primary)'}}>Team Forming Contest 1</p>
        </div>
        <div className="flex items-center gap-4 rounded" >
          <div className="flex items-center justify-center w-12 h-full" >
            <Image src={vjudge} alt="Vjudge Logo" width={30} height={30} />
          </div>
          <p className="text-lg p-1 rounded" style={{backgroundColor: 'var(--primaryContainer)', color: 'var(--primary)'}}>Team Forming Contest 2</p>
        </div>
        <div className="flex items-center gap-4 rounded" >
          <div className="flex items-center justify-center w-12 h-full" >
            <Image src={vjudge} alt="Vjudge Logo" width={30} height={30} />
          </div>
          <p className="text-lg p-1 rounded" style={{backgroundColor: 'var(--primaryContainer)', color: 'var(--primary)'}}>Team Forming Contest 3</p>
        </div>
      </div>
    </Card>
  )
}

