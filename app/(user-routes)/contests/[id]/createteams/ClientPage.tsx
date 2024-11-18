'use client'

import { useEffect, useState } from "react";
import TeamCard from "@/app/ui/cards/TeamCard";
import axios from "axios";
import { DataGrid, GridCellParams, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import Image from 'next/image'
import Modal from '@mui/material/Modal';
import { Button, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
import Link from "next/link";
import CFCompare from "@/app/ui/cfviz/CFCompare";
import { teamType, userTableEntryType, userType } from "@/app/lib/types";
import { AnimatePresence, motion } from "framer-motion";

export default function CreateTeams({usersParams, teamsParams, id}: {usersParams: userTableEntryType[], teamsParams: teamType[], id: string}) {
  const [users, setUsers] = useState<userTableEntryType[]>(usersParams.filter((user:userTableEntryType) => !(teamsParams.some((team:teamType) => team.members.includes(user.userName)))));
  const [removedUsers, setRemovedUsers] = useState<userTableEntryType[]>(usersParams.filter((user:userTableEntryType) => teamsParams.some((team:teamType) => team.members.includes(user.userName))));
  const [selectedUsers, setSelectedUsers] = useState<userTableEntryType[]>([]);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [teams, setTeams] = useState<teamType[]>(teamsParams);
  const [open, setOpen] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [creatingTeam, setCreatingTeam] = useState(false);

  const columns: GridColDef[] = [
    { 
      field: 'avatar', 
      headerName: '', 
      flex: 1, 
      minWidth: 50,
      maxWidth: 50,
      renderCell: (params: GridCellParams) => (
        
        <AnimatePresence>
          <motion.div key={params.row.userName} className='h-full flex justify-center items-center w-8'>
            <Image style={{borderRadius: '50%', height: '30px', width: '30px', objectFit: 'cover'}} src={params.row.avatar} alt={''} width={30} height={30}/>
          </motion.div>
        </AnimatePresence>
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

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setRowSelectionModel(newSelection);
    setSelectedUsers(newSelection.map((id) => users.find((user) => user.userName === id) as userTableEntryType));
  };

  const handleCreateTeam = () => {
    const newTeam: teamType = {name: `Team ${teams.length + 1}`, members: selectedUsers.map(user => user.userName)};
    if(newTeam.members.length < 1) {
      return ;
    }
    setCreatingTeam(true);
    axios.post(`/api/contests/${id}/teams/add`, {name : newTeam.name, members: newTeam.members}).then(res => {
      if (res.status == 200) {
        newTeam.id = res.data.id;
        const newTeams = [...teams, newTeam];
        const newUsers = users.filter(user => !selectedUsers.includes(user));
        setRemovedUsers([...removedUsers, ...selectedUsers]);
        setUsers(newUsers);
        setTeams(newTeams);
        setSelectedUsers([]);
        setCreatingTeam(false);
      }
    }).catch(error => {
      console.log(error);
      setCreatingTeam(false);
    })
    
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCompare = () => {
    if (selectedUsers.length >= 2) {
      setOpen(true);
      setSelectedForComparison(selectedUsers.map(user => user.userName));
    }
  };

  const handleDeleteTeam = (team: teamType) => {
    axios.post(`/api/contests/${id}/teams/${team.id}/remove`).then(res => {
      if (res.status == 200) {
        console.log(res);
        const newUsers = [...users, ...removedUsers.filter(user => team.members.includes(user.userName))];
        const newRemovedUsers = removedUsers.filter(user => !team.members.includes(user.userName));
        const newTeams = teams.filter(t => t.members !== team.members);
        setUsers(newUsers);
        setRemovedUsers(newRemovedUsers);
        setTeams(newTeams);
        setOpen(false);
      }
    }).catch(error => {
      console.log(error);
    })
  }

  const handleRename = async (members: string[], newTeamName:string) => {
    const team = teams.find(t => t.members === members);
    if (!team) return;

    try {
      const res = await axios.post(`/api/contests/${id}/teams/${team.id}/rename`, { name: newTeamName });
      if (res.status === 200) {
        const newTeams = teams.map(t => {
          if (t.members === members) {
            return { ...t, name: newTeamName };
          }
          return t;
        });
        setTeams(newTeams);
      }
    } catch (error) {
      console.error('Error renaming team:', error);
    }
  }

  const body = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}>
      <div style={{ scrollbarWidth: 'none', height: 'calc(100vh - 60px)', overflowY: 'scroll' }}>
        <div className="w-screen h-screen bg-white">
          <div className="flex justify-between items-center p-4">
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            <h2 className="text-xl font-semibold">Comparing {selectedForComparison.length} Users</h2>
          </div>
          <CFCompare users={selectedForComparison}/>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-row gap-5 items-center">
          <h1 className="text-2xl font-bold">Create Teams</h1>
          <div className="flex-grow"></div>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleCreateTeam}
            disabled={selectedUsers.length === 0 || creatingTeam}
            className="bg-blue-500"
          >
            {creatingTeam ? <CircularProgress size={24} /> : 'Create Team'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCompare}
            disabled={selectedUsers.length < 2}
            className="bg-purple-500"
          >
            Compare Selected ({selectedUsers.length})
          </Button>
        </div>
        <div style={{ height: 400 }}>
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.userName}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={rowSelectionModel}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 20, 50]}
            className="bg-white"
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-4 justify-start">
        {teams.map((team, index) => (
          <TeamCard
            key={index}
            team={team}
            onDelete={() => handleDeleteTeam(team)}
            onRename={handleRename}
            closable
          />
        ))}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="comparison-modal"
        aria-describedby="user-comparison-view"
      >
        {body}
      </Modal>
    </div>
  );
};
