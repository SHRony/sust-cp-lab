'use client'
import React, { ReactNode } from "react";
import { Button, IconButton } from "@mui/material";

import Link from "next/link";
import { usePathname } from "next/navigation";
export default function NavButton({children, url, type, onClick} : Readonly<{children:ReactNode|string, url : string, type : string, onClick?:() => void | Promise<void> | null}>){
  const pathname = usePathname();
  return (
    <Link href={url}>{
      type != 'icon' ? (
        <div className='h-full flex flex-row justify-evenly items-center text-white'>
          <Button 
            
            variant="text"
            onClick={onClick}
            sx = {url == pathname ? {
              'color' : 'white',
              borderBottom : '2px solid white',
              borderRadius : '0',
              ':hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)', // theme.palette.primary.main
                color: 'var(--onPrimary)',
                borderRadius : '4px',
                fontWeight : 'bold',
              },
            } : {
              'color' : 'white',
              ':hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)', // theme.palette.primary.main
                color: 'var(--onPrimary)',
                fontWeight : 'bold',
              },
            }
          }
          >
            {children}
          </Button>
        </div>
      ) : (
        <div className='h-full flex flex-row justify-evenly items-center rounded-full'><IconButton style={{padding : '20px'}} onClick={onClick}>{children}</IconButton></div>
      ) 
    }
    </Link>
  );
}
