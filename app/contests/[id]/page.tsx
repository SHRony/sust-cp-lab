'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card, Button } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import vjudge from '@/public/vjudge.png'
import { contestType, teamType, userType } from '@/app/lib/types';
import { GridColDef, GridCellParams, DataGrid } from '@mui/x-data-grid';
import TeamCard from '@/app/ui/cards/TeamCard';
import AddIcon from '@mui/icons-material/Add';
import AccessProvider from '@/app/lib/AccessProvider';
export default function Page({params:{id}}:{params:{id:number}}) {
  const [contest, setContest] = useState<contestType | null>(null);
  const [users, setUsers] = useState<userType[]>([]);
  const [teams, setTeams] = useState<teamType[]>([]);
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await axios.get(`/api/contests/${id}`);
        const data = response.data;
        if (data) {
          setContest(data);
        } else {
          setContest(null);
        }
      } catch (error) {
        console.error("Error fetching contest:", error);
        setContest(null);
      }
    };
    const fetchUsers = async () => {
        const response = await axios.get(`/api/contests/${id}/users`);
        const data = response.data;
        setUsers(data.users.map((user: {username: string, info: {maxRating: number, maxRank: number, avatar: string, contribution: number}}) => {return {userName: user.username, maxRating: user.info.maxRating, maxRank: user.info.maxRank, id: user.username, avatar: user.info.avatar, contribution: user.info.contribution}}));
    }
    const fetchTeams = async () => {
        const response = await axios.get(`/api/contests/${id}/teams`);
        const data = response.data;
        setTeams(data);
    }
    fetchContest();
    fetchUsers();
    fetchTeams();
  }, [id]);
    const columns: GridColDef[] = [
    { 
      field: 'avatar', 
      headerName: '', 
      flex: 1, 
      minWidth: 50,
      maxWidth: 50,
      renderCell: (params: GridCellParams) => (
        
        <div className='h-full flex justify-center items-center w-8'>
          <Image style={{borderRadius: '50%', height: '30px', width: '30px', objectFit: 'cover'}} src={params.row.avatar} alt={params.row.username} width={30} height={30}/>
        </div>
      ),
    },
    { 
      field: 'username', 
      headerName: 'Username', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridCellParams) => (
        <Link href={`/profile/${params.row.userName}`}>
          {params.row.userName}
        </Link>
      ),
    },
    { field: 'maxRating', headerName: 'Max Rating', flex: 1, minWidth: 150 },
    { field: 'maxRank', headerName: 'Max Rank', flex: 1, minWidth: 150 },
    { field: 'contribution', headerName: 'Contribution', flex: 1, minWidth: 150 },
  ];


  if (!contest) {
    return <div>Contest not found</div>
  }

  return (
    <div>
    <Card className="flex flex-col gap-4 mt-20 p-4">
      <div className="flex flex-col">
         <div className='flex flex-row'>
          <div className="text-3xl font-bold text-left grow">{contest.name}</div>
          <div className="flex justify-end">
            <AccessProvider permittedUsers={['admin', 'mentor']}>
              <Link href={`/contests/${contest.id}/createteams`} className="">
                <Button variant="contained" className="w-48" sx={{
                    background: 'var(--primary)',
                    '&:hover': {
                      background: 'var(--primary) !important',
                      color: 'var(--onPrimary) !important',
                    },
                  }}
                  startIcon = {<AddIcon/>}
                  >
                    Create Teams
                  </Button>
              </Link>
            </AccessProvider>
          </div>
         </div>
        <div className="flex flex-row flex-wrap gap-4">
          <p className="text-lg text-gray-600">Venue : {contest.venue}</p>
          <p className="text-lg text-gray-600">
            Date: {new Date(contest.date).toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-600">
            Type: {contest.type}
          </p>
          
        </div>
       
      </div>
      <p className="text-lg text-gray-600 text-left">{contest.description}</p>
      <div className="flex flex-row justify-between">
        {/* <h3 className="text-2xl font-semibold text-left w-full">Team Forming Contests</h3> */}
        <Link href={`/contests/${contest.id}/createteams`} className="">
          {/* <Button
          variant="contained"
          className="w-48 m-2"
          sx={{
            background: 'var(--primary)',
            '&:hover': {
              background: 'var(--primary) !important',
              color: 'var(--onPrimary) !important',
            },
          }}
        >
            Add TFC
          </Button> */}
        </Link>
      </div>
      {/* <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4 rounded" >
          <div className="flex items-center justify-center w-12 h-full" >
            <Image src={vjudge} alt="Vjudge Logo" width={30} height={30} />
          </div>
          <p className="text-lg p-1 rounded" style={{backgroundColor: 'var(--primaryContainer)', color: 'var(--primary)'}}>Team Forming Contest 1</p>
        </div>
        <div className="flex items-center gap-4 rounded" >
          <div className="flex items-center justify-center w-12 h-full" >
            <Image src={vjudge} alt="Vjudge Logo" width={30} height={30} />
          </div>
          <p className="text-lg p-1 rounded" style={{backgroundColor: 'var(--primaryContainer)', color: 'var(--primary)'}}>Team Forming Contest 2</p>
        </div>
        <div className="flex items-center gap-4 rounded" >
          <div className="flex items-center justify-center w-12 h-full" >
            <Image src={vjudge} alt="Vjudge Logo" width={30} height={30} />
          </div>
          <p className="text-lg p-1 rounded" style={{backgroundColor: 'var(--primaryContainer)', color: 'var(--primary)'}}>Team Forming Contest 3</p>
        </div>
      </div> */}

    </Card>
    <h3 className="text-2xl font-semibold mt-10">Teams</h3>
    <div className='flex flex-row flex-wrap p-4 gap-4'>
      {teams.map((team, index) => (
        <div key={index} className="mb-4 w-64 items-stretch">
          <TeamCard team = {team} onClose={() =>{}} onRename={()=>{}} />
        </div>
    ))}
    </div>
    <h3 className="text-2xl font-semibold mt-10">Registered Users</h3>
    <div style={{ overflowX: 'scroll', scrollbarWidth: 'none', width: '100%' }}>
      <DataGrid
        rows={users}
        columns={columns}
      />
    </div>


  </div>
  )
}

