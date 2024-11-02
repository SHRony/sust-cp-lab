import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import authContext from '@/app/lib/AuthProvider';
import { useContext } from 'react';
import axios from 'axios';
const isAdminOnly = (request: NextRequest) => {
  let routes = ['/users/mentors'];
  return routes.some((route) => request.nextUrl.pathname.startsWith(route));
}
const isGuestOnly = (request: NextRequest) => {
  let routes = ['/login', '/registration', 'registration/mentor'];
  return routes.some((route) => request.nextUrl.pathname.startsWith(route));
}
const isAdminAndMentorOnly = (request: NextRequest) => {
  let routes = ['/contests/create', '/createteams'];
  const createteamsRoute = /\/contests\/\w+\/createteams/;
  return routes.some((route) => request.nextUrl.pathname.startsWith(route)) || createteamsRoute.test(request.nextUrl.pathname);
}
const isStudentOnly = (request: NextRequest) => {
  let routes = ['/profile'];
  return routes.some((route) => request.nextUrl.pathname==(route));
}
const isNotForGuests = (request: NextRequest) => {
  let routes = ['/login', '/registration', 'registration/mentor', '/'];
  return !routes.some((route) => request.nextUrl.pathname==(route));
}
export async function middleware(request: NextRequest) {
  const PUBLIC_FILE = /\.(.*)$/;
  if(isNotForGuests(request) && !PUBLIC_FILE.test(request.nextUrl.pathname)) {
    const token = request.cookies.get('token')?.value;
    if(!token) return NextResponse.redirect(new URL('/login', request.url));
  }
  if(isStudentOnly(request)){
    const token = request.cookies.get('token')?.value;
    if(!token) return NextResponse.redirect(new URL('/login', request.url));
    let url = request.nextUrl.clone()
    url.pathname = '/api/isloggedin';
    const res = await axios.post(url.toString(), null, {
      headers: {
        'Cookie': `token=${token}`
      },
      withCredentials: true
    });

    if(res.data.user.userType != 'student') return NextResponse.redirect(new URL('/', request.url));
    if(request.nextUrl.pathname == '/profile') return NextResponse.redirect(new URL(`/profile/${res.data.user.userName}`, request.url));
    return NextResponse.next();
  }
  if(isGuestOnly(request)){
    const token = request.cookies.get('token')?.value;
    if(token) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }
  if(isAdminOnly(request)) {
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
    console.log(res.data);
    if(res.data.user.userType != 'admin') return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }
  if(isAdminAndMentorOnly(request)) {
    const token = request.cookies.get('token')?.value;
    if(!token) return NextResponse.redirect(new URL('/login', request.url));
    let url = request.nextUrl.clone()
    url.pathname = '/api/isloggedin';
    console.log(url.toString());
    const isLoggedInApiRes = await axios.post(url.toString(), null, {
      headers: {
        'Cookie': `token=${token}`
      },
      withCredentials: true
    });
    const currentUser = isLoggedInApiRes.data.user;
    if(!currentUser || (currentUser.userType != 'admin' && currentUser.userType != 'mentor')) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }
  return NextResponse.next();
}