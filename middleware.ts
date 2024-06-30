import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import authContext from '@/app/lib/AuthProvider';
import { useContext } from 'react';
import axios from 'axios';
export async function middleware(request: NextRequest) {
  // const cookies = request.cookies.getAll();
  
  const protectedRoutes = ['/contests/create', '/profile'];
  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    const token = request.cookies.get('token')?.value;
    if(!token) return NextResponse.redirect(new URL('/login', request.url));
    let url = request.nextUrl.clone()
    url.pathname = '/api/isloggedin';
    console.log(url.toString());
    const res = await axios.post(url.toString(), null, {
      headers: {
        'Cookie': `token=${token}`
      },
      withCredentials: true
    });
    if(res.status == 200) return NextResponse.next();
    else return NextResponse.redirect(new URL('/login', request.url));
    // if(res.data.error) return NextResponse.redirect(new URL('/login', request.url));
    // let url = request.nextUrl.clone()
    // url.pathname = '/api/isloggedin';
    // const res = await axios.post(url.toString(), null, {
    //   withCredentials: true
    // });
    
    // if(res.status != 200) return NextResponse.redirect(new URL('/login', request.url));
    // else return NextResponse.next();
  }
  return NextResponse.next();
}