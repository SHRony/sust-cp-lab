import { userTableEntryType } from "@/app/lib/types";
import prisma from "@/app/api/dbclient";
import { isLoggedIn } from "./user_queries";

export const getContests = async () => {
    const contests = await prisma.sust_cp_lab_contests.findMany({
        orderBy: {
            date: 'desc'
        }
    });
    return contests;
  }
  export const getRegisteredContests = async (username: string) => {
    try{
      const response = await prisma.sust_cp_lab_contestregistrations.findMany({
        where: {
          user_name: username
        },
        select: {
          contest_id: true
        }
      })
      const contests = response.map((row) => row.contest_id);
      return contests;
    }catch{
      return [];
    }
  }
  export const getRegisteredContestsList = async () => {
    const user = await isLoggedIn();
    if(!user?.userName) return [];
    return getRegisteredContests(user.userName);
  }
  
  
  export const getContestInfo = async (contestId: number) => {
    const contest = prisma.sust_cp_lab_contests.findUnique({
      where: {
        id: contestId
      }
    });
    return contest;
  }
  
  
  
  export const getContestUsers = async (contestId: number) => {
        const contestRegistrationLog = await prisma.sust_cp_lab_contestregistrations.findMany({
          where: {
            contest_id: contestId
          },
          select: {
            user_name: true
          }
        });
        const registeredUsers = contestRegistrationLog.map((row) => row.user_name);
        const cfResult = await prisma.sust_cp_lab_cf_cache.findMany({
          where: {
            username: {
              in: registeredUsers
            }
          },
          select: {
            username: true,
            info: true
          }
        });
        const ret:userTableEntryType[] = cfResult.map((row) => {
          const info = row.info as {
            maxRating: number;
            maxRank: string;
            avatar: string;
            contribution: number;
          };
          return {
            userName: row.username,
            maxRating: info.maxRating,
            maxRank: info.maxRank,
            id: row.username,
            avatar: info.avatar,
            contribution: info.contribution
          }
        });
      return ret;
  }
  
  
  export const getContestTeams = async (contestId: number) => {
    // console.log(typeof contestId);
      const registeredTeamIds = await prisma.sust_cp_lab_teams.findMany({
        where: {
          contest: contestId
        }
      })
      let teams:any = [];
      for(const row of registeredTeamIds){
        const teamMembers = await prisma.sust_cp_lab_team_members.findMany({
          where: {
            team_id: row.id
          }
        });
        
        teams.push({
          id: row.id,
          name: row.name,
          members: teamMembers.map((member) => member.user_name),
        });
      }
      return teams;
  }