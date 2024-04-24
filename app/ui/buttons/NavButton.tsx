import React, { ReactNode } from "react";
import { Button, IconButton } from "@mui/material";

import Link from "next/link";
export default function NavButton({children, url, type} : Readonly<{children:ReactNode|string, url : string, type : string}>){
  return (
    <Link href={url}>{
      type != 'icon' ? (
        <div className='h-full flex flex-row justify-evenly items-center px-5 py-3 text-white'><Button style={{color : 'white'}} variant="text">{children}</Button></div>
      ) : (
        <div className='h-full flex flex-row justify-evenly items-center mx-5 rounded-full'><IconButton style={{padding : '20px'}}>{children}</IconButton></div>
      ) 
    }
    </Link>
  );
}