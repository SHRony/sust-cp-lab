// write a user component to display list of users
'use client'
import { NextRequest, NextResponse } from 'next/server';
import dbTables from '@/app/lib/dbTables';
import client from '@/app/api/dbclient';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { Button } from '@mui/material';


export default function Page() {

  const [users, setUsers] = useState([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/userinfo/userslist');
      const data = response.data;

      if(data){
        console.log(data);
        //the data is an object with two properties: username and info. Then info is another object with maxRating and maxRank property. now I want to show the username and the maxrating and maxrank in the table
        setUsers(data.users.map((user: any) => ({username: user.username, maxRating: user.info.maxRating, maxRank: user.info.maxRank, id: user.username })));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

  const columns = [
    { field: 'username', headerName: 'Username', flex: 1, minWidth: 150 },
    { field: 'maxRating', headerName: 'Max Rating', flex: 1, minWidth: 150 },
    { field: 'maxRank', headerName: 'Max Rank', flex: 1, minWidth: 150 },
  ];

  return (
    <div>
      <DataGrid
        rows={users}
        columns={columns}
        paginationModel={paginationModel}
      />
    </div>
  );
}


