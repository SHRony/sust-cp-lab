'use client'

import { useEffect, useState } from "react";
import TeamCard from "@/app/ui/cards/TeamCard";
import axios from "axios";
import { DataGrid, GridCellParams, GridColDef, GridPaginationModel, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import Image from 'next/image'
import Modal from '@mui/material/Modal';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
import Link from "next/link";
import CFCompare from "@/app/ui/cfviz/CFCompare";

export default function Page({params:{id}}:{params:{id:number}}) {
  const [contestId, setContestId] = useState<null|number>(id);
  const [users, setUsers] = useState<{username: string, maxRating: number, maxRank: number, id: string, avatar: string}[]>([]);
  const [removedUsers, setRemovedUsers] = useState<{username: string, maxRating: number, maxRank: number, id: string, avatar: string}[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{username: string, maxRating: number, maxRank: number, id: string, avatar: string}[]>([]);
  const [rowSelectionModel, setRowSelectionModel] =
  React.useState<GridRowSelectionModel>([]);
  const [teams, setTeams] = useState<{teamName:string, team:string[]}[]>([]);
  const [open, setOpen] = React.useState(false);
  const [user1Name, setUser1Name] = React.useState('');
  const [user2Name, setUser2Name] = React.useState('');

  useEffect(() => {
    axios.get('/api/userinfo/userslist')
      .then((res) => {
        if (res.status == 200) {
          setUsers(res.data.users.map((user: {username: string, info: {maxRating: number, maxRank: number, avatar: string, contribution: number}}) => ({username: user.username, maxRating: user.info.maxRating, maxRank: user.info.maxRank, id: user.username, avatar: user.info.avatar, contribution: user.info.contribution})));
        } else {
          console.log(res.data.error);
          alert('please try again');
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        alert('please try again');
      });
  }, []);

  const columns: GridColDef[] = [
    { 
      field: 'avatar', 
      headerName: '', 
      flex: 1, 
      minWidth: 50,
      maxWidth: 50,
      renderCell: (params: GridCellParams) => (
        
        <div className='h-full flex justify-center items-center w-8'>
          <Image style={{borderRadius: '50%', height: '30px', width: '30px', objectFit: 'cover'}} src={params.row.avatar} alt={params.row.username} width={30} height={30}/>
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

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    console.log(newSelection);
    setRowSelectionModel(newSelection);
    setSelectedUsers(newSelection.map((id) => users.find((user) => user.id === id) as {username: string, maxRating: number, maxRank: number, id: string, avatar: string}));
  };

  const handleCreateTeam = () => {
    const newTeam = {teamName: `Team ${teams.length + 1}`, team: selectedUsers.map(user => user.username)};
    console.log(selectedUsers);
    const newTeams = [...teams, newTeam];
    const newUsers = users.filter(user => !selectedUsers.includes(user));
    setRemovedUsers([...removedUsers, ...selectedUsers]);
    setUsers(newUsers);
    setTeams(newTeams);
    setSelectedUsers([]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCompare = () => {
    if (selectedUsers.length === 2) {
      setOpen(true);
      setUser1Name(selectedUsers[0].username);
      setUser2Name(selectedUsers[1].username);
    }
  };

  const handleDeleteTeam = ({team, teamName}:{team: string[], teamName:string}) => {
    const newUsers = [...users, ...removedUsers.filter(user => team.includes(user.username))];
    const newRemovedUsers = removedUsers.filter(user => !team.includes(user.username));
    const newTeams = teams.filter(t => t.team !== team);
    console.log(removedUsers);
    setUsers(newUsers);
    setRemovedUsers(newRemovedUsers);
    setTeams(newTeams);
    setOpen(false);
  }
  const handleRename = (team: string[], newTeamName:string) => {
    const newTeams = teams.map(t => {
      if (t.team === team) {
        return {teamName: newTeamName, team: t.team};
      } else {
        return t;
      }
    })
    setTeams(newTeams);
  }
  const body = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}>
      
      <div style={{ scrollbarWidth: 'none', height: 'calc(100vh - 60px)', overflowY: 'scroll' }}>
        <div className = "w-100 mobile:w-106 tablet:w-192 laptop:w-256 desktop:w-360 bg-white">
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <CFCompare user1Name={user1Name} user2Name={user2Name}/>
        </div>
      </div>
    </div>
  );
  
// have to find a better layout for the buttons



  return (
    <div className="flex flex-row justify-between w-full" >
      <div className="p-4 laptop:flex-grow" style={{ minWidth: '0', maxWidth: '100%', margin: '0 auto' }} >
        
        <div className="flex flex-row gap-10 items-center justify-between mb-4 w-full">
          <h2 className="text-2xl font-bold">Users</h2>
          <Button variant="contained" onClick={handleCreateTeam}>Create Team</Button>
          <Button variant="contained" onClick={handleCompare}>Compare</Button>
        </div>
        <div style={{ overflowX: 'scroll', scrollbarWidth: 'none', width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            checkboxSelection 
            onRowSelectionModelChange = {handleSelectionChange} 
            rowSelectionModel = {rowSelectionModel}
          />
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          {body}
        </Modal>
      </div>
      <div className="flex flex-col p-4 w-64 flex-grow max-w-64">
        <div className="flex flex-row gap-10 items-center justify-between mb-4 w-full">
          <h2 className="text-2xl font-bold">Teams</h2>
          <Button variant="contained">Publish</Button>
      
        </div>
        
        <div className="gap-4 flex flex-col" style={{ overflowY: 'scroll', scrollbarWidth: 'none', height: 'calc(100vh - 60px)' }}>
         {teams.map((team, index) => (
           <TeamCard teamName={team.teamName} team={team.team} key={index} onClose={handleDeleteTeam} onRename={handleRename} />
         ))}
        </div>
      </div>
    </div>
  );
};

    
