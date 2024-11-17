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
import { motion, AnimatePresence } from "framer-motion";
import { Settings as SettingsIcon, User, Mail, Phone, Hash, Code, Award, X, Plus, Save } from "lucide-react";
import { toast } from "react-hot-toast";

const SettingField = ({ label, children }: { label: React.ReactNode; children: React.ReactNode }) => (
  <motion.div 
    className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ x: 8 }}
  >
    <div className="min-w-[8rem] flex items-center gap-3 text-gray-600">
      {label}
    </div>
    <div className="flex-1 min-w-0">
      {children}
    </div>
  </motion.div>
);

const Tag = ({ tag, removeTag }: { tag: string; removeTag: (tag: string) => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-full group"
  >
    <a 
      href={'https://codeforces.com/profile/' + tag}
      className="hover:text-blue-700 transition-colors truncate"
      target="_blank"
      rel="noopener noreferrer"
    >
      {tag}
    </a>
    <button
      onClick={() => removeTag(tag)}
      className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all flex-shrink-0"
    >
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

const Settings = ({ user }: { user: userType }) => {
    const [newUser, setNewUser] = useState(user);
    const [newCFHandle, setNewCFHandle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Track changes
    useEffect(() => {
      const hasUserChanges = 
        newUser.fullName !== user.fullName ||
        newUser.phone !== user.phone ||
        newUser.vjudgeHandle !== user.vjudgeHandle;
      
      setHasChanges(hasUserChanges);
    }, [newUser, user]);

    const removeCFHandle = async (handle: string) => {
        try {
            setIsLoading(true);
            const res = await axios.post('/api/profile/removeCFHandle', {cfHandle: handle, userName: user.userName});
            if(res.status === 200){
                if(newUser && newUser.cfHandles) {
                    setNewUser({...newUser, cfHandles: newUser.cfHandles.filter((cfHandle) => cfHandle !== handle)});
                } else {
                    setNewUser({...newUser, cfHandles: []});
                }
            }
        } catch (error) {
            console.error('Error removing CF handle:', error);
            toast.error('Failed to remove CF handle');
        } finally {
            setIsLoading(false);
        }
    };

    const addCFhandle = async () => {
        if(newCFHandle.trim() === '') return;
        try {
            setIsLoading(true);
            const res = await axios.post('/api/profile/addCFHandle', {cfHandle: newCFHandle, userName: user.userName});
            if(res.status === 200){
                if(newUser && newUser.cfHandles) {
                    setNewUser({...newUser, cfHandles: [...newUser.cfHandles, newCFHandle]});
                } else {
                    setNewUser({...newUser, cfHandles: [newCFHandle]});
                }
                setNewCFHandle('');
            }
        } catch (error) {
            console.error('Error adding CF handle:', error);
            toast.error('Failed to add CF handle');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const res = await axios.post('/api/profile/updateSettings', {
                userName: user.userName,
                fullName: newUser.fullName,
                phone: newUser.phone,
                vjudgeHandle: newUser.vjudgeHandle
            });

            if (res.status === 200) {
                toast.success('Settings saved successfully');
                setHasChanges(false);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto w-full"
        >
            <Card className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <SettingsIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                hasChanges
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving}
                        >
                            {isSaving ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Save className="w-4 h-4" />
                                </motion.div>
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Changes
                        </motion.button>
                    </div>
                </div>

                <div className="p-6 space-y-2">
                    <SettingField label={<><User className="w-4 h-4" /> Handle</>}>
                        <span className="text-gray-700 font-medium">{newUser.userName}</span>
                    </SettingField>

                    <SettingField label={<><Mail className="w-4 h-4" /> Email</>}>
                        <span className="text-gray-700">{newUser.email}</span>
                    </SettingField>

                    <SettingField label={<><Hash className="w-4 h-4" /> Reg NO</>}>
                        <span className="text-gray-700">{newUser.registrationNumber}</span>
                    </SettingField>

                    <SettingField label={<><User className="w-4 h-4" /> Full Name</>}>
                        <DoubleClickInput 
                            initialValue={newUser.fullName} 
                            onChange={(value) => setNewUser({ ...newUser, fullName: value })}
                            inputClassName="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            textClassName="text-gray-700 hover:text-blue-600 transition-colors"
                        />
                    </SettingField>

                    <SettingField label={<><Phone className="w-4 h-4" /> Phone</>}>
                        <DoubleClickInput 
                            initialValue={newUser.phone || 'Not set'} 
                            onChange={(value) => setNewUser({ ...newUser, phone: value })}
                            inputClassName="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            textClassName="text-gray-700 hover:text-blue-600 transition-colors"
                        />
                    </SettingField>

                    <SettingField label={<><Code className="w-4 h-4" /> Vjudge</>}>
                        <DoubleClickInput 
                            initialValue={newUser.vjudgeHandle || 'Not set'} 
                            onChange={(value) => setNewUser({ ...newUser, vjudgeHandle: value })}
                            inputClassName="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            textClassName="text-gray-700 hover:text-blue-600 transition-colors"
                        />
                    </SettingField>

                    <SettingField label={<><Award className="w-4 h-4" /> CF Handles</>}>
                        <div className="space-y-3 w-full">
                            <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-1 -m-1 w-full">
                                <AnimatePresence>
                                    {newUser.cfHandles?.map((handle) => (
                                        <Tag key={handle} tag={handle} removeTag={removeCFHandle} />
                                    ))}
                                </AnimatePresence>
                            </div>
                            <div className="flex items-center gap-2 pt-2 w-full">
                                <input
                                    type="text"
                                    className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Add CF handle..."
                                    value={newCFHandle}
                                    onChange={(e) => setNewCFHandle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !isLoading) {
                                            addCFhandle();
                                        }
                                    }}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 flex-shrink-0"
                                    onClick={addCFhandle}
                                    disabled={isLoading || !newCFHandle.trim()}
                                >
                                    <Plus className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </SettingField>
                </div>
            </Card>
        </motion.div>
    );
};

export default Settings;
