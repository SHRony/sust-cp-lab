'use client'
import { contestType } from "@/app/lib/types";
import Link from "next/link";
import AccessProvider from "../../lib/AccessProvider";
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import { Plus, Trophy, Calendar, History } from "lucide-react";

const ContestList = dynamic(() => import('../../ui/grids/ContestList'), { ssr: false });

const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <motion.div 
    className="flex items-center gap-3"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="p-2 bg-blue-50 rounded-lg">
      <Icon className="w-6 h-6 text-blue-500" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800">
      {title}
    </h2>
  </motion.div>
);

export default function Contests({
  contestsProps, 
  registeredContestsProps
}: {
  contestsProps: contestType[], 
  registeredContestsProps: number[]
}) {
  const upcomingContests = contestsProps.filter(
    contest => new Date(contest.date).getTime() > new Date().setHours(0, 0, 0, 0)
  );
  
  const pastContests = contestsProps.filter(
    contest => new Date(contest.date).getTime() <= new Date().setHours(0, 0, 0, 0)
  );

  return (
    <motion.div 
      className="flex flex-col items-left w-full gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center px-4">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="p-3 bg-blue-50 rounded-xl">
            <Trophy className="w-7 h-7 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Contests
          </h1>
        </motion.div>

        <AccessProvider permittedUsers={['admin', 'mentor']}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/contests/create">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                Create Contest
              </motion.button>
            </Link>
          </motion.div>
        </AccessProvider>
      </div>

      {/* Upcoming Contests Section */}
      <div className="border-b">
        <div className="px-4">
          <SectionTitle icon={Calendar} title="Upcoming Contests" />
        </div>
        {upcomingContests.length > 0 ? (
          <ContestList 
            contestsParams={upcomingContests} 
            registeredContestsParams={registeredContestsProps} 
            closable={true} 
          />
        ) : (
          <motion.div 
            className="text-center py-12 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No upcoming contests at the moment
          </motion.div>
        )}
      </div>

      {/* Past Contests Section */}
      <div className="border-b">
        <div className="px-4">
          <SectionTitle icon={History} title="Past Contests" />
        </div>
        {pastContests.length > 0 ? (
          <ContestList 
            contestsParams={pastContests} 
            registeredContestsParams={registeredContestsProps} 
            closable={true} 
          />
        ) : (
          <motion.div 
            className="text-center py-12 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No past contests found
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
