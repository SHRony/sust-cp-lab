'use client'
import { cfUserType, userTableEntryType } from "@/app/lib/types";
import { DataGrid, GridCellParams, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

type UserTableProps = {
  users: userTableEntryType[];
};
export default function UserTable({users}: UserTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const rows = users;

  const handlePageChange = (_: React.SyntheticEvent, newPage: number) => {
    setPage(newPage);
  };

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
        <Link href={`/profile/${params.row.userName}`}>
          {params.row.userName}
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
        rows.length > 0 ? (
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 20, 50]}
            className="text-text"
            
          />
        ) : (
          <> </>
        )
      }
    </div>
  );
}

