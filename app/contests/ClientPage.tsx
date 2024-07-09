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

export default function Contests({contestsProps}: {contestsProps: contestType[]}) {
  const [contests, setContests] = useState<contestType[]>(contestsProps);
  const [registeredContests, setRegisteredContests] = useState<number[]>([]);
  const auth = useContext(authContext);
  useEffect(() => {
    const username = auth?.user?.userName || '';
    if(username){
      axios.get(`/api/profile/${username}/contests`)
        .then((res) => {
          if (res.status == 200) {
            setRegisteredContests(res.data.contests);
            console.log(res.data.contests);
          } else {
            console.log(res.data.error);
            alert('please try again');
          }
        })
        .catch((error) => {
          console.error("Error fetching registered contests:", error);
          alert('please try again');
        });
    }
  }, [auth]);
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
      <ContestList contestsParams={contests} registeredContestsParams={registeredContests} closable = {true}></ContestList>
    </div>
  );
}

