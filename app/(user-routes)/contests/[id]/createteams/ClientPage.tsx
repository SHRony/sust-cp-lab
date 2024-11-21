'use client'

import { useEffect, useState } from "react";
import TeamCard from "@/app/ui/cards/TeamCard";
import axios from "axios";
import UserTable from "@/app/ui/tables/UserTable";
import Image from 'next/image'
import Modal from '@mui/material/Modal';
import { Button, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from "react";
import Link from "next/link";
import CFCompare from "@/app/ui/cfviz/CFCompare";
import { teamType, userTableEntryType, userType } from "@/app/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import TFCRanks from "@/app/ui/tfc/TFCRanks";
import { ChartBarIcon } from "@heroicons/react/24/outline";

export default function CreateTeams({usersParams, teamsParams, id}: {usersParams: userTableEntryType[], teamsParams: teamType[], id: string}) {
  const [users, setUsers] = useState<userTableEntryType[]>(usersParams.filter((user:userTableEntryType) => !(teamsParams.some((team:teamType) => team.members.includes(user.userName)))));
  const [removedUsers, setRemovedUsers] = useState<userTableEntryType[]>(usersParams.filter((user:userTableEntryType) => teamsParams.some((team:teamType) => team.members.includes(user.userName))));
  const [selectedUsers, setSelectedUsers] = useState<userTableEntryType[]>([]);
  const [teams, setTeams] = useState<teamType[]>(teamsParams);
  const [open, setOpen] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [tfcRanks, setTfcRanks] = useState<any[]>([]);
  const [loadingRanks, setLoadingRanks] = useState(false);

  const handleSelectionChange = (newSelectedUsers: userTableEntryType[]) => {
    setSelectedUsers(newSelectedUsers);
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

  const calculateTFCData = () => {
    if (!tfcRanks || tfcRanks.length === 0) return [];

    return selectedUsers.map(user => {
      const userTfcs = tfcRanks.map(tfc => {
        const userRank = tfc.ranks.find((r: any) => r.username === user.userName);
        return {
          id: tfc.id,
          name: tfc.name,
          solveCount: userRank ? userRank.solved : 0
        };
      });

      return {
        username: user.userName,
        tfcs: userTfcs,
        totalSolves: userTfcs.reduce((sum, tfc) => sum + tfc.solveCount, 0)
      };
    });
  };

  useEffect(() => {
    const fetchTfcRanks = async () => {
      setLoadingRanks(true);
      try {
        const response = await axios.get(`/api/contests/${id}/tfc/ranks`);
        setTfcRanks(response.data);
      } catch (error) {
        console.error('Error fetching TFC ranks:', error);
      }
      setLoadingRanks(false);
    };

    fetchTfcRanks();
  }, [id]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTeam}
            disabled={selectedUsers.length === 0 || creatingTeam}
            startIcon={creatingTeam ? <CircularProgress size={20} /> : null}
          >
            Create Team
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCompare}
            disabled={selectedUsers.length < 2}
            startIcon={<ChartBarIcon className="h-5 w-5" />}
          >
            Compare
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Users</h2>
          <UserTable 
            users={users}
            onSelectionChange={handleSelectionChange}
            checkboxSelection={true}
            selectedUsers={selectedUsers}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} onDelete={() => handleDeleteTeam(team)} onRename={handleRename} closable />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        className="flex items-center justify-center"
      >
        <div className="bg-white rounded-xl w-[90vw] h-[90vh] relative overflow-y-auto">
          <IconButton
            onClick={handleClose}
            className="absolute right-0"
          >
            <CloseIcon />
          </IconButton>
          <CFCompare users={selectedForComparison} tfcData={calculateTFCData()} />
        </div>
      </Modal>
    </div>
  );
}
