import React from "react";
import styles from '@/styles/nav.module.css'
import NavButton from '@/app/ui/buttons/NavButton';
export default function NavBar(){
  return <div className={styles.navContainer}>
    <div className={styles.navLeft}>
      <NavButton url="" type="text">yodsdfasd</NavButton>
    </div>
    <div className={styles.navLeft}>
      <NavButton url="" type="text">yo</NavButton>
    </div>
  </div>
}