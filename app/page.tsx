import Image from "next/image";
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import {HeroParallax} from "@/app/ui/aceternity/hero-perallax";
import { getContests, getRegisteredContestsList } from "@/app/api/queries/contest_queries";
import { LandingLamp } from "./ui/aceternity/landing-lamp";
import FeatureSections from "./ui/features";
export default async function Home() {
  const contests = await getContests();
  return (
    <LandingPage/>

  );
}

const LandingPage = () => {
  return (
    <div className="bg-slate-950 h-full w-full overflow-y-scroll overflow-x-hidden">
      <LandingLamp/>
      <FeatureSections/>
    </div>
  );
}

