import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import AuthProvider from "./lib/AuthProvider";
import { isLoggedIn } from '@/app/api/queries/user_queries';
import SideNav from "./ui/nav/side-nav";
import { headers } from "next/headers";
import { redirect } from "next/dist/server/api-utils";
import LayoutWrapper from "./client-wraper";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Sust Competitive Programming Lab",
  description: "A platform for competitive programming community of SUST",
};

export default async function RootLayout({children} : Readonly<{children:React.ReactNode}>){
  const user = await isLoggedIn();
  return (
    <html lang="en">
      <body className="inter.className">
        <div className="flex items-stretch theme-light h-screen w-screen bg-gray-100 gap-4">
          <AuthProvider userProps={user}>
            {children}
          </AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#363636',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
              },
              success: {
                iconTheme: {
                  primary: '#4CAF50',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f44336',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}
