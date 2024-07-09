'use client'
import ContestCard from "@/app/ui/cards/ContestCard";
import { contestType } from "@/app/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useContext } from "react";  
import Button from '@mui/material/Button';
import { useRouter } from "next/router";
import axios from "axios";
import AccessProvider from "../lib/AccessProvider";
import { authContext } from "../lib/AuthProvider";
import { AnimatePresence, motion } from "framer-motion";
import ContestList from "../ui/grids/ContestList";

export default function Contests({contestsProps, registeredContestsProps}: {contestsProps: contestType[], registeredContestsProps: number[]}) {
  return (
    <div className="flex flex-col items-left w-full">
      <AccessProvider permittedUsers={['admin', 'mentor']}>
        <Link href="/contests/create" className="mt-10">
        <Button variant="contained" color="primary">
          Create Contest
        </Button>
      </Link>
      </AccessProvider>
      {/* <div className="grid w-full gap-10 laptop:gap-8 desktop:gap-10 justify-center tablet:justify-between pt-20 rounded" style={{gridTemplateColumns: 'repeat(auto-fill, 20rem)'}}>
        <AnimatePresence>
        {contests.map((contest) => (
          <motion.div className={contest.poster ? "row-span-2" : ""} layout key={contest.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ContestCard contest={contest} onClose={() => removeContest(contest.id)} registered={registeredContests.includes(contest.id)} />
          </motion.div>
        ))}
        </AnimatePresence>
      </div> */}
      <ContestList contestsParams={contestsProps} registeredContestsParams={registeredContestsProps} closable = {true}></ContestList>
    </div>
  );
}

