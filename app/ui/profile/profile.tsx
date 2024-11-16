'use client'
import React, { useState, useEffect, useContext } from 'react';
import { authContext } from "@/app/lib/AuthProvider";
import { cfUserType, userType } from '@/app/lib/types';
import axios from 'axios';
import UserInfo from '@/app/ui/cfviz/CFUserInfo';
import CalenderHeatmap from '@/app/ui/cfviz/CalenderHeatmap';
import CatagoryBarChart from '@/app/ui/cfviz/CatagoryBarChart';
import DifficultyBarChart from '@/app/ui/cfviz/DifficultyBarChart';
import RatingLineChart from '@/app/ui/cfviz/RatingLineChart';
import ScatterChart from '@/app/ui/cfviz/ScatterChart';
import UserCard from '@/app/ui/cards/UserCard';
import UserCardSkeleton from '@/app/ui/cards/UserCardSkeleton';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  LineChart, 
  CalendarDays, 
  ScatterChart as ScatterIcon,
  PieChart,
  Activity
} from 'lucide-react';

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
    <div className="flex items-center gap-3 mb-4 px-4 sm:px-0">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="bg-white rounded-xl border border-gray-200 p-2 sm:p-6">
      {children}
    </div>
  </motion.div>
);

const Profile = ({userParams, cfUserParams}:{userParams : userType|null, cfUserParams : cfUserType|null}) => {
  const auth = useContext(authContext);
  const [user, setUser] = useState<userType|null>(userParams);
  const [cfUser, setCfUser] = useState<cfUserType|null>(cfUserParams);
  const [trigger, setTrigger] = useState(false);

  const addCFHandle = async (handle : string) => {
    if(user && user.cfHandles && !user.cfHandles.includes(handle)){
      setUser({...user, cfHandles: [...user.cfHandles, handle]});
      setTrigger(!trigger);
    }
  }

  const removeCFHandle = async (handle : string) => {
    if(user && user.cfHandles && user.cfHandles.includes(handle)){
      setUser({...user, cfHandles: user.cfHandles.filter((cfHandle) => cfHandle != handle)});
      setTrigger(!trigger);
    }
  }

  useEffect(() => {
    const fetchCFInfo = async () => {
      try {
        let handles = user?.cfHandles?.join(',') ?? '';
        const res = await axios.get(`/api/external/cfuserinfo?user=${handles}`);
        if(res.data){
          setCfUser(res.data);
          await axios.post('/api/userinfo/addcache', {username : user?.userName, info : res.data});
        }
      } catch (error) {
        setCfUser(null);
        console.error('Error fetching CF info:', error);
      }
    };
    fetchCFInfo();
  }, [user?.cfHandles, user?.userName]);
  
  return (
    <motion.div 
      className="flex flex-col items-center w-full pt-20 space-y-4 sm:space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* User Info Section */}
      <div className="flex flex-row flex-wrap w-full justify-center items-stretch gap-20">
        {user && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <UserCard 
              phone={''} 
              password='' 
              userName={user.userName}
              fullName={user.fullName}
              email={user.email}
              vjudgeHandle={user.vjudgeHandle}
              cfHandles={user.cfHandles}
              registrationNumber={user.registrationNumber}
              addCFHandle={addCFHandle}
              removeCFHandle={removeCFHandle}
              userType='student'
            />
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <UserInfo CFUser={cfUser}/>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="w-full px-2 sm:px-4 space-y-4 sm:space-y-8">
        <ChartSection title="Rating Progress" icon={LineChart}>
          <RatingLineChart CFUser={cfUser}/>
        </ChartSection>

        <ChartSection title="Problem Difficulty Distribution" icon={BarChart2}>
          <DifficultyBarChart CFUser={cfUser}/>
        </ChartSection>

        <ChartSection title="Problem Categories" icon={PieChart}>
          <CatagoryBarChart CFUser={cfUser}/>
        </ChartSection>

        <ChartSection title="Problem vs Rating" icon={Activity}>
          <ScatterChart user={cfUser} />
        </ChartSection>

        <ChartSection title="Submission Activity" icon={CalendarDays}>
          <CalenderHeatmap user={cfUser} />
        </ChartSection>
      </div>
    </motion.div>
  );
}

export default Profile;
