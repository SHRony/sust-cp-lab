'use client'
import { cfUserType, userTableEntryType } from "@/app/lib/types";
import { DataGrid, GridCellParams, GridColDef, GridPaginationModel, GridRowSelectionModel } from "@mui/x-data-grid";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Medal, Star } from "lucide-react";

type UserTableProps = {
  users: userTableEntryType[];
  onSelectionChange?: (selectedUsers: userTableEntryType[]) => void;
  checkboxSelection?: boolean;
  selectedUsers?: userTableEntryType[];
};

export default function UserTable({
  users,
  onSelectionChange,
  checkboxSelection = false,
  selectedUsers = []
}: UserTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const rows = users;

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

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    if (onSelectionChange) {
      const selectedUsers = newSelection.map((id) => 
        rows.find((user) => user.userName === id)
      ).filter((user): user is userTableEntryType => user !== undefined);
      onSelectionChange(selectedUsers);
    }
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
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image 
            style={{
              borderRadius: '50%', 
              height: '30px', 
              width: '30px', 
              objectFit: 'cover',
              border: '2px solid #e5e7eb',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
          className="hover:text-blue-500 transition-colors font-medium flex items-center gap-2"
        >
          <span className="text-gray-700">{params.row.userName}</span>
        </Link>
      ),
    },
    { 
      field: 'maxRating', 
      headerName: 'Max Rating', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridCellParams) => (
        <motion.div 
          className={`flex items-center gap-2 font-medium ${getRatingColor(params.row.maxRating)}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{params.row.maxRating}</span>
        </motion.div>
      )
    },
    { 
      field: 'maxRank', 
      headerName: 'Max Rank', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridCellParams) => (
        <motion.div 
          className={`flex items-center gap-2 font-medium ${getRankColor(params.row.maxRank)}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Medal className="w-4 h-4" />
          <span>{params.row.maxRank}</span>
        </motion.div>
      )
    },
    { 
      field: 'contribution', 
      headerName: 'Contribution', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridCellParams) => (
        <motion.div 
          className={`flex items-center gap-2 font-medium ${params.row.contribution >= 0 ? 'text-green-500' : 'text-red-500'}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Star className="w-4 h-4" />
          <span>{params.row.contribution}</span>
        </motion.div>
      )
    },
  ];

  return (
    <motion.div 
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden backdrop-blur-sm backdrop-filter">
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.userName}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          className="text-gray-700"
          autoHeight
          checkboxSelection={checkboxSelection}
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={selectedUsers.map(user => user.userName)}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: '#f3f4f6',
              padding: '12px 16px',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e5e7eb',
              '& .MuiDataGrid-columnHeader': {
                fontWeight: '600',
                color: '#1f2937',
              }
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: '#f8fafc',
                transform: 'scale(1.002)',
                transition: 'all 0.2s ease',
              },
              '&:nth-of-type(odd)': {
                backgroundColor: '#fafafa',
              }
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '2px solid #e5e7eb',
              backgroundColor: '#f8fafc',
            },
            '& .MuiTablePagination-root': {
              color: '#374151',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: '#ffffff',
            },
            '& .MuiCheckbox-root': {
              color: '#6b7280',
              '&.Mui-checked': {
                color: '#3b82f6',
              }
            },
          }}
        />
      </div>
    </motion.div>
  );
}
