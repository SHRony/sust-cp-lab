// write a user component to display list of users
'use client'
import { NextRequest, NextResponse } from 'next/server';
import dbTables from '@/app/lib/dbTables';
import client from '@/app/api/dbclient';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DataGrid, GridCellParams, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import Image from 'next/image'

import Link from 'next/link'

export default function Page() {

  const [users, setUsers] = useState<{username: string, maxRating: number, maxRank: number, id: string, avatar: string}[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/userinfo/userslist');
      const data = response.data;

      if(data){
        setUsers(data.users.map((user: {username: string, info: {maxRating: number, maxRank: number, avatar: string, contribution: number}}) => ({username: user.username, maxRating: user.info.maxRating, maxRank: user.info.maxRank, id: user.username, avatar: user.info.avatar, contribution: user.info.contribution})));
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    console.log(users);
  },[users])

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
        <Link href={`/profile?username=${params.row.username}`}>
          {params.row.username}
        </Link>
      ),
    },
    { field: 'maxRating', headerName: 'Max Rating', flex: 1, minWidth: 150 },
    { field: 'maxRank', headerName: 'Max Rank', flex: 1, minWidth: 150 },
    { field: 'contribution', headerName: 'Contribution', flex: 1, minWidth: 150 },
  ];

  return (
    <div className='p-10'>
      {
        users.length > 0 ? (
          <DataGrid
            rows={users}
            columns={columns}
            paginationModel={paginationModel}
          />
        ) : (
          <> </>
        )
      }
    </div>
  );
}


