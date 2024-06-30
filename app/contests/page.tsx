//create a page where there will be a create contest button on the top of the page. Then there will be list of contests in a grid layout. For displaying each contest use ContestCard component. For now use a dummy list of contests by defining an array in the top of the code. 

'use client'
import ContestCard from "@/app/ui/cards/ContestCard";
import { contestType } from "@/app/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";  
import Button from '@mui/material/Button';
import { useRouter } from "next/router";
import axios from "axios";

export default function Contests() {
  const [contests, setContests] = useState<contestType[]>([]);

  useEffect(() => {
    axios.get("/api/contests")
      .then((res) => {
        if (res.status == 200) {
          setContests(res.data);
        } else {
          console.log(res.data.error);
          alert('please try again');
        }
      })
      .catch((error) => {
        console.error("Error fetching contests:", error);
        alert('please try again');
      });
  }, []);

  return (
    <div className="flex flex-col items-left w-full">
      <Link href="/contests/create" className="mt-10">
        <Button variant="contained" color="primary">
          Create Contest
        </Button>
      </Link>
      <div className="grid w-full gap-10 laptop:gap-8 desktop:gap-10 justify-center tablet:justify-between pt-20 rounded" style={{gridTemplateColumns: 'repeat(auto-fill, 20rem)'}}>
        {contests.map((contest) => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>
    </div>
  );
}

