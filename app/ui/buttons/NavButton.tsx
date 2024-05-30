'use client'
import React, { ReactNode } from "react";
import { Button, IconButton } from "@mui/material";

import Link from "next/link";
import { usePathname } from "next/navigation";
export default function NavButton({children, url, type} : Readonly<{children:ReactNode|string, url : string, type : string}>){
  const pathname = usePathname();
  return (
    <Link href={url}>{
      type != 'icon' ? (
        <div className='h-full flex flex-row justify-evenly items-center px-5 py-3 text-white'>
          <Button 
            
            variant="text"
            sx = {url == pathname ? {
              'color' : 'white',
              fontWeight : 'bold',
              borderBottom : '2px solid white',
              borderRadius : '0',
              ':hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)', // theme.palette.primary.main
                color: 'var(--onPrimary)',
                borderRadius : '4px',
              },
            } : {
              'color' : 'white',
              fontWeight : 'bold',
              ':hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)', // theme.palette.primary.main
                color: 'var(--onPrimary)',
              },
            }
          }
          >
            {children}
          </Button>
        </div>
      ) : (
        <div className='h-full flex flex-row justify-evenly items-center mx-5 rounded-full'><IconButton style={{padding : '20px'}}>{children}</IconButton></div>
      ) 
    }
    </Link>
  );
}