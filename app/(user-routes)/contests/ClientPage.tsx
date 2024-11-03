'use client'
import { contestType } from "@/app/lib/types";
import Link from "next/link";
import Button from '@mui/material/Button';
import AccessProvider from "../../lib/AccessProvider";
import dynamic from 'next/dynamic';
const ContestList = dynamic(() => import('../../ui/grids/ContestList'), { ssr: false });


export default function Contests({contestsProps, registeredContestsProps}: {contestsProps: contestType[], registeredContestsProps: number[]}) {
  return (
    <div className="flex flex-col items-left w-full gap-8">
      <AccessProvider permittedUsers={['admin', 'mentor']}>
        <Link href="/contests/create">
        <Button variant="contained" color="primary">
          Create Contest
        </Button>
      </Link>
      </AccessProvider>
      <div className="border-b">
        <h2 className="text-2xl font-bold text-left px-4 text-gray-600">Upcoming Contests :</h2>
        <ContestList contestsParams={contestsProps.filter((contest) => new Date(contest.date).getTime() > new Date().setHours(0, 0, 0, 0))} registeredContestsParams={registeredContestsProps} closable = {true}></ContestList>
      </div>
      <div className="border-b">
        <h2 className="text-2xl font-bold text-left px-4 text-gray-600">Past Contests :</h2>
        <ContestList contestsParams={contestsProps.filter((contest) => new Date(contest.date).getTime() <= new Date().setHours(0, 0, 0, 0))} registeredContestsParams={registeredContestsProps} closable = {true}></ContestList>
      </div>
    </div>
  );
}

