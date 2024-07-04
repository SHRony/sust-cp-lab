'use client'
import { cfUserType } from "@/app/lib/types";
import { DataGrid, GridCellParams, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import Link from "next/link";
import React from "react";
import Image from "next/image";

type UserTableProps = {
  users: {
    userName: string;
    maxRating: string | number;
    maxRank: string;
    id: string;
    avatar: string;
    contribution: string | number;
  }[];
};
export default function UserTable({users}: UserTableProps) {
    const paginationModel: GridPaginationModel = { page: 0, pageSize: 10 };
    const columns: GridColDef[] = [
    { 
      field: 'avatar', 
      headerName: '', 
      flex: 1, 
      minWidth: 50,
      maxWidth: 50,
      renderCell: (params: GridCellParams) => (
        
        <div className='h-full flex justify-center items-center w-8'>
          <Image style={{borderRadius: '50%', height: '30px', width: '30px', objectFit: 'cover'}} src={params.row.avatar} alt={''} width={30} height={30}/>
        </div>
      ),
    },
    { 
      field: 'username', 
      headerName: 'Username', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridCellParams) => (
        <Link href={`/profile/${params.row.username}`}>
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