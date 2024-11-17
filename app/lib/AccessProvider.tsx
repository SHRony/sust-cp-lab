import { useContext, useEffect, useState } from "react";
import { authContext } from "./AuthProvider";

export default function AccessProvider({ permittedUsers, children, fallback }: { 
  permittedUsers: string[], 
  children: React.ReactNode,
  fallback?: React.ReactNode 
}) {
  const auth = useContext(authContext);
  const [permition, setPermision] = useState(false);
  useEffect(() => {
    setPermision(false);
    if(auth && auth.signedIn && (permittedUsers.includes(auth.user?.userType || ''))) setPermision(true);
    if(auth && auth.signedIn && (permittedUsers.includes(('_' + auth.user?.userName) || ''))) setPermision(true);
    if(auth && (auth.signedIn == false) && auth.loading == false && permittedUsers.length == 0) setPermision(true);
    console.log(auth, permittedUsers);
    console.log(auth?.user?.userType)
  },[auth, permittedUsers])
  if (!auth) return <></>;
  if (!permition) return fallback ? <>{fallback}</> : <></>;
  return <>{children}</>;
}
