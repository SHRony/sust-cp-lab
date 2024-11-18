'use client';
import React, { createContext, useState, useEffect } from "react";
import { AuthContextType, userStateType } from "./types";
import axios from "axios";

export const authContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children, userProps }: { children: React.ReactNode, userProps: userStateType|null }) {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | userStateType>(null);

  // Initialize auth state from props
  useEffect(() => {
    if (userProps) {
      setUser(userProps);
      setSignedIn(true);
    }
    setLoading(false);
  }, [userProps]);

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
      const userData = { userName: userName, userType: res.data.userType };
      setUser(userData);
      setSignedIn(true);
      return true;
    } catch (error) {
      console.log('could not login');
      throw error;
    } finally {
      setLoading(false);
    }    
  };
  
  const signOut = async () => {
    try {
      await axios.post('/api/logout');
      setUser(null);
      setSignedIn(false);
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const authValue: AuthContextType = {
    signedIn,
    loading,
    user,
    signIn,
    signOut,
  };

  return (
    <authContext.Provider value={authValue}>
      {children}
    </authContext.Provider>
  );
}
