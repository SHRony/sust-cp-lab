import React, { ReactNode } from "react";
import { Button, IconButton } from "@mui/material";

import Link from "next/link";
export default function NavButton({children, url, type} : Readonly<{children:ReactNode|string, url : string, type : string}>){
  return (
    <Link href={url}>{
      type != 'icon' ? (
        <Button variant="text" className='h-full flex flex-row justify-evenly items-center px-5 py-3 text-white'>{children}</Button>
      ) : (
        <IconButton className='h-full flex flex-row justify-evenly items-center p-5 mx-5'>{children}</IconButton>
      ) 
    }
    </Link>
  );
}