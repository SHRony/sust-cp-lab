//create a page where there will be a create contest button on the top of the page. Then there will be list of contests in a grid layout. For displaying each contest use ContestCard component. For now use a dummy list of contests by defining an array in the top of the code. 

'use client'
import ContestCard from "@/app/ui/cards/ContestCard";
import { contestType } from "@/app/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";  
import Button from '@mui/material/Button';
import { useRouter } from "next/router";

export default function Contests() {
  const [contests, setContests] = useState<contestType[]>([]);

  useEffect(() => {
    const dummyContests: contestType[] = [
      {
        id: 1,
        name: "Contest 1",
        venue: "Venue 1",
        description: "Dummy contest 1",
        date: new Date().toISOString(),
        type: "Type 1",
        poster: "https://c4.wallpaperflare.com/wallpaper/177/182/521/abstract-fantasy-art-simple-background-digital-art-wallpaper-preview.jpg",
      },
      {
        id: 2,
        name: "Contest 2",
        venue: "Venue 2",
        description: "Dummy contest 2",
        date: new Date().toISOString(),
        type: "Type 2",
        poster: "https://c4.wallpaperflare.com/wallpaper/608/48/1018/digital-art-abstract-skull-white-background-wallpaper-preview.jpg",
      },
      {
        id: 3,
        name: "Contest 3",
        venue: "Venue 3",
        description: "Dummy contest 3",
        date: new Date().toISOString(),
        type: "Type 3",
      },
      {
        id: 4,
        name: "Contest 4",
        venue: "Venue 4",
        description: "Dummy contest 4",
        date: new Date().toISOString(),
        type: "Type 4",
        poster: "https://c4.wallpaperflare.com/wallpaper/771/126/358/facets-animals-parrot-digital-art-wallpaper-preview.jpg",
      },
      {
        id: 5,
        name: "Contest 5",
        venue: "Venue 5",
        description: "Dummy contest 5",
        date: new Date().toISOString(),
        type: "Type 5",
        poster: "https://c4.wallpaperflare.com/wallpaper/112/867/656/3d-abstract-artwork-circle-wallpaper-preview.jpg",
      },
      {
        id: 6,
        name: "Contest 6",
        venue: "Venue 6",
        description: "Dummy contest 6",
        date: new Date().toISOString(),
        type: "Type 6",
      },
      {
        id: 7,
        name: "Contest 7",
        venue: "Venue 7",
        description: "Dummy contest 7",
        date: new Date().toISOString(),
        type: "Type 7",
      },
      {
        id: 8,
        name: "Contest 8",
        venue: "Venue 8",
        description: "Dummy contest 8",
        date: new Date().toISOString(),
        type: "Type 8",
        poster: "https://c4.wallpaperflare.com/wallpaper/177/182/521/abstract-fantasy-art-simple-background-digital-art-wallpaper-preview.jpg",
      },
      {
        id: 9,
        name: "Contest 9",
        venue: "Venue 9",
        description: "Dummy contest 9",
        date: new Date().toISOString(),
        type: "Type 9",
        poster: "https://c4.wallpaperflare.com/wallpaper/608/48/1018/digital-art-abstract-skull-white-background-wallpaper-preview.jpg",
      },
      {
        id: 10,
        name: "Contest 10",
        venue: "Venue 10",
        description: "Dummy contest 10",
        date: new Date().toISOString(),
        type: "Type 10",
      },
    ];
    setContests(dummyContests);
  }, []);

  return (
    <div className="flex flex-col items-left w-full">
      <Link href="/contests/create" className="mt-10">
        <Button variant="contained" color="primary">
          Create Contest
        </Button>
      </Link>
      <div className="grid w-full gap-10 laptop:gap-4 desktop:gap-10 justify-center tablet:justify-between pt-20 rounded" style={{gridTemplateColumns: 'repeat(auto-fill, 20rem)'}}>
        {contests.map((contest) => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>
    </div>
  );
}
