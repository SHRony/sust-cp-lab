import React from "react";
import Image from "next/image";
import Card from "../cards/Card";
import { cfUserType } from "@/app/lib/types";
import { ProfileInfoRow } from "@/app/ui/cards/UserCard";
import { motion } from "framer-motion";

export default function cfUserInfo({CFUser}:{CFUser:cfUserType|null}){
  if(!CFUser) return <></>;
  const {maxRating, maxRank, lastActive, registered, contribution, avatar, name} = CFUser;
  
  return (
    <Card className="flex flex-col items-start bg-card w-80 tablet:w-120 laptop:w-160 min-h-10 py-8 rounded">
      {/* Profile Header */}
      <div className="flex items-center gap-4 px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-full border-4 border-blue-100 overflow-hidden">
            <Image
              src={avatar}
              width={80}
              height={80}
              className="object-cover"
              alt="Profile"
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="flex-1"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-blue-600">
            {name}
          </h2>
          <div className="text-sm text-blue-500 font-medium">
            {maxRank}
          </div>
        </motion.div>
      </div>

      {/* Profile Info */}
      <motion.div 
        className="w-full mt-6 space-y-1 px-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <ProfileInfoRow label="Max Rating" value={maxRating.toString()} />
        <ProfileInfoRow label="Max Rank" value={maxRank} />
        <ProfileInfoRow label="Last Active" value={lastActive} />
        <ProfileInfoRow label="Registered" value={registered} />
        <ProfileInfoRow label="Contribution" value={contribution.toString()} />
      </motion.div>
    </Card>
  );
}
