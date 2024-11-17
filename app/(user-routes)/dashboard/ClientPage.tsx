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

interface DashboardProps {
  user: userStateType;
  cfInfo: cfUserType | null;
  contests: contestType[];
}

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
        <p className="mt-2 text-gray-600">Here's what's happening with your competitive programming journey.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Contests Card */}
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
      </div>

      {/* Rating Chart */}
      {cfInfo && cfInfo.ratingChanges.datasets[0].data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">Rating Progress</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cfInfo.ratingChanges.datasets[0].data.map((rating, index) => ({
                    name: cfInfo.ratingChanges.labels[index],
                    rating: rating
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="rating" 
                      stroke={rankColor} 
                      strokeWidth={2}
                      dot={{ fill: rankColor }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Contests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
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
    </div>
  );
};

export default ClientPage;
