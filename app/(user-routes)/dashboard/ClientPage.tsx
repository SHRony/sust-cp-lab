'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { cfUserType, contestType, userStateType } from '@/app/lib/types';
import { Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarIcon, TrophyIcon, UsersIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { getCFRankColor } from '@/app/lib/colors';
import DifficultyBarChart from '@/app/ui/cfviz/DifficultyBarChart';
import CatagoryBarChart from '@/app/ui/cfviz/CatagoryBarChart';
import RatingLineChart from '@/app/ui/cfviz/RatingLineChart';
import ScatterChart from '@/app/ui/cfviz/ScatterChart';
import CalenderHeatmap from '@/app/ui/cfviz/CalenderHeatmap';
import { 
  BarChart2, 
  LineChart as LineChartIcon, 
  CalendarDays, 
  ScatterChart as ScatterIcon,
  PieChart,
  Activity
} from 'lucide-react';

interface DashboardProps {
  user: userStateType;
  cfInfo: cfUserType | null;
  contests: contestType[];
}

interface ChartSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const ChartSection = ({ title, icon: Icon, children }: ChartSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>
    <Card className="w-full">
      <CardContent>
        {children}
      </CardContent>
    </Card>
  </motion.div>
);

const ClientPage: React.FC<DashboardProps> = ({ user, cfInfo, contests }) => {
  const rankColor = cfInfo ? getCFRankColor(cfInfo.maxRank) : '#000000';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.userName}!</h1>
        <p className="mt-2 text-gray-600">Here&apos;s what&apos;s happening with your competitive programming journey.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Only show CF stats for students */}
        {user.userType === 'student' && (
          <>
            {/* CF Rating Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">CF Rating</p>
                      <p className="mt-1 text-xl font-semibold" style={{ color: rankColor }}>
                        {cfInfo ? cfInfo.maxRating : 'Not connected'}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full">
                      <TrophyIcon className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    {cfInfo ? `Rank: ${cfInfo.maxRank}` : 'Connect your CF handle'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Problems Solved Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Problems Solved</p>
                      <p className="mt-1 text-xl font-semibold text-green-600">
                        {cfInfo ? cfInfo.acTime.length : 0}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-full">
                      <BookOpenIcon className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Keep solving to improve!
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contribution Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">CF Contribution</p>
                      <p className="mt-1 text-xl font-semibold text-orange-600">
                        {cfInfo ? cfInfo.contribution : 0}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-full">
                      <UsersIcon className="w-6 h-6 text-orange-500" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Community contribution score
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}

        {/* Contests Card - shown to all users */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Contests</p>
                  <p className="mt-1 text-xl font-semibold text-purple-600">{contests.length}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <CalendarIcon className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Active contests available
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Contests - shown to all users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Recent Contests</h2>
            <div className="space-y-4">
              {contests.map((contest, index) => (
                <Link href={`/contests/${contest.id}`} key={contest.id}>
                  <motion.div 
                    className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      {contest.poster ? (
                        <Image
                          src={contest.poster}
                          alt={contest.name}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-blue-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{contest.name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(contest.date).toLocaleDateString()} • {contest.venue}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* CF Visualization Section - only for students */}
      {user.userType === 'student' && (
        <div className="grid grid-cols-1 gap-8">
          <ChartSection title="Rating Progress" icon={LineChartIcon}>
            <RatingLineChart CFUser={cfInfo}/>
          </ChartSection>

          <ChartSection title="Problem Difficulty Distribution" icon={BarChart2}>
            <DifficultyBarChart CFUser={cfInfo}/>
          </ChartSection>

          <ChartSection title="Problem Categories" icon={PieChart}>
            <CatagoryBarChart CFUser={cfInfo}/>
          </ChartSection>

          <ChartSection title="Problem vs Rating" icon={Activity}>
            <ScatterChart user={cfInfo} />
          </ChartSection>

          <ChartSection title="Submission Activity" icon={CalendarDays}>
            <CalenderHeatmap user={cfInfo} />
          </ChartSection>
        </div>
      )}
    </div>
  );
};

export default ClientPage;
