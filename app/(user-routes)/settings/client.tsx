'use client';

import { userType } from "@/app/lib/types";
import DoubleClickInput from "@/app/ui/input/DoubleClickInput";
import Card from "@/app/ui/cards/Card";
import { useEffect, useState } from "react";
import settingsIcon from '@/public/settings.svg';
import Image from "next/image";
import axios from "axios";
import closeIcon from '@/public/close.svg';
import loaderIcon from '@/public/loader.gif';
import { Input } from "@mui/material";
const Settings = ({ user }: { user: userType }) => {
    // Ensure user state is initialized only once on the client
    const [newUser, setNewUser] = useState(user);
    const [addingCFHandle, setAddingCFHandle] = useState(false);
    const [newCFHandle, setNewCFHandle] = useState('');
    useEffect(() => {
        console.log(newUser);
    }, [newUser]);
    const removeCFHandle = async (handle: string) => {
        const res = await axios.post('/api/profile/removeCFHandle', {cfHandle : handle, userName : user.userName});
        console.log(res);
        if(res.status == 200){
            if(newUser && newUser.cfHandles) setNewUser({...newUser, cfHandles: newUser.cfHandles.filter((cfHandle) => cfHandle != handle)});
            else setNewUser({...newUser, cfHandles: []});
        }
    }
    const addCFhandle = async () => {
        if(newCFHandle.trim() == '') return;
        const res = await axios.post('/api/profile/addCFHandle', {cfHandle : newCFHandle, userName : user.userName});
        if(res.status == 200){
            if(newUser && newUser.cfHandles) setNewUser({...newUser, cfHandles: [...newUser.cfHandles, newCFHandle]});
            else setNewUser({...newUser, cfHandles: [newCFHandle]});
        }
    }
    return (
        <Card className="flex justify-begin w-full h-full flex-col items-left p-8 gap-8">
            <div className="text-2xl font-bold w-full pb-4 flex flex-row text-gray-600">
                <Image src={settingsIcon} alt="" width={25} height={25}/>
                Settings
                
            </div>
            <div className="gap-4 text-gray-600 p-4 grow w-full max-h-96 max-w-3xl">
                
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-2 p-1"> <span className="w-32">Handle:</span> <span>{newUser.userName}</span></div>
                    <div className="flex flex-row gap-2 p-1"> <span className="w-32">Email:</span> <span>{newUser.registrationNumber}</span></div>
                    <div className="flex flex-row gap-2 p-1"> <span className="w-32">Reg NO:</span> <span>{newUser.email}</span></div>
                    <div className="flex flex-row gap-2"> <span className="p-1 w-32">Full Name:</span> <DoubleClickInput 
                        initialValue={newUser.fullName} 
                        onChange={(value) => setNewUser({ ...newUser, fullName: value })}
                        inputClassName="border bg-blue-100 text-blue-600 w-48 px-2 rounded-full"
                        textClassName="border bg-blue-100 text-blue-600 w-48 px-2 rounded-full"
                        />
                    </div>
                    <div className="flex flex-row gap-2"> <span className="p-1 w-32">Phone NO:</span> <DoubleClickInput 
                        initialValue={newUser.phone ? newUser.phone : 'none'} 
                        onChange={(value) => setNewUser({ ...newUser, phone: value })}
                        inputClassName="bg-blue-100 text-blue-600 w-48 px-2 rounded-full"
                        textClassName="bg-blue-100 text-blue-600 w-48 px-2 rounded-full"
                        />
                    </div>
                    <div className="flex flex-row gap-2"> <span className="p-1 w-32">Vjudge:</span> <DoubleClickInput 
                        initialValue={newUser.vjudgeHandle ? newUser.vjudgeHandle : 'none'} 
                        onChange={(value) => setNewUser({ ...newUser, vjudgeHandle: value })}
                        inputClassName="bg-blue-100 text-blue-600 w-48 px-2 rounded-full"
                        textClassName="bg-blue-100 text-blue-600 w-48 px-2 rounded-full"
                        />
                    </div>
                    <div className="flex flex-row gap-2"> <span className="p-1 w-32">CF Handles:</span> 
                        <div className="flex flex-row gap-2">
                            {newUser.cfHandles?.map((handle) => {
                                return <Tag key={handle} tag={handle} removeTag={removeCFHandle}/>;
                            })}
                            <input className="w-24 bg-green-100 text-blue-600 px-2 text-green-600 outline-none border-0 border-b border-green-600" value={newCFHandle} onChange={(e:React.ChangeEvent<HTMLInputElement>) => setNewCFHandle(e.target.value)}  onKeyDown={(e:React.KeyboardEvent<HTMLInputElement>)=>{
                                if(e.key == 'Enter'){
                                    addCFhandle();
                                }
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
const Tag = ({ tag, removeTag }: { tag: string, removeTag: (tag: string) => Promise<void> }) => {
    const [loading, setLoading] = useState(false);
    const handleRemoveTag = async () => {
        setLoading(true);
        try{
            await removeTag(tag);
        }finally{
            setLoading(false);
        }
    }
    return (
        <div className="bg-green-100 text-green-600 px-2 rounded-full flex items-center flex-row gap-2 border">
            {tag}
            <Image className="cursor-pointer" src={loading ? loaderIcon : closeIcon} alt="" width={16} height={16} onClick={handleRemoveTag}/>
        </div>
    );
}
export default Settings;
