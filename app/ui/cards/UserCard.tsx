import { userType } from "@/app/lib/types";
import Card from "./Card";
import Image from "next/image";
import editIcon from '@/public/edit.png'
import { Input } from "@mui/material";
import { useContext, useState } from "react";
import {authContext} from "@/app/lib/AuthProvider";
import axios from "axios";
export default function UserCard({userName, fullName, registrationNumber, email, vjudgeHandle, cfHandles, phone} : userType){
  const auth = useContext(authContext);
  const [editVjudge, setEditVjudge] = useState(false);
  const [editCF, setEditCF] = useState(false);
  const [vjudgeState, setVjudgeState] = useState(vjudgeHandle??'');
  const [CFNewHandle, setCFNewHandle] = useState('');
  const [CFState, setCFState] = useState([...cfHandles??[]]);
  const addCFhandle = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key == 'Enter'){
      if(CFNewHandle == '') return;
      if(!CFState.includes(CFNewHandle)){
        setCFState((prevCFState) => {return [...prevCFState, CFNewHandle];});
        setCFNewHandle('');
        setEditCF(false);
      }
    }
  }
  const updateVjudge = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key == 'Enter'){
      // call the updateVjudge in the api/profile/route.ts using axios properly
      console.log(userName);
      const res = await axios.post('/api/profile/updateVjudgeHandle', {vjudgeHandle : vjudgeState, userName : userName});
      console.log(res);
      setEditVjudge(false); 
    }
  }
  
  return (
    <Card className="flex flex-col items-center bg-white w-170 min-h-10 py-8 rounded">
      <div 
        className="flex justify-center items-center text-2xl font-bold text-gray-700 text-shadow-2xl text-center px-10 mb-5"
        style={{backgroundColor : 'var(--primaryContainer)', color : 'var(--primary)', borderRadius : '50px'}}
      >
        {userName}
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-40">
        <div className="font-bold text-gray-700 w-40 leading-8">
          Full Name :
        </div>
        <div className="text-gray-600">
          {fullName}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-40">
        <div className="font-bold text-gray-700 w-40 leading-8">
          email :
        </div>
        <div className="text-gray-600">
          {email}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-40">
        <div className="font-bold text-gray-700 w-40 leading-8">
          Phone :
        </div>
        <div className="text-gray-600">
          {phone}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-40">
        <div className="font-bold text-gray-700 w-40 leading-8">
          Registration NO :
        </div>
        <div className="text-gray-600">
          {registrationNumber}
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-40">
        <div className="font-bold text-gray-700 w-40 leading-8">
          Vjudge Handle :
        </div>
        <div className="text-gray-600">
          {
            editVjudge ? (
              <>
                <Input value={vjudgeState} onChange={e => setVjudgeState(e.target.value)} onKeyDown={updateVjudge}></Input>
              </>
            ):(
              <div className="flex flex-row flex-wrap gap-2">
                <p>
                  {vjudgeState} 
                </p>
                  {/* this edit icon is visible only if the user is visiting his own profile */}
                  {auth?.user?.userName == userName ? (
                    <Image className="cursor-pointer" alt = 'edit' height={24} src = {editIcon} onClick={()=> {setEditVjudge(true)}}/>
                  ):(
                    <></>
                  )}
              </div>
            )
          }
        </div>
      </div>
      <div className="flex flex-row justify-start w-full p-2 pl-40">
        <div className="font-bold text-gray-700 w-40 leading-8">
          CF Handles :
        </div>
        <div className="flex flex-row flex-wrap gap-2 items-start">
          {
            CFState?.map((handle)=>{
              return <a 
                className="bg-gray-200 px-4 rounded border font-bold h-7" 
                key={handle}
                style={{backgroundColor : 'var(--primaryContainer)', color : 'var(--primary)'}}
                href={'codeforces.com/profile/' + handle}
                >
                  {handle}
                </a>
            })
          }
          {
            editCF ? (
              <>
              <Input className="w-24" value={CFNewHandle} onChange={(e)=>{setCFNewHandle(e.target.value)}} onKeyDown={addCFhandle}/>
              </>
            ) : (
              <>
                {/* this edit icon is visible only if the user is visiting his own profile */}
                {auth?.user?.userName == userName ? (
                  <Image className="cursor-pointer" layout="fixed" width={24} alt = 'edit' src = {editIcon} onClick={()=> {setEditCF(true)}}/>
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