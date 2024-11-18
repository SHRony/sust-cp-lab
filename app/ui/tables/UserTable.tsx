'use client'
import { cfUserType, userTableEntryType } from "@/app/lib/types";
import { DataGrid, GridCellParams, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Medal, Star } from "lucide-react";

type UserTableProps = {
  users: userTableEntryType[];
};

export default function UserTable({users}: UserTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const rows = users;

  const handlePageChange = (_: React.SyntheticEvent, newPage: number) => {
    setPage(newPage);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return 'text-red-500';
    if (rating >= 2100) return 'text-orange-500';
    if (rating >= 1900) return 'text-purple-500';
    if (rating >= 1600) return 'text-blue-500';
    if (rating >= 1400) return 'text-cyan-500';
    return 'text-green-500';
  };

  const getRankColor = (rank: string | null | undefined) => {
    if (!rank) return 'text-gray-500';
    const rankLower = rank.toLowerCase();
    if (rankLower.includes('grandmaster')) return 'text-red-500';
    if (rankLower.includes('master') && !rankLower.includes('candidate')) return 'text-orange-500';
    if (rankLower.includes('candidate master')) return 'text-purple-500';
    if (rankLower.includes('expert')) return 'text-blue-500';
    if (rankLower.includes('specialist')) return 'text-cyan-500';
    return 'text-green-500';
  };

  const columns: GridColDef[] = [
    { 
      field: 'avatar', 
      headerName: '', 
      flex: 1, 
      minWidth: 50,
      maxWidth: 50,
      renderCell: (params: GridCellParams) => (
        <motion.div 
          className='h-full flex justify-center items-center w-8'
          whileHover={{ scale: 1.1 }}
        >
          <Image 
            style={{
              borderRadius: '50%', 
              height: '30px', 
              width: '30px', 
              objectFit: 'cover',
              border: '2px solid #e5e7eb'
            }} 
            src={params.row.avatar} 
            alt={''} 
            width={30} 
            height={30}
          />
        </motion.div>
      ),
    },
    { 
      field: 'username', 
      headerName: 'Username', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridCellParams) => (
        <Link 
          href={`/profile/${params.row.userName}`}
          className="hover:text-blue-500 transition-colors font-medium"
        >
          {params.row.userName}
        </Link>
      ),
    },
    { 
      field: 'maxRating', 
      headerName: 'Max Rating', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridCellParams) => (
        <div className={`flex items-center gap-2 font-medium ${getRatingColor(params.row.maxRating)}`}>
          <TrendingUp className="w-4 h-4" />
          {params.row.maxRating}
        </div>
      )
    },
    { 
      field: 'maxRank', 
      headerName: 'Max Rank', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridCellParams) => (
        <div className={`flex items-center gap-2 font-medium ${getRankColor(params.row.maxRank)}`}>
          <Medal className="w-4 h-4" />
          {params.row.maxRank}
        </div>
      )
    },
    { 
      field: 'contribution', 
      headerName: 'Contribution', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridCellParams) => (
        <div className={`flex items-center gap-2 font-medium ${params.row.contribution >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          <Star className="w-4 h-4" />
          {params.row.contribution}
        </div>
      )
    },
  ];

  return (
    <motion.div 
      className='p-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {rows.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 20, 50]}
            className="text-gray-700"
            autoHeight
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderColor: '#f3f4f6',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f9fafb',
                borderBottom: '2px solid #e5e7eb',
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: '#f9fafb',
                },
                transition: 'background-color 0.2s ease',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '2px solid #e5e7eb',
              },
              '& .MuiTablePagination-root': {
                color: '#374151',
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: '#ffffff',
              },
            }}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-500">
          No users found
        </div>
      )}
    </motion.div>
  );
}
