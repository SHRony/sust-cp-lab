import React, { ReactNode } from "react";
import { Button, IconButton } from "@mui/material";

import Link from "next/link";
export default function NavButton({children, url, type} : Readonly<{children:ReactNode|string, url : string, type : string}>){
  return (
    <Link href={url}>{
      type != 'icon' ? (
        <Button variant="text" style={{color:'white'}} className='h-full flex flex-row justify-evenly items-center px-16 text-white'>{children}</Button>
      ) : (
        <IconButton className='h-full flex flex-row justify-evenly items-center px-16'>{children}</IconButton>
      ) 
    }
    </Link>
  );
}