import Image from "next/image";
import { HeroParallax } from "@/app/ui/aceternity/hero-perallax";
import { getContests } from "@/app/api/queries";
export default async function Home() {
  const contests = await getContests();
  contests.splice(4); // remove everything after the first 5 contests
  return (
    <HeroParallax products={[]} contests = {contests}></HeroParallax>
  );
}
