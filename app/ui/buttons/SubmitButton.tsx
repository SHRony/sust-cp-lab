import React, { ReactNode } from "react";
import { Button, IconButton } from "@mui/material";

export default function Sub({children, clickHandler, disabled=false} : Readonly<{children:ReactNode|string, clickHandler : () => void, disabled? : boolean}>){
  return (
    <button
      type="button"
      onClick={clickHandler}
      disabled={disabled}
      className={
        `bg-primary hover:bg-primary text-white font-bold py-1 px-2 rounded w-full transition duration-300 ease-in-out" ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95 cursor:pointer"}`
      }
    >
      {children}
    </button>
  );
}
