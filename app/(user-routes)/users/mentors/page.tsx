'use client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { Button, Chip, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { motion } from 'framer-motion';
import { UserCheck, UserCog, ShieldCheck } from 'lucide-react';

interface PromoteDialogProps {
  open: boolean;
  user: { id: string; usertype: string } | null;
  onClose: () => void;
  onConfirm: () => void;
}

const PromoteDialog = ({ open, user, onClose, onConfirm }: PromoteDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Promotion</DialogTitle>
    <DialogContent>
      {user?.usertype === 'pending_mentor' ? (
        <>Are you sure you want to approve <strong>{user.id}</strong> as a mentor?</>
      ) : (user && 
        <>Are you sure you want to promote <strong>{user.id}</strong> to admin?</>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="inherit">Cancel</Button>
      <Button onClick={onConfirm} color="primary" variant="contained">
        {user?.usertype === 'pending_mentor' ? 'Approve' : 'Promote'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default function MentorsPage() {
  const [users, setUsers] = useState<{id: string, email: string, usertype: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoteDialog, setPromoteDialog] = useState<{ open: boolean; user: { id: string; usertype: string } | null }>({
    open: false,
    user: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/userinfo/mentorslist');
        const data = response.data;
        if(data) {
          setUsers(data.users.map((user: {username: string, email: string, user_type: string}) => ({
            id: user.username, 
            email: user.email, 
            usertype: user.user_type
          })));
        }
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getUserTypeChip = (type: string) => {
    switch (type) {
      case 'admin':
        return (
          <Chip
            icon={<ShieldCheck className="w-4 h-4" />}
            label="Admin"
            color="error"
            variant="outlined"
          />
        );
      case 'mentor':
        return (
          <Chip
            icon={<UserCheck className="w-4 h-4" />}
            label="Mentor"
            color="primary"
            variant="outlined"
          />
        );
      case 'pending_mentor':
        return (
          <Chip
            icon={<UserCog className="w-4 h-4" />}
            label="Pending Mentor"
            color="warning"
            variant="outlined"
          />
        );
      default:
        return <Chip label={type} />;
    }
  };

  const handlePromoteClick = (user: {id: string, usertype: string}) => {
    setPromoteDialog({ open: true, user });
  };

  const handlePromote = async () => {
    if (!promoteDialog.user) return;

    try {
      const response = await axios.post('/api/userinfo/mentorslist/promote', {
        username: promoteDialog.user.id,
      });
      if (response.status === 200) {
        const updatedUsers = users.map((u) => {
          if (u.id === promoteDialog.user?.id) {
            const newType = u.usertype === 'pending_mentor' ? 'mentor' : 'admin';
            return { ...u, usertype: newType };
          }
          return u;
        });
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error('Error promoting user:', error);
    } finally {
      setPromoteDialog({ open: false, user: null });
    }
  };

  const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'Username', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => (
        <div className="font-medium text-gray-900">{params.value}</div>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1, 
      minWidth: 200,
      renderCell: (params) => (
        <div className="text-gray-600">{params.value}</div>
      )
    },
    { 
      field: 'usertype', 
      headerName: 'Role', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => getUserTypeChip(params.value)
    },
    { 
      field: 'promote', 
      headerName: 'Actions', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params: GridCellParams) => (
        <Button 
          variant="contained"
          size="small"
          disabled={params.row.usertype === 'admin'}
          onClick={() => handlePromoteClick(params.row)}
          className={params.row.usertype === 'admin' ? 'opacity-50' : 'bg-blue-500 hover:bg-blue-600'}
        >
          {params.row.usertype === 'pending_mentor' ? 'Approve' : 'Promote to Admin'}
        </Button>
      )
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 w-full"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mentors & Admins</h1>
        <p className="mt-2 text-gray-600">Manage mentors and administrators of the platform.</p>
      </div>

      <Card className="shadow-sm w-full overflow-hidden">
        <CardContent className="p-0">
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={users}
              columns={columns}
              loading={loading}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              className="border-none"
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              sx={{
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f0f0f0',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#fafafa',
                  borderBottom: '1px solid #f0f0f0',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid #f0f0f0',
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      <PromoteDialog
        open={promoteDialog.open}
        user={promoteDialog.user}
        onClose={() => setPromoteDialog({ open: false, user: null })}
        onConfirm={handlePromote}
      />
    </motion.div>
  );
}
