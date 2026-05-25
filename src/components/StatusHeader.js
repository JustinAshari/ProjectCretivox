// src/components/StatusHeader.js
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./StatusHeader.module.css";

export default function StatusHeader({ userData, onLogout }) {
  const headerRef = useRef(null);

  // Entrance animation for header
  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: "power4.out", delay: 0.5 }
    );
  }, []);

  const handleLogoutClick = () => {
    // Fade out header
    gsap.to(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        localStorage.removeItem("cretivox_token");
        localStorage.removeItem("cretivox_user");
        onLogout();
      },
    });
  };

  return (
    <header ref={headerRef} className={`${styles.headerWrapper} glass-card`}>
      <div className={styles.leftSection}>
        <div className={styles.logoPulse}></div>
        <span className={styles.logoText}>THE FLOW</span>
      </div>

      <div className={styles.rightSection}>
        {userData && (
          <div className={styles.userInfoCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userData.image || "https://dummyjson.com/icon/emilys/128"}
              alt={`${userData.firstName} Avatar`}
              className={styles.userAvatar}
            />
            <div className={styles.userDetails}>
              <span className={styles.userName}>
                {userData.firstName} {userData.lastName}
              </span>
              <span className={styles.userStatus}>
                SYSTEM ONLINE // AUTH
              </span>
            </div>
          </div>
        )}

        <button className={styles.logoutBtn} onClick={handleLogoutClick}>
          DIVE OUT
        </button>
      </div>
    </header>
  );
}
