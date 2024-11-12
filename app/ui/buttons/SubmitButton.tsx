import React, { ReactNode } from "react";
import { Button, IconButton } from "@mui/material";

import Link from "next/link";
export default function Sub({children, clickHandler, disabled=false} : Readonly<{children:ReactNode|string, clickHandler : () => void, disabled? : boolean}>){
  return (
    <Button disabled={disabled} onClick={clickHandler} variant="contained" className='bg-primary hover:bg-primary flex flex-row justify-evenly items-center py-1 px-2 text-white w-full'>{children}</Button>
  );
}