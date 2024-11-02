'use client'
import { contestType } from "@/app/lib/types";
import Link from "next/link";
import Button from '@mui/material/Button';
import AccessProvider from "../lib/AccessProvider";
import dynamic from 'next/dynamic';
const ContestList = dynamic(() => import('../ui/grids/ContestList'), { ssr: false });


export default function Contests({contestsProps, registeredContestsProps}: {contestsProps: contestType[], registeredContestsProps: number[]}) {
  return (
    <div className="flex flex-col items-left w-full">
      <AccessProvider permittedUsers={['admin', 'mentor']}>
        <Link href="/contests/create">
        <Button variant="contained" color="primary">
          Create Contest
        </Button>
      </Link>
      </AccessProvider>
      <ContestList contestsParams={contestsProps} registeredContestsParams={registeredContestsProps} closable = {true}></ContestList>
    </div>
  );
}

