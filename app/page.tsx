import Image from "next/image";
import dynamic from 'next/dynamic';
import {HeroParallax} from "@/app/ui/aceternity/hero-perallax";
import { getContests, getRegisteredContestsList } from "@/app/api/queries/contest_queries";
export default async function Home() {
  const contests = await getContests();
  //get registered contests of current user
  const registeredContests = await getRegisteredContestsList();
  return (
    <HeroParallax products={[]} contests = {contests} registeredContests = {registeredContests}></HeroParallax>
  );
}
