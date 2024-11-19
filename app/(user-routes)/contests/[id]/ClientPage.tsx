'use client'
import axios from 'axios';
import { useState, useEffect } from 'react';
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
import { CalendarIcon, MapPinIcon, TagIcon, TrophyIcon, UserGroupIcon, ClockIcon, CheckCircleIcon, UsersIcon, LinkIcon } from '@heroicons/react/24/outline';
import TextField from '@/app/ui/input/TextField';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

interface TeamFormingContest {
  id: number;
  contest_id: number;
  vjudge_contest_id: number;
  vjudge_contest: {
    vjudge_id: string;
    is_result_available: boolean;
  };
  name: string;
}

export default function Contest({contest, users, teams, tfcs: initialTfcs}:{contest: contestType|null, users: userTableEntryType[], teams: teamType[], tfcs: TeamFormingContest[]}) {
  

  const [tfcs, setTfcs] = useState<TeamFormingContest[]>(initialTfcs);
  const [showAddTfc, setShowAddTfc] = useState(false);
  const [vjudgeId, setVjudgeId] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  const handleAddTfc = async (e: React.FormEvent) => {
    if(!contest) return;
    e.preventDefault(); 
    setError("");

    // Client-side validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!vjudgeId.trim()) {
      setError("Vjudge Contest ID is required");
      return;
    }
    if (!/^\d+$/.test(vjudgeId)) {
      setError("Vjudge Contest ID must be a number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/contests/${contest.id}/tfc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          vjudge_id: vjudgeId,
          name: name.trim()
        }),
      });

      if (response.ok) {
        setVjudgeId("");
        setName("");
        setShowAddTfc(false);
        setTfcs([...tfcs, {id: Math.floor(Math.random() * 1000), contest_id: contest.id, vjudge_contest_id: parseInt(vjudgeId), vjudge_contest: {vjudge_id: vjudgeId, is_result_available: false}, name: name.trim()}]);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add team forming contest");
      }
    } catch (error) {
      setError("Failed to add team forming contest");
    } finally {
      setLoading(false);
    }
  };
  if (!contest) {
    return <div>Contest not found</div>
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-800 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              {contest.name}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-gray-100">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <MapPinIcon className="h-5 w-5" />
                <span>{contest.venue}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <CalendarIcon className="h-5 w-5" />
                <span>{new Date(contest.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <TagIcon className="h-5 w-5" />
                <span>{contest.type}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Description and Poster Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-8 mb-8 backdrop-blur-xl bg-white/80"
        >
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                About the Contest
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">{contest.description}</p>
              <AccessProvider permittedUsers={['admin', 'mentor']}>
                <div className="mt-8">
                  <Link href={`/contests/${contest.id}/createteams`}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Create Teams
                    </Button>
                  </Link>
                </div>
              </AccessProvider>
            </div>
            {contest.poster && (
              <div className="w-full md:w-1/3">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
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
          className="bg-white rounded-xl shadow-sm p-8 mb-8 backdrop-blur-xl bg-white/80"
        >
          <div className="flex items-center gap-3 mb-8">
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Teams
            </h2>
          </div>
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

        {/* Team Forming Contests Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm p-8 mb-8 backdrop-blur-xl bg-white/80"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <TrophyIcon className="h-8 w-8 text-purple-500" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Team Forming Contests
              </h2>
            </div>
            <AccessProvider permittedUsers={['admin', 'mentor']}>
              <button
                onClick={() => setShowAddTfc(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <PlusIcon className="h-5 w-5" /> Add TFC
              </button>
            </AccessProvider>
          </div>

          {/* TFCs List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tfcs.map((tfc, index) => (
              <motion.div
                key={tfc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-purple-100 group">
                  <h3 className="text-xl font-bold text-purple-800 mb-4">{tfc.name}</h3>
                  <div className="space-y-3">
                    <Link 
                      href={`https://vjudge.net/contest/${tfc.vjudge_contest.vjudge_id}`}
                      target="_blank"
                      className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group"
                    >
                      <LinkIcon className="h-5 w-5 text-purple-400 group-hover:text-purple-600" />
                      <p className="text-sm">
                        VJudge Contest: <span className="font-medium text-purple-700 group-hover:text-purple-600 underline">{tfc.vjudge_contest.vjudge_id}</span>
                      </p>
                    </Link>
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircleIcon className={`h-5 w-5 ${tfc.vjudge_contest.is_result_available ? 'text-green-500' : 'text-gray-400'}`} />
                      <p className="text-sm">
                        Results: <span className={`font-medium ${tfc.vjudge_contest.is_result_available ? 'text-green-600' : 'text-gray-500'}`}>
                          {tfc.vjudge_contest.is_result_available ? "Available" : "Pending"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add TFC Modal */}
          {showAddTfc && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-xl w-[32rem] relative shadow-2xl"
              >
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  Add Team Forming Contest
                </h3>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
                <form onSubmit={handleAddTfc} className="space-y-6">
                  <div>
                    <TextField
                      label="Contest Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <TextField
                      label="VJudge Contest ID"
                      value={vjudgeId}
                      onChange={(e) => setVjudgeId(e.target.value)}
                      type="text"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddTfc(false)}
                      className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-200 disabled:from-purple-300 disabled:to-purple-200 shadow-md hover:shadow-lg disabled:shadow-none"
                    >
                      {loading ? "Adding..." : "Add Contest"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </motion.section>

        {/* Users Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm p-8 backdrop-blur-xl bg-white/80"
        >
          <div className="flex items-center gap-3 mb-8">
            <UsersIcon className="h-8 w-8 text-green-500" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Registered Users
            </h2>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <UserTable users={users} />
          </div>
        </motion.section>
      </div>
    </div>
  );
}
