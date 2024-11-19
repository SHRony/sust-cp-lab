import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import AuthProvider from "./lib/AuthProvider";
import { isLoggedIn } from '@/app/api/queries/user_queries';


export const metadata: Metadata = {
  title: "Sust Competitive Programming Lab",
  description: "A platform for competitive programming community of SUST",
};

export default async function RootLayout({children} : Readonly<{children:React.ReactNode}>){
  const user = await isLoggedIn();
  return (
    <html lang="en">
      <body className="inter.className flex items-stretch theme-light h-screen w-screen bg-gray-100 p-0 m-0 overflow-x-hidden">
          <AuthProvider userProps={user}>
              {children}
          </AuthProvider>
        
      </body>
    </html>
  );
}
