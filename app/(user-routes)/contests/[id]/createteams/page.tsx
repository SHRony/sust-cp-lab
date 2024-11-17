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
import CreateTeams from "./ClientPage";
import { getContestUsers, getContestTeams } from "@/app/api/queries/contest_queries";
import { isLoggedIn } from "@/app/api/queries/user_queries";
import { redirect } from "next/navigation";

export default async function Page({params:{id}}:{params:{id:string}}) {
  const user = await isLoggedIn();
  
  // Redirect if not admin or mentor
  if (!user || (user.userType !== 'admin' && user.userType !== 'mentor')) {
    redirect('/contests/' + id);
  }

  const users = await getContestUsers(Number(id));
  const teams = await getContestTeams(Number(id));

  return (
    <CreateTeams teamsParams={teams} usersParams={users} id={id} />
  );
};
