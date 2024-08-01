import dbTables from "@/app/lib/dbTables";
import { userTableEntryType } from "@/app/lib/types";
import client from "@/app/api/dbclient";
import { isLoggedIn } from "./user_queries";

export const getContests = async () => {
    const response = await client.query(
        `SELECT * FROM ${dbTables.contests} ORDER BY date DESC`
      );
      const contests = response.rows.map((row) => row);
      return contests;
  }
  export const getRegisteredContests = async (username: string) => {
    try{
      const response = await client.query(`SELECT contest_id FROM ${dbTables.contest_registrations} WHERE user_name = $1`, [username]);
      const contests = response.rows.map((row) => row.contest_id);
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
  
  
  export const getContest = async (contestId: string) => {
    const response = await client.query(
        `SELECT * FROM ${dbTables.contests} WHERE id = $1`, [contestId]
      );
      const contest = response.rows[0];
      return contest;
  }
  
  
  
  export const getContestUsers = async (id: string) => {
        const registrationResults = await client.query(`SELECT user_name FROM ${dbTables.contest_registrations} WHERE contest_id = $1`, [id]);
        const registeredUsers = registrationResults.rows.map((row) => row.user_name);
        const cfResult = await client.query(`SELECT * FROM ${dbTables.cf_cache}`);
        const users = cfResult.rows.filter((row) => registeredUsers.includes(row.username));
        const ret:userTableEntryType[] = users.map((row) => {
          return {
            userName: row.username,
            maxRating: row.info.maxRating,
            maxRank: row.info.maxRank,
            id: row.username,
            avatar: row.info.avatar,
            contribution: row.info.contribution
          }
        });
      return ret;
  }
  
  
  export const getContestTeams = async (id: string) => {
    const response = await client.query(`
        SELECT * FROM ${dbTables.teams} WHERE contest = $1
      `, [id]);
      let teams:any = [];
      for(const row of response.rows){
        const memberRes = await client.query(`
            SELECT * FROM ${dbTables.team_members} WHERE team_id = $1
          `, [row.id]);
        
        teams.push({
          id: row.id,
          name: row.name,
          members: memberRes.rows.map((r) => r.user_name),
        });
      }
      return teams;
  }