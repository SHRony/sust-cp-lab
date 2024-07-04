'use client';
import React, { createContext, useEffect, useState } from "react";
import { AuthContextType, userType, userStateType } from "./types";
import axios from "axios";
// Define the type of your context value


// Create the context with the defined type
export const authContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children, userProps }: { children: React.ReactNode, userProps: userStateType|null }) {
  const [signedIn, setSignedIn] = useState(userProps != null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<null | userStateType>(userProps);
  const signIn = async (userName: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/login', {
        userName: userName,
        password: password,
      });
      if(res.status != 200){
        console.log(res.data.error);
        return false;
      }
      await setUser({ userName: userName, userType: res.data.userType});
      setSignedIn(true);
      setLoading(false);
      return true;
    } catch (error) {
      // Handle authentication errors
      console.log('could not login');
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }    
  };
  
  const signOut = async () => {
    // Clear authentication-related data
    setUser(null);
    setSignedIn(false);
    await axios.post('/api/logout');
    //refresh the page
    console.log('logging out');
    window.location.reload();

  };

  const authValue: AuthContextType = {
    signedIn: signedIn,
    loading: loading,
    user: user,
    signIn: signIn,
    signOut: signOut,
  };

  return (
    <authContext.Provider value={authValue}>
      {children}
    </authContext.Provider>
  );
}
