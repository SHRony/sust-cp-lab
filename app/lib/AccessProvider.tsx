import { useContext, useEffect, useState } from "react";
import { authContext } from "./AuthProvider";

export default function AccessProvider({ permittedUsers, children }: { permittedUsers: string[], children: React.ReactNode }) {
  const auth = useContext(authContext);
  const [permition, setPermision] = useState(false);
  useEffect(() => {
    console.log(auth);
    if(auth && auth.signedIn && (permittedUsers.includes(auth.user?.userType || ''))) setPermision(true);
    if(auth && (auth.signedIn == false) && auth.loading == false && permittedUsers.length == 0) setPermision(true);
  },[auth, permittedUsers])
  if (!auth) return <></>;
  if (!permition) return <></>;
  
  return <>{children}</>;
}
