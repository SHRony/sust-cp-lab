// Implement a ContestCard. Contest has properties like name, venue, description, date, type, poster image. A contest card which don't have any poster image it uses a default imagesingle row in grid and a contest with image takes two rows in grid.Use the Card component.
import React from "react";
import Image from "next/image";
import Card from "./Card";
import cfLogo from "@/public/cf.svg";
import Link from "next/link";
import { contestType } from "@/app/lib/types";

export default function ContestCard({ contest }: { contest: contestType }) {
  const contestPath = `/contest/${contest.id}/${encodeURIComponent(
    contest.name
  )}`;
  return (
    <Card
      className={`flex flex-col items-start md:items-center gap-4 ${
        contest.poster ? "row-span-2" : ""
      }`}
    >
      {contest.poster && (
        <div className="flex-1">
          <Link href={contestPath}>
            <Image
              src={contest.poster}
              alt="Contest logo"
              width={300}
              height={100}
            />
          </Link>
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center items-start min-h-48 w-full p-4 bg-white">
        <h2 className="text-2xl font-bold text-center w-full">{contest.name}</h2>
        <div className="flex flex-col justify-center items-start">
          <p className="text-lg font-semibold text-gray-600">{contest.venue}</p>
          <p className="text-sm text-gray-600">{contest.description}</p>
          <p className="text-sm text-gray-600">
            Date: {new Date(contest.date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Card>
  );
}
