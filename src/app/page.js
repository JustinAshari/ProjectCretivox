// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "lenis";

import styles from "./page.module.css";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const LoginGate = dynamic(() => import("@/components/LoginGate"), { ssr: false });
const StatusHeader = dynamic(() => import("@/components/StatusHeader"), { ssr: false });
const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });
const FierceGallery = dynamic(() => import("@/components/FierceGallery"), { ssr: false });
const StoryScroll = dynamic(() => import("@/components/StoryScroll"), { ssr: false });

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Recover session on mount
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("cretivox_token");
    const storedUser = localStorage.getItem("cretivox_user");

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  // Initialize Lenis smooth scroll once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.15,
    });

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);

    lenis.on("scroll", ScrollTrigger.update);

    // Sync GSAP ticker with Lenis raf
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, [isAuthenticated]);

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
    setUserData(data);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
  };

  if (!mounted) {
    return null; // prevent hydration mismatch
  }

  return (
    <>
      {/* Custom Liquid Cursor */}
      <CustomCursor />

      {!isAuthenticated ? (
        /* The gatekeeper interface */
        <LoginGate onLoginSuccess={handleLoginSuccess} />
      ) : (
        /* Main Interactive Layout */
        <div className={styles.mainLayout}>
          {/* Status navigation bar */}
          <StatusHeader userData={userData} onLogout={handleLogout} />

          <main>
            {/* Hero Section */}
            <Hero />

            {/* Fierce Photos Gallery */}
            <FierceGallery />

            {/* Horizontal Storytelling */}
            <StoryScroll />
          </main>

          {/* Premium Aquatic Footer */}
          <footer className={styles.aquaticFooter}>
            <div className={styles.footerContent}>
              <h2 className={styles.footerTitle}>Let&apos;s Create Waves.</h2>
              <p className={styles.footerDesc}>
                Looking for a creative front-end engineer to build smooth, fluid, and jaw-dropping digital products?
                Let&apos;s dive in and build something beautiful together.
              </p>
              
              <div className={styles.footerCreds}>
                <span className={styles.devTag}>DESIGNED & CODED BY EMILY JOHNSON</span>
                <span className={styles.yearTag}>CRETIVOX ENDURANCE TEST // 2026</span>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
