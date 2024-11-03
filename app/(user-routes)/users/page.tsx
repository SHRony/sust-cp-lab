// write a user component to display list of users
'use server'
import { DataGrid, GridCellParams, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import Image from 'next/image'

import Link from 'next/link'
import { getUsersListWithBsicCFInfo } from '@/app/api/queries/user_queries';
import UserTable from '@/app/ui/tables/UserTable';

export default async function Page() {

  const users = await getUsersListWithBsicCFInfo();  
  return (
    <UserTable users={users} >
    </UserTable>
  );
}


