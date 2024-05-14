import React, { ReactNode } from "react";
import { Button, IconButton } from "@mui/material";

import Link from "next/link";
export default function Sub({children, clickHandler} : Readonly<{children:ReactNode|string, clickHandler : () => void}>){
  return (
    <Button onClick={clickHandler} style={{fontWeight : 'bold',background:'var(--primary)'}} variant="contained" className='flex flex-row justify-evenly items-center py-1 px-2 text-white'>{children}</Button>
  );
}