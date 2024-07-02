// Implement a ContestCard. Contest has properties like name, venue, description, date, type, poster image. A contest card which don't have any poster image it uses a default imagesingle row in grid and a contest with image takes two rows in grid.Use the Card component.
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "./Card";
import { contestType } from "@/app/lib/types";
import AccessProvider from "@/app/lib/AccessProvider";
import CloseIcon from "@mui/icons-material/Close";
export default function ContestCard({ contest, onClose }: { contest: contestType, onClose: (id: number) => void }) {
  const contestPath = `/contests/${contest.id}`;
  return (
    <Card
      className={`flex flex-col items-start md:items-center gap-4 bg-white ${
        contest.poster ? "row-span-2" : ""
      }`}
    >
      <AccessProvider permittedUsers={['admin', 'mentor']}>
        <div className="w-full flex justify-end">
          <button onClick={() => onClose(contest.id)}>
            <CloseIcon />
          </button>
        </div>
      </AccessProvider>
      {contest.poster && (
        <div className="">
            <Image
              src={contest.poster}
              alt="Contest logo"
              layout={'responsive'}
              width={340}
              height={100}
              style={{ maxHeight: "220px" }}
            />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center items-start min-h-48 w-full p-4 bg-white overflow-y-scroll gap-3 grow" style={{ scrollbarWidth: "none" }}>
        <Link href={contestPath}>
          <h2 className="text-2xl font-bold text-center w-full">{contest.name}</h2>
        </Link>
        <div className="flex flex-col justify-center items-start gap-2">
          <p className="text-lg font-semibold text-gray-600">{contest.venue}</p>
          <p className="text-sm text-gray-600">{contest.description}</p>
          <p className="text-sm text-gray-600">
            Date: {new Date(contest.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Type: {contest.type}
          </p>
        </div>
      </div>
    </Card>
  );
}

