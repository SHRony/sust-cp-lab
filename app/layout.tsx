import type { Metadata } from "next";
import "./globals.css";
import {inter} from '@/app/ui/fonts';
import React from "react";
import NavBar from '@/app/ui/nav/NavBar';
import AuthProvider from "./lib/AuthProvider";

export const metadata: Metadata = {
  title: "Sust Competitive Programming Lab",
  description: "A platform for competitive programming community of SUST",
};

export default function RootLayout({children} : Readonly<{children:React.ReactNode}>){
  
  return (
    <html lang="en">
      <body style={{display : "flex"}} className={inter.className + "flex flex-col items-center"}>
        <AuthProvider>
          <NavBar></NavBar>
          <div className="flex flex-col items-center w-100 mobile:w-106 tablet:w-192 laptop:w-256 desktop:w-360">
            {children}
          </div>
        </AuthProvider>
          
      </body>
    </html>
  );
}
