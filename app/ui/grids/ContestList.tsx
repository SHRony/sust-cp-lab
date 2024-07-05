import React, { useState, useEffect, useContext } from 'react';
import {contestType} from "@/app/lib/types";
import ContestCard from '@/app/ui/cards/ContestCard';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { authContext } from '@/app/lib/AuthProvider';

export default function ContestList({contestsParams, registeredContestsParams}: {contestsParams: contestType[], registeredContestsParams: number[]}) {
  const [contests, setContests] = useState(contestsParams);
  const [registeredContests, setRegisteredContests] = useState(registeredContestsParams);
  
  const [hoveredContest, setHoveredContest] = useState(-1);
  const [shadow, setShadow] = useState(false);
  const auth = useContext(authContext);

  const removeContest = (id: number) => {
      const updatedContests = [...contests];
      axios.post(`/api/contests/delete`, {id : id}).then(res => {
        if(res.status == 200){
          const index = updatedContests.findIndex((contest) => contest.id === id);
          updatedContests.splice(index, 1);
          setContests(updatedContests);
        }
      })
  }
  useEffect(() => {
    setRegisteredContests(registeredContestsParams);
  },[registeredContestsParams]);

  const register = async (id:number) => {
    try {
      const res = await axios.post(`/api/contests/${id}/registration`, { username: auth?.user?.userName || '' });
      if(res.status == 200){
        setRegisteredContests([...registeredContests, id]);
      }
    } catch (error) {
      console.error('Error registering for contest:', error);
      alert('Error registering for contest. Please try again.');
    }
  };
  return (
    <div className="grid w-full gap-10 laptop:gap-2 desktop:gap-8 justify-center tablet:justify-between pt-20 items-stretch" style={{gridTemplateColumns: 'repeat(auto-fill, 21rem)'}}> 
      <AnimatePresence>
        {contests.map((contest) => (
          <motion.div layout key={contest.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`p-1 relative ${contest.poster ? "row-span-2" : "row-span-1"}`} onMouseEnter={() => {setHoveredContest(contest.id), setShadow(true)}}
          onMouseLeave={() => setShadow(false)}>
            <AnimatePresence>
            {hoveredContest === contest.id && (
              <motion.span
                className={`absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-2xl  z-0  ${shadow ? "visible" : "invisible"}`}
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
              <ContestCard contest={contest} onClose={removeContest} registered={registeredContests.some(id => id === contest.id)} onRegister={()=>{register(contest.id)}}  />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}