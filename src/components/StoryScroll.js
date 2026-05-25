// src/components/StoryScroll.js
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./StoryScroll.module.css";

export default function StoryScroll() {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current;
    const container = containerRef.current;

    // --- Panel 1: Salmon Upstream continuous loop ---
    const salmons = wrapper.querySelectorAll(`.${styles.salmon}`);
    const salmonTweens = [];
    salmons.forEach((salmon, i) => {
      const startX = window.innerWidth + 150 + i * 200;
      const endX = -300;
      const duration = 12 + i * 4;
      
      const t = gsap.fromTo(salmon,
        { x: startX },
        {
          x: endX,
          duration: duration,
          repeat: -1,
          ease: "none",
          delay: i * 2,
        }
      );
      salmonTweens.push(t);
      
      // Tail wiggle
      const tail = salmon.querySelector(".salmon-tail");
      if (tail) {
        gsap.to(tail, {
          rotate: 18,
          transformOrigin: "right center",
          repeat: -1,
          yoyo: true,
          duration: 0.2 + i * 0.05,
          ease: "sine.inOut"
        });
      }
    });

    // --- Panel 2: Interactive Minnows Flocking ---
    const minnowContainer = wrapper.querySelector("#minnow-school-container");
    const minnows = [];
    const panel2 = wrapper.querySelector(`.${styles.panel2}`);
    let handleMouseMove = null;

    if (minnowContainer && panel2) {
      const numMinnows = 15;
      for (let i = 0; i < numMinnows; i++) {
        const m = document.createElement("div");
        m.className = styles.minnow;
        m.innerHTML = `
          <svg viewBox="0 0 40 20" width="100%" height="100%">
            <path d="M5,10 C10,5 25,4 32,8 C35,6 38,4 40,7 C38,10 38,10 40,13 C38,15 35,13 32,12 C25,16 10,15 5,10 Z" fill="var(--color-glow-blue)" opacity="0.75" />
          </svg>
        `;
        minnowContainer.appendChild(m);
        
        const initX = 150 + Math.random() * 350;
        const initY = 100 + Math.random() * 250;
        gsap.set(m, { x: initX, y: initY });
        
        minnows.push({
          element: m,
          x: initX,
          y: initY,
          baseX: initX,
          baseY: initY,
          targetX: initX,
          targetY: initY,
          speed: 0.05 + Math.random() * 0.04
        });
      }

      // Scatter logic on mousemove relative to panel
      handleMouseMove = (e) => {
        const rect = panel2.getBoundingClientRect();
        const mX = e.clientX - rect.left;
        const mY = e.clientY - rect.top;

        minnows.forEach((minnow) => {
          const dx = minnow.x - mX;
          const dy = minnow.y - mY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const angle = Math.atan2(dy, dx);
            const force = (130 - dist) * 0.65;
            
            minnow.targetX += Math.cos(angle) * force;
            minnow.targetY += Math.sin(angle) * force;

            // Keep within container limits
            minnow.targetX = Math.max(80, Math.min(rect.width - 80, minnow.targetX));
            minnow.targetY = Math.max(60, Math.min(rect.height - 60, minnow.targetY));
          } else {
            // Drift back to center school
            minnow.targetX += (minnow.baseX - minnow.targetX) * 0.02;
            minnow.targetY += (minnow.baseY - minnow.targetY) * 0.02;
          }
        });
      };

      panel2.addEventListener("mousemove", handleMouseMove);

      // School wander ticker loop
      const updateMinnows = () => {
        minnows.forEach((minnow, idx) => {
          minnow.baseX += Math.sin(Date.now() * 0.001 + idx) * 0.3;
          minnow.baseY += Math.cos(Date.now() * 0.001 + idx) * 0.3;

          minnow.x += (minnow.targetX - minnow.x) * minnow.speed;
          minnow.y += (minnow.targetY - minnow.y) * minnow.speed;

          // Orient minnow scale based on movement direction
          const deltaX = minnow.targetX - minnow.x;
          const currentScale = deltaX > 0.5 ? 1 : (deltaX < -0.5 ? -1 : 1);

          gsap.set(minnow.element, { x: minnow.x, y: minnow.y, scaleX: currentScale });
        });
      };
      gsap.ticker.add(updateMinnows);
      minnowContainer._ticker = updateMinnows;
    }

    // --- Panel 3: Floating Jellyfish & Angler Sway ---
    const jellies = wrapper.querySelectorAll(`.${styles.jellyfish}`);
    jellies.forEach((jelly, i) => {
      // Floating up and down
      gsap.fromTo(jelly,
        { y: 80 + i * 40 },
        {
          y: 180 + i * 40,
          duration: 4.5 + i * 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      );
      
      // Pulsing head scale (swimming pulse)
      const head = jelly.querySelector("path");
      if (head) {
        gsap.fromTo(head,
          { scaleY: 1 },
          {
            scaleY: 0.8,
            transformOrigin: "top center",
            duration: 2.2 + i * 0.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          }
        );
      }
    });

    const angler = wrapper.querySelector("#angler-fish-element");
    const panel3 = wrapper.querySelector(`.${styles.panel3}`);
    let handlePanel3MouseMove = null;

    if (angler && panel3) {
      // Gentle floating sway
      gsap.fromTo(angler,
        { y: 130 },
        {
          y: 170,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      );

      // Angler follow mouse rotation
      handlePanel3MouseMove = (e) => {
        const rect = panel3.getBoundingClientRect();
        const mX = e.clientX - rect.left;
        const mY = e.clientY - rect.top;

        const anglerRect = angler.getBoundingClientRect();
        const aX = anglerRect.left + anglerRect.width / 2 - rect.left;
        const aY = anglerRect.top + anglerRect.height / 2 - rect.top;
        
        const angle = Math.atan2(mY - aY, mX - aX) * (180 / Math.PI);
        const targetRotation = Math.max(-12, Math.min(12, angle * 0.4));
        
        gsap.to(angler, { rotate: targetRotation, transformOrigin: "center center", duration: 0.5 });
      };

      panel3.addEventListener("mousemove", handlePanel3MouseMove);
    }

    // --- Main Pin Horizontal Scroll ---
    let ctx = gsap.context(() => {
      if (window.innerWidth >= 992) {
        gsap.to(container, {
          x: () => -(container.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${container.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
          },
        });
      }
    }, wrapper);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      
      // Clean up Panel 2 minnows
      if (panel2 && handleMouseMove) {
        panel2.removeEventListener("mousemove", handleMouseMove);
      }
      if (minnowContainer) {
        if (minnowContainer._ticker) {
          gsap.ticker.remove(minnowContainer._ticker);
        }
        minnowContainer.innerHTML = "";
      }
      
      // Clean up Panel 3 angler
      if (panel3 && handlePanel3MouseMove) {
        panel3.removeEventListener("mousemove", handlePanel3MouseMove);
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.horizontalWrapper} id="story-scroll">
      <div ref={containerRef} className={styles.scrollContainer}>
        {/* Panel 1: Salmon Ethos */}
        <section className={`${styles.panel} ${styles.panel1}`}>
          {/* Salmon swimming upstream */}
          <div className={styles.salmonStream}>
            <div className={`${styles.salmon} ${styles.salmon1}`}>
              <svg viewBox="0 0 100 45" width="100%" height="100%">
                <path d="M10,22 C22,12 50,8 70,18 C78,14 86,10 92,16 C88,22 88,22 92,28 C86,34 78,30 70,26 C50,36 22,32 10,22 Z" fill="var(--color-salmon)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <path className="salmon-tail" d="M8,22 L1,10 C0,15 0,29 1,34 Z" fill="var(--color-salmon)" />
                <circle cx="70" cy="18" r="1.5" fill="white" />
              </svg>
            </div>
            <div className={`${styles.salmon} ${styles.salmon2}`}>
              <svg viewBox="0 0 100 45" width="100%" height="100%">
                <path d="M10,22 C22,12 50,8 70,18 C78,14 86,10 92,16 C88,22 88,22 92,28 C86,34 78,30 70,26 C50,36 22,32 10,22 Z" fill="var(--color-salmon)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <path className="salmon-tail" d="M8,22 L1,10 C0,15 0,29 1,34 Z" fill="var(--color-salmon)" />
                <circle cx="70" cy="18" r="1.5" fill="white" />
              </svg>
            </div>
            <div className={`${styles.salmon} ${styles.salmon3}`}>
              <svg viewBox="0 0 100 45" width="100%" height="100%">
                <path d="M10,22 C22,12 50,8 70,18 C78,14 86,10 92,16 C88,22 88,22 92,28 C86,34 78,30 70,26 C50,36 22,32 10,22 Z" fill="var(--color-salmon)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <path className="salmon-tail" d="M8,22 L1,10 C0,15 0,29 1,34 Z" fill="var(--color-salmon)" />
                <circle cx="70" cy="18" r="1.5" fill="white" />
              </svg>
            </div>
          </div>
          <div className={styles.panelContent}>
            <div className={styles.panelLeft}>
              <span className={styles.panelNumber}>01</span>
              <span className={styles.panelTagline}>Survival & Resilience</span>
              <h2 className={styles.panelTitle}>The Salmon Ethos</h2>
            </div>
            <div className={`${styles.panelRight} glass-card`}>
              <p className={styles.panelDesc}>
                Endurance isn&apos;t just surviving the water; it&apos;s swimming upstream.
                Like a salmon navigating the strongest river currents, we push against the ordinary,
                defying industry constraints to shape unforgettable frontend experiences.
              </p>
              <div className={styles.statGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statVal}>100%</span>
                  <span className={styles.statLabel}>Dedication</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statVal}>Upstream</span>
                  <span className={styles.statLabel}>Trajectory</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Panel 2: The Ripple Effect */}
        <section className={`${styles.panel} ${styles.panel2}`}>
          {/* Minnow school container */}
          <div className={styles.minnowSchool} id="minnow-school-container"></div>
          <div className={styles.panelContent}>
            <div className={styles.panelLeft}>
              <span className={styles.panelNumber}>02</span>
              <span className={styles.panelTagline}>Fluid Micro-interactions</span>
              <h2 className={styles.panelTitle}>The Ripple Effect</h2>
            </div>
            <div className={`${styles.panelRight} glass-card`}>
              <p className={styles.panelDesc}>
                Every hover, click, and scroll coordinates a splash. We design interfaces
                that feel alive and responsive, transforming static web components into fluid assets
                that ripple dynamically with every touch.
              </p>
              <div className={styles.statGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statVal}>60 FPS</span>
                  <span className={styles.statLabel}>Animation Easing</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statVal}>Fluid</span>
                  <span className={styles.statLabel}>Responsiveness</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Panel 3: The Creative Deep */}
        <section className={`${styles.panel} ${styles.panel3}`}>
          {/* Deep sea bioluminescent creatures */}
          <div className={styles.deepAbyss}>
            <div className={`${styles.jellyfish} ${styles.jelly1}`}>
              <svg viewBox="0 0 60 120" width="100%" height="100%">
                <path d="M5,40 C5,10 55,10 55,40 C55,48 45,45 30,45 C15,45 5,48 5,40 Z" fill="rgba(190, 90, 65, 0.35)" stroke="var(--color-glow-blue)" strokeWidth="1" />
                <path d="M15,45 Q10,70 15,95 Q20,110 15,120" fill="none" stroke="rgba(190, 90, 65, 0.55)" strokeWidth="1.2" />
                <path d="M30,45 Q35,75 25,100 Q30,115 30,125" fill="none" stroke="rgba(190, 90, 65, 0.55)" strokeWidth="1.2" />
                <path d="M45,45 Q50,70 42,95 Q48,110 45,120" fill="none" stroke="rgba(190, 90, 65, 0.55)" strokeWidth="1.2" />
              </svg>
            </div>
            <div className={`${styles.jellyfish} ${styles.jelly2}`}>
              <svg viewBox="0 0 60 120" width="100%" height="100%">
                <path d="M5,40 C5,10 55,10 55,40 C55,48 45,45 30,45 C15,45 5,48 5,40 Z" fill="rgba(160, 220, 245, 0.25)" stroke="var(--color-neon-yellow)" strokeWidth="1" />
                <path d="M18,45 Q22,75 18,105 Q12,115 18,125" fill="none" stroke="rgba(160, 220, 245, 0.45)" strokeWidth="1" />
                <path d="M32,45 Q28,70 34,95 Q38,110 32,120" fill="none" stroke="rgba(160, 220, 245, 0.45)" strokeWidth="1" />
              </svg>
            </div>
            <div className={styles.anglerFish} id="angler-fish-element">
              <svg viewBox="0 0 100 80" width="100%" height="100%">
                <path d="M10,40 C15,20 45,10 70,30 C80,25 90,28 95,35 C88,40 88,42 95,48 C85,55 75,50 65,45 C45,55 15,50 10,40 Z" fill="var(--color-marine)" stroke="var(--color-glow-blue)" strokeWidth="1.5" />
                <path d="M68,34 L72,39 L76,34 L80,39 L84,33" fill="none" stroke="white" strokeWidth="1.2" />
                <path className="angler-antenna" d="M40,18 Q45,2 75,5" fill="none" stroke="var(--color-glow-blue)" strokeWidth="1.5" />
                <circle className="angler-lure" cx="75" cy="5" r="4.5" fill="var(--color-neon-yellow)" />
                <circle cx="55" cy="24" r="1.5" fill="red" />
              </svg>
            </div>
          </div>
          <div className={styles.panelContent}>
            <div className={styles.panelLeft}>
              <span className={styles.panelNumber}>03</span>
              <span className={styles.panelTagline}>Uncharted Territory</span>
              <h2 className={styles.panelTitle}>The Creative Deep</h2>
            </div>
            <div className={`${styles.panelRight} glass-card`}>
              <p className={styles.panelDesc}>
                Beneath the surface lies true creative freedom. We explore new depths
                in technology, combining GSAP ScrollTrigger performance, Next.js routing structures,
                and stateful APIs to create jaw-dropping web applications.
              </p>
              <div className={styles.statGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statVal}>Infinite</span>
                  <span className={styles.statLabel}>Possibilities</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statVal}>Next-Gen</span>
                  <span className={styles.statLabel}>Frontend</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
