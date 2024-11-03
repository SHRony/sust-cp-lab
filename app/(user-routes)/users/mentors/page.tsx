'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DataGrid, GridCellParams, GridColDef, GridPaginationModel, GridRowParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button/Button';

export default function MentorsPage() {
  const [users, setUsers] = useState<{id: string, email: string, usertype: string}[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/userinfo/mentorslist');
      const data = response.data;
      console.log(data);
      if(data){
        setUsers(data.users.map((user: {username: string, email: string, user_type: string}) => ({id: user.username, email: user.email, usertype: user.user_type})));

      }
    };
    fetchData();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Username', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 150 },
    { field: 'usertype', headerName: 'User Type', flex: 1, minWidth: 150 },
    { 
      field: 'promote', 
      headerName: 'Promote', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridCellParams) => (
        <Button 
          disabled={params.row.usertype === 'admin'}
          onClick={() => handlePromote(params.row)}
        >
          Promote
        </Button>
      )
    },
  ];

  const handlePromote = async (user: {id: string, email: string, usertype: string}) => {
    
    try {
      const response = await axios.post('/api/userinfo/mentorslist/promote', {
        username: user.id,
      });
      if (response.status === 200) {
        const updatedUsers = users.map((u) => {
          if (u.id === user.id) {
            const newType = u.usertype === 'pending_mentor' ? 'mentor' : 'admin';
            return { ...u, usertype: newType };
          } else {
            return u;
          }
        });
        setUsers(updatedUsers);
      } else {
        alert('Failed to promote user');
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      alert('Failed to promote user');
    }
  };

  return (
    <div style={{height: 400, width: '100%' }}>
      <DataGrid
        rows = {users}
        columns = {columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick = {true}
        disableColumnSelector = {true}
        disableMultipleRowSelection = {true}
        disableDensitySelector = {true}
        disableEval = {true}
        disableVirtualization = {true}
        
      />
    </div>
  );
}

