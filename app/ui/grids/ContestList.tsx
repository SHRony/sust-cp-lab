"use client"
import React, { useState, useEffect, useContext } from 'react';
import {contestType} from "@/app/lib/types";
import ContestCard from '@/app/ui/cards/ContestCard';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { authContext } from '@/app/lib/AuthProvider';

export default function ContestList({contestsParams, registeredContestsParams, closable = true}: {contestsParams: contestType[], registeredContestsParams: number[], closable: boolean}) {
  const [contests, setContests] = useState(contestsParams);
  const [registeredContests, setRegisteredContests] = useState(registeredContestsParams);
  
  const [hoveredContest, setHoveredContest] = useState(-1);
  const [shadow, setShadow] = useState(false);
  const auth = useContext(authContext);

  const removeContest = (id: number) => {
      const updatedContests = [...contests];
      const index = updatedContests.findIndex((contest) => contest.id === id);
      updatedContests.splice(index, 1);
      setContests(updatedContests);
  }
  // useEffect(() => {
  //   setRegisteredContests(registeredContestsParams);
  // },[registeredContestsParams]);

  const register = async (id:number) => {
        setRegisteredContests([...registeredContests, id]);
  };
  return (
    <div className="grid w-full gap-10 laptop:gap-2 desktop:gap-8 justify-evenly tablet:justify-evenly items-stretch pt-4" style={{gridTemplateColumns: 'repeat(auto-fill, 21rem)'}}> 
      <AnimatePresence>
        {contests.map((contest) => (
          <motion.div layout key={contest.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`p-1 relative ${contest.poster ? "row-span-2" : "row-span-1"}`} onMouseEnter={() => {setHoveredContest(contest.id), setShadow(true)}}
          onMouseLeave={() => setShadow(false)}>
            <AnimatePresence>
            {hoveredContest === contest.id && (
              <motion.span
                className={`absolute inset-0 h-full w-full bg-hover block rounded-2xl  z-0  ${shadow ? "visible" : "invisible"}`}
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
              <ContestCard contest={contest} onClose={removeContest} registered={registeredContests.some(id => id === contest.id)} onRegister={()=>{register(contest.id)}} closable={closable}  />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}