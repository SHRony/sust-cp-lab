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
  const removeContest = async (id: number) => {
    try {
      axios.post("/api/contests/delete", { id: id });
      setContests(contests.filter((contest) => contest.id !== id));
    } catch (error) {
      console.error("Error deleting contest:", error);
    }
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
      <div className="grid w-full gap-10 laptop:gap-8 desktop:gap-10 justify-center tablet:justify-between pt-20 rounded" style={{gridTemplateColumns: 'repeat(auto-fill, 20rem)'}}>
        {contests.map((contest) => (
          <ContestCard key={contest.id} contest={contest} onClose={removeContest} registered={registeredContests.includes(contest.id)} />
        ))}
      </div>
    </div>
  );
}

