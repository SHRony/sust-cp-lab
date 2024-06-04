'use client';
import React, { createContext, useEffect, useState } from "react";
import { AuthContextType, userType, userStateType } from "./types";
import axios from "axios";
// Define the type of your context value


// Create the context with the defined type
export const authContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | userStateType>(null);

  const signIn = async (userName: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/login', {
        userName: userName,
        password: password,
      });
      if(res.status != 200){
        console.log(res.data.error);
        return ;
      }
      await setUser({ userName: userName, userType: res.data.userType});
      setSignedIn(true);
    } catch (error) {
      // Handle authentication errors
      console.error("Authentication failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = async () => {
    // Clear authentication-related data
    setUser(null);
    setSignedIn(false);
    await axios.post('/api/logout');

  };

  const authValue: AuthContextType = {
    signedIn: signedIn,
    loading: loading,
    user: user,
    signIn: signIn,
    signOut: signOut,
  };


  useEffect(() => {
    async function yo(){
      const res = await axios.post('/api/isloggedin');
      if(res.status == 200){
        console.log(res);
        setUser({ userName: res.data.user.username, userType: res.data.user.userType});
        setSignedIn(true);
      }
      setLoading(false);
    }
    yo();
  }, []);
  useEffect(() => {
    console.log(user);
  });

  return (
    <authContext.Provider value={authValue}>
      {children}
    </authContext.Provider>
  );
}
