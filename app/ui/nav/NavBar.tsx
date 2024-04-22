import React from "react";
import styles from '@/styles/nav.module.css'
import NavButton from '@/app/ui/buttons/NavButton';
import logoutIcon from '@/public/logout_white.png'
import profileIcon from '@/public/profile.svg'
import Image from "next/image";
export default function NavBar(){
  return <div className={styles.navContainer}>
    <div className={styles.navLeft}>
      <NavButton url="/" type="text">
        Home
      </NavButton>
      <NavButton url="" type="text">
        Contests
      </NavButton>
      <NavButton url="/cfviz" type="text">
        CF Viz
      </NavButton>
      <NavButton url="" type="text">
        Forum
      </NavButton>
      <NavButton url="" type="text">
        Users
      </NavButton>
      
    </div>
    <div className={styles.navLeft}>
      <NavButton url="" type="icon">
        <Image
          src={profileIcon}
          width={25}
          height={25}
          className="block"
          alt="Profile"
        />
      </NavButton>
      <NavButton url="" type="icon">
        <Image
          src={logoutIcon}
          width={25}
          height={25}
          className="block"
          alt="Logout"
        />
      </NavButton>
      
    </div>
  </div>
}