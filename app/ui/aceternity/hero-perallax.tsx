"use client";
import React, { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import UserCardSkeleton from "../cards/UserCardSkeleton";
import { contestType } from "@/app/lib/types";
import ContestList from "../grids/ContestList";
import ContestCard from "../cards/ContestCard";

export const HeroParallax = ({
  products,
  contests,
  registeredContests,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
  contests: contestType[];
  registeredContests: number[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const contestsRef = React.useRef(null);
  const [scrollSt, setScrollSt] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  useEffect(() => {
    console.log(scrollSt);
  },[scrollSt]);
  
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] max-w-full"
      onWheel={(e) => setScrollSt(scrollYProgress.get())}
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
          pointerEvents: scrollSt > 0.19 ? "auto" : "none",
        }}
        ref={contestsRef}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20" >
          {/* {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))} */}
          <div className="grid w-full justify-between" style={{gridTemplateColumns: 'repeat(auto-fill, 21rem)'}}>
            {
              contests.map((contest) => (
                <div
                  key = {contest.id}
                  className={`p-1 relative ${contest.poster ? "row-span-2" : "row-span-1"}`}
                >
                  <ContestCard
                    contest={contest}
                    onClose={() => {}}
                    onRegister={() => {}}
                    registered = {registeredContests.some((id) => id === contest.id)}
                    closable = {false}
                  />
                </div>
              ))
            }
          </div>
          {/* <ContestList contestsParams={contests} registeredContestsParams={[]} closable = {false} ></ContestList> */}
          {/* <UserCardSkeleton  /> */}
          


        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
          <UserCardSkeleton  />
          <UserCardSkeleton  />
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
          <UserCardSkeleton  />
          <UserCardSkeleton  />
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    // Handle mouse down event
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    // Handle mouse move event
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    // Handle mouse up event
  };
  
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
        SUST COMPETETIVE PROGRAMMING LAB
      </h1>
      <p className="max-w-2xl md:text-xl mt-8 text-dim">
        I don{"'"}t even know what kind of things to write here. My hand kept typing and my mind went dead. I scream at myself when there{"'"}s nobody else to fight. I don{"'"}t win. I don{"'"}t lose. If I{"'"}m wrong then I{"'"}m halfway right.

      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl "
      >
        <Image
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
