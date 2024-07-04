// write a user component to display list of users
'use server'
import { DataGrid, GridCellParams, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import Image from 'next/image'

import Link from 'next/link'
import { getUsersList } from '../api/queries';
import UserTable from '../ui/tables/UserTable';

export default async function Page() {

  const users = await getUsersList();  
  return (
    <UserTable users={users} >
    </UserTable>
  );
}


