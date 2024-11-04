import { userType } from "@/app/lib/types";
import Card from "./Card";
import Image from "next/image";
import editIcon from '@/public/edit.png';
import closeIcon from '@/public/close.png';

import { Input, Skeleton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {authContext} from "@/app/lib/AuthProvider";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import AccessProvider from "@/app/lib/AccessProvider";
export default function UserCard({userName, fullName, registrationNumber, email, vjudgeHandle, cfHandles, phone, addCFHandle, removeCFHandle} : userType & {addCFHandle : (handle : string) => void, removeCFHandle : (handle : string) => void}) {
  const auth = useContext(authContext);
  const [editVjudge, setEditVjudge] = useState(false);
  const [editCF, setEditCF] = useState(false);
  const [vjudgeState, setVjudgeState] = useState(vjudgeHandle??'');
  const [CFNewHandle, setCFNewHandle] = useState('');
  const [CFState, setCFState] = useState([...cfHandles??[]]);
  const [addingCFHandle, setAddingCFHandle] = useState(false);
  const addCFhandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    
    if(e.key == 'Enter'){
      setEditCF(false);
      if(CFNewHandle == '') return;
      setAddingCFHandle(true);
      
      if(!CFState.includes(CFNewHandle)){
        // call the addCFhandle in the api/profile/addCFHandle/route.ts using axios properly  
        const res = await axios.post('/api/profile/addCFHandle', {cfHandle : CFNewHandle, userName : userName});
        if(res.status == 200){
          addCFHandle(CFNewHandle);
        }
        setCFNewHandle(''); 
      }
      setAddingCFHandle(false);
    }
  }
  // write delete cf handle function
  const deleteCFhandle = async (handle : string) => {
    // call the deleteCFhandle in the api/profile/removeCFHandle/route.ts using axios properly
    const res = await axios.post('/api/profile/removeCFHandle', {cfHandle : handle, userName : userName});
    console.log(res);
    if(res.status == 200){
      removeCFHandle(handle);
    }
    // setCFState((prevCFState) => {return prevCFState.filter((cfHandle) => cfHandle != handle);});
  }
  const updateVjudge = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key == 'Enter'){
      // call the updateVjudge in the api/profile/route.ts using axios properly
      const res = await axios.post('/api/profile/updateVjudgeHandle', {vjudgeHandle : vjudgeState, userName : userName});
      console.log(res);
      setEditVjudge(false); 
    }
  }
  useEffect(() => {
    setCFState([...cfHandles??[]]);
  }, [cfHandles]);
  return (
    <Card className="flex flex-col items-center bg-card w-170 min-h-10 py-8 rounded">
      <div 
        className="flex justify-center items-center text-2xl font-bold text-text text-shadow-2xl text-center px-10 mb-5"
        style={{backgroundColor : 'var(--primaryContainer)', color : 'var(--primary)', borderRadius : '50px'}}
      >
        {userName}
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-2 mobile:pl-10 tablet:pl-40">
        <div className="font-bold text-text w-40 leading-8">
          Full Name :
        </div>
        <div className="text-dull">
          {fullName}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-2 mobile:pl-10 tablet:pl-40">
        <div className="font-bold text-text w-40 leading-8">
          email :
        </div>
        <div className="text-dull">
          {email}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-2 mobile:pl-10 tablet:pl-40">
        <div className="font-bold text-text w-40 leading-8">
          Phone :
        </div>
        <div className="text-dull">
          {phone}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-2 mobile:pl-10 tablet:pl-40">
        <div className="font-bold text-text w-40 leading-8">
          Registration NO :
        </div>
        <div className="text-dull">
          {registrationNumber}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-2 mobile:pl-10 tablet:pl-40">
        <div className="font-bold text-text w-40 leading-8">
          Vjudge Handle :
        </div>
        <div className="text-dull">
          {
            editVjudge ? (
              <>
                <Input value={vjudgeState} onChange={e => setVjudgeState(e.target.value)} onKeyDown={updateVjudge}></Input>
              </>
            ):(
              <div className="flex flex-row flex-wrap gap-2 items-start">
                <p>
                  {vjudgeState} 
                </p>
                  {/* this edit icon is visible only if the user is visiting his own profile */}
                  <AccessProvider permittedUsers={[`_${userName}`]}>
                      <Image className="cursor-pointer" alt = 'edit' height={20} src = {editIcon} onClick={()=> {setEditVjudge(true)}}/>
                  </AccessProvider>
              </div>
            )
          }
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-2 mobile:pl-10 tablet:pl-40">
        <div className="font-bold text-text w-40 leading-8">
          CF Handles :
        </div>
        <div className="flex flex-row flex-wrap gap-2 items-start">
          {
            CFState?.map((handle)=>{
              return (
                <div 
                  key={handle} 
                  className="flex flex-row items-center rounded border px-4"
                  style={{backgroundColor : 'var(--primaryContainer)', color : 'var(--primary)'}}
                  >
                    <a 
                      className="flex bg-gray-200 font-bold h-7 items-center" 
                      href={'https://codeforces.com/profile/' + handle}
                      >
                        {handle}
                    </a>
                    <AccessProvider permittedUsers={[`_${userName}`]}>
                      <Image className="cursor-pointer ml-2" alt = 'close' height={20} src = {closeIcon} onClick={()=> {deleteCFhandle(handle)}}/>
                    </AccessProvider>
                  
                </div>
              )
            })
          }
          {
            addingCFHandle ? (
              <Skeleton variant="text" className="w-24"></Skeleton>
            ):(
              <></>
            )
          }
          {
            editCF ? (
              <>
              <Input className="w-24" value={CFNewHandle} onChange={(e)=>{setCFNewHandle(e.target.value)}} onKeyDown={addCFhandler}/>
              </>
            ) : (
              <>
                {/* this edit icon is visible only if the user is visiting his own profile */}
                {auth?.user?.userName == userName ? (
                  <Image className="cursor-pointer" layout="fixed" width={20} alt = 'edit' src = {editIcon} onClick={()=> {setEditCF(true)}}/>
                ):(
                  <></>
                )}
              </>
            )
          }
        </div>
      </div>
    </Card>
  )
}