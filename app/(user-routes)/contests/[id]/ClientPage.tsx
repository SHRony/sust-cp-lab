'use client'
import axios from 'axios';
import { useState } from 'react';
import {Button } from '@mui/material';
import Link from 'next/link';
import { contestType, teamType, userTableEntryType } from '@/app/lib/types';
import TeamCard from '@/app/ui/cards/TeamCard';
import AddIcon from '@mui/icons-material/Add';
import AccessProvider from '@/app/lib/AccessProvider';
import UserTable from '@/app/ui/tables/UserTable';
import Image from 'next/image';
import Card from '@/app/ui/cards/Card';
import { motion } from "framer-motion";
import { CalendarIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline';

export default function Contest({contest, users, teams}:{contest: contestType|null, users: userTableEntryType[], teams: teamType[]}) {
  if (!contest) {
    return <div>Contest not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-700 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold">{contest.name}</h1>
            
            <div className="flex flex-wrap gap-6 text-gray-100">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                <span>{contest.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                <span>{new Date(contest.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <TagIcon className="h-5 w-5" />
                <span>{contest.type}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Description and Poster Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-4">About the Contest</h2>
              <p className="text-gray-600 leading-relaxed">{contest.description}</p>
              <AccessProvider permittedUsers={['admin', 'mentor']}>
                <div className="mt-6">
                  <Link href={`/contests/${contest.id}/createteams`}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Create Teams
                    </Button>
                  </Link>
                </div>
              </AccessProvider>
            </div>
            {contest.poster && (
              <div className="w-full md:w-1/3">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={contest.poster}
                    alt="Contest poster"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Teams Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6">Teams</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teams.map((team, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <TeamCard team={team} onClose={() => {}} onRename={() => {}} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Users Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-2xl font-semibold mb-6">Registered Users</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <UserTable users={users} />
          </div>
        </motion.section>
      </div>
    </div>
  );
}
