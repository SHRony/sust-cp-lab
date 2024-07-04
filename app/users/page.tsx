// write a user component to display list of users
'use server'
import { DataGrid, GridCellParams, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import Image from 'next/image'

import Link from 'next/link'
import { getUsersList } from '../api/queries';
import UserTable from '../ui/tables/UserTable';

export default async function Page() {

  const data = await getUsersList();  
  const users = data.map((user: {username: string, info: {maxRating: number, maxRank: string, avatar: string, contribution: number}}) => ({userName: user.username, maxRating: user.info.maxRating, maxRank: user.info.maxRank, id: user.username, avatar: user.info.avatar, contribution: user.info.contribution}));
  return (
    <UserTable users={users} >
    </UserTable>
  );
}


