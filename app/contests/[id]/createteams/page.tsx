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
import { teamType, userType } from "@/app/lib/types";
export default function Page({params:{id}}:{params:{id:number}}) {
  const [contestId, setContestId] = useState<null|number>(id);
  const [users, setUsers] = useState<userType[]>([]);
  const [removedUsers, setRemovedUsers] = useState<userType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<userType[]>([]);
  const [rowSelectionModel, setRowSelectionModel] =
  React.useState<GridRowSelectionModel>([]);
  const [teams, setTeams] = useState<teamType[]>([]);
  const [open, setOpen] = React.useState(false);
  const [user1Name, setUser1Name] = React.useState('');
  const [user2Name, setUser2Name] = React.useState('');
  const [creatingTeam, setCreatingTeam] = React.useState(false);
  useEffect(() => {
    Promise.all([
      axios.get(`/api/contests/${id}/teams`),
      axios.get(`/api/contests/${id}/users`),
    ])
      .then(async ([teamsRes, usersRes]) => {
        if (teamsRes.status == 200 && usersRes.status == 200) {

          const teams: teamType[] = teamsRes.data;
          let users: userType[] = usersRes.data.users.map((user: {username: string, info: {maxRating: number, maxRank: number, avatar: string, contribution: number}}) => {return {userName: user.username, maxRating: user.info.maxRating, maxRank: user.info.maxRank, id: user.username, avatar: user.info.avatar, contribution: user.info.contribution}});
          let removedUsers = users.filter((user:userType) => teams.some((team:teamType) => team.members.includes(user.userName)));
          users = users.filter((user:userType) => !(teams.some((team:teamType) => team.members.includes(user.userName))));
          setRemovedUsers(removedUsers);
          setUsers(users);
          console.log(users);
          setTeams(teams);
        } else {
          alert('please try again');
        }
      })
      .catch((error) => {
        console.error("Error fetching users or teams:", error);
        alert('please try again');
      });
  }, [id]);

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
    console.log(newSelection);
    setRowSelectionModel(newSelection);
    setSelectedUsers(newSelection.map((id) => users.find((user) => user.userName === id) as userType));
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
    if (selectedUsers.length === 2) {
      setOpen(true);
      setUser1Name(selectedUsers[0].userName);
      setUser2Name(selectedUsers[1].userName);
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
  const handleRename = (members: string[], newTeamName:string) => {
    const newTeams = teams.map(t => {
      if (t.members === members) {
        return {name: newTeamName, members: t.members};
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
          <Button variant="contained" disabled={creatingTeam} onClick={handleCreateTeam}
            startIcon={creatingTeam ? <CircularProgress size={20} /> : null}>
            {creatingTeam ? 'Creating Team...' : 'Create Team'}
          </Button>
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
          {/* <Button variant="contained">Publish</Button> */}
      
        </div>
        
        <div className="gap-4 flex flex-col" style={{ overflowY: 'scroll', scrollbarWidth: 'none', height: 'calc(100vh - 60px)' }}>
         {teams.map((team, index) => (
           <TeamCard team = {team} key={index} onClose={handleDeleteTeam} onRename={handleRename} />
         ))}
        </div>
      </div>
    </div>
  );
};

    
