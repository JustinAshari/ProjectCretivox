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

  const handleNavClick = (e, selector) => {
    e.preventDefault();
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

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
      {/* Left Navigation Links */}
      <div className={styles.leftLinks}>
        <a href="#hero" onClick={(e) => handleNavClick(e, "#hero")} className={styles.navLink}>
          HOME
        </a>
        <a href="#story-scroll" onClick={(e) => handleNavClick(e, "#story-scroll")} className={styles.navLink}>
          ABOUT
        </a>
        <a href="#fierce-gallery" onClick={(e) => handleNavClick(e, "#fierce-gallery")} className={styles.navLink}>
          WORK
        </a>
      </div>

      {/* Center Custom Bold Typography Logo */}
      <div className={styles.centerLogo} onClick={(e) => handleNavClick(e, "#hero")}>
        <span className={styles.logoText}>THE FLOW</span>
        <span className={styles.logoSubText}>BY JUSTIN ASHARI</span>
      </div>

      {/* Right Actions & User Details */}
      <div className={styles.rightLinks}>
        <a href="#footer" onClick={(e) => handleNavClick(e, "#footer")} className={styles.navLink}>
          CONTACT
        </a>

        {userData && (
          <div className={styles.userSection}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userData.image || "https://dummyjson.com/icon/emilys/128"}
              alt={`${userData.firstName} Avatar`}
              className={styles.userAvatar}
            />
            <span className={styles.userName}>
              {userData.firstName === "Emily" ? "JUSTIN" : userData.firstName.toUpperCase()}
            </span>
          </div>
        )}

        <button className={styles.logoutBtn} onClick={handleLogoutClick}>
          DIVE OUT
        </button>
      </div>
    </header>
  );
}
