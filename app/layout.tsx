import type { Metadata } from "next";
import "./globals.css";
import {inter} from '@/app/ui/fonts';
import React from "react";
import NavBar from '@/app/ui/nav/NavBar';
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({children} : Readonly<{children:React.ReactNode}>){
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar></NavBar>
        {children}
      </body>
    </html>
  );
}