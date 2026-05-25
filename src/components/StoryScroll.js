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

    // --- Panel 1: Dynamic Salmon Stream Spawning ---
    const salmonStream = wrapper.querySelector("#salmon-stream-container");
    const salmonTweens = [];
    if (salmonStream) {
      const numSalmon = 12; // A lively school of 12 salmon
      for (let i = 0; i < numSalmon; i++) {
        const salmon = document.createElement("div");
        salmon.className = styles.salmon;
        salmon.classList.add("dynamic-salmon-spawn");
        
        // Depth mapping: smaller scale = further away = moves slower = lower opacity
        const depth = 0.45 + Math.random() * 0.55; 
        const topPercent = 15 + Math.random() * 65; 
        const opacity = 0.35 + depth * 0.45; 
        
        salmon.style.top = `${topPercent}%`;
        salmon.style.opacity = opacity;
        salmon.style.transform = `scale(${depth})`;
        salmon.style.width = `${90 * depth}px`;
        salmon.style.height = `${40 * depth}px`;
        
        salmon.innerHTML = `
          <svg viewBox="0 0 100 45" width="100%" height="100%">
            <path d="M10,22 C22,12 50,8 70,18 C78,14 86,10 92,16 C88,22 88,22 92,28 C86,34 78,30 70,26 C50,36 22,32 10,22 Z" fill="var(--color-salmon)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <path class="salmon-tail" d="M8,22 L1,10 C0,15 0,29 1,34 Z" fill="var(--color-salmon)" />
            <circle cx="70" cy="18" r="1.5" fill="white" />
          </svg>
        `;
        
        salmonStream.appendChild(salmon);
        
        const startX = window.innerWidth + 150 + Math.random() * 400;
        const endX = -300;
        const duration = (10 + Math.random() * 7) / depth; 
        
        const t = gsap.fromTo(salmon,
          { x: startX },
          {
            x: endX,
            duration: duration,
            repeat: -1,
            ease: "none",
            delay: Math.random() * 8,
          }
        );
        salmonTweens.push(t);
        
        const tail = salmon.querySelector(".salmon-tail");
        if (tail) {
          gsap.to(tail, {
            rotate: 20,
            transformOrigin: "right center",
            repeat: -1,
            yoyo: true,
            duration: 0.15 + Math.random() * 0.1,
            ease: "sine.inOut"
          });
        }
      }
    }

    // --- Panel 2: Interactive Minnows Flocking ---
    const minnowContainer = wrapper.querySelector("#minnow-school-container");
    const minnows = [];
    const panel2 = wrapper.querySelector(`.${styles.panel2}`);
    let handleMouseMove = null;

    if (minnowContainer && panel2) {
      const numMinnows = 45; // Enhanced to 45 minnows!
      for (let i = 0; i < numMinnows; i++) {
        const m = document.createElement("div");
        m.className = styles.minnow;
        m.classList.add("dynamic-minnow-spawn");
        
        // Multi-color neon reef school
        const colors = ["var(--color-glow-blue)", "var(--color-goldfish)", "var(--color-seafoam)"];
        const fishColor = colors[i % colors.length];
        
        m.innerHTML = `
          <svg viewBox="0 0 40 20" width="100%" height="100%">
            <path d="M5,10 C10,5 25,4 32,8 C35,6 38,4 40,7 C38,10 38,10 40,13 C38,15 35,13 32,12 C25,16 10,15 5,10 Z" fill="${fishColor}" opacity="0.85" />
          </svg>
        `;
        minnowContainer.appendChild(m);
        
        const initX = 150 + Math.random() * (window.innerWidth - 300);
        const initY = 100 + Math.random() * (window.innerHeight - 200);
        gsap.set(m, { x: initX, y: initY });
        
        minnows.push({
          element: m,
          x: initX,
          y: initY,
          baseX: initX,
          baseY: initY,
          targetX: initX,
          targetY: initY,
          speed: 0.04 + Math.random() * 0.04
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

          if (dist < 140) {
            const angle = Math.atan2(dy, dx);
            const force = (140 - dist) * 0.7;
            
            minnow.targetX += Math.cos(angle) * force;
            minnow.targetY += Math.sin(angle) * force;

            minnow.targetX = Math.max(80, Math.min(rect.width - 80, minnow.targetX));
            minnow.targetY = Math.max(60, Math.min(rect.height - 60, minnow.targetY));
          } else {
            minnow.targetX += (minnow.baseX - minnow.targetX) * 0.02;
            minnow.targetY += (minnow.baseY - minnow.targetY) * 0.02;
          }
        });
      };

      panel2.addEventListener("mousemove", handleMouseMove);

      const updateMinnows = () => {
        minnows.forEach((minnow, idx) => {
          minnow.baseX += Math.sin(Date.now() * 0.001 + idx) * 0.35;
          minnow.baseY += Math.cos(Date.now() * 0.001 + idx) * 0.35;

          minnow.x += (minnow.targetX - minnow.x) * minnow.speed;
          minnow.y += (minnow.targetY - minnow.y) * minnow.speed;

          const deltaX = minnow.targetX - minnow.x;
          const currentScale = deltaX > 0.5 ? 1 : (deltaX < -0.5 ? -1 : 1);

          gsap.set(minnow.element, { x: minnow.x, y: minnow.y, scaleX: currentScale });
        });
      };
      gsap.ticker.add(updateMinnows);
      minnowContainer._ticker = updateMinnows;
    }

    // --- Panel 3: Dynamic Bioluminescent Deep Sea Spawning ---
    const abyssContainer = wrapper.querySelector("#deep-abyss-container");
    const abyssTweens = [];

    if (abyssContainer) {
      // Spawn 6 floating jellyfish
      const numJellies = 6;
      for (let i = 0; i < numJellies; i++) {
        const jelly = document.createElement("div");
        jelly.className = styles.jellyfish;
        jelly.classList.add("dynamic-abyss-spawn");
        
        const scale = 0.5 + Math.random() * 0.6; 
        const leftPercent = 10 + Math.random() * 55; 
        const startY = 80 + Math.random() * 100;
        const endY = 220 + Math.random() * 100;
        const speed = 5 + Math.random() * 4;
        const opacity = 0.35 + scale * 0.45;
        
        jelly.style.left = `${leftPercent}%`;
        jelly.style.opacity = opacity;
        jelly.style.transform = `scale(${scale})`;
        jelly.style.width = `${60 * scale}px`;
        jelly.style.height = `${120 * scale}px`;
        
        const fillJelly = i % 2 === 0 ? "rgba(190, 90, 65, 0.35)" : "rgba(160, 220, 245, 0.25)";
        const strokeJelly = i % 2 === 0 ? "var(--color-glow-blue)" : "var(--color-neon-yellow)";
        const tentacleColor = i % 2 === 0 ? "rgba(190, 90, 65, 0.55)" : "rgba(160, 220, 245, 0.45)";
        
        jelly.innerHTML = `
          <svg viewBox="0 0 60 120" width="100%" height="100%">
            <path d="M5,40 C5,10 55,10 55,40 C55,48 45,45 30,45 C15,45 5,48 5,40 Z" fill="${fillJelly}" stroke="${strokeJelly}" strokeWidth="1" />
            <path d="M15,45 Q10,70 15,95 Q20,110 15,120" fill="none" stroke="${tentacleColor}" strokeWidth="1.2" />
            <path d="M30,45 Q35,75 25,100 Q30,115 30,125" fill="none" stroke="${tentacleColor}" strokeWidth="1.2" />
            <path d="M45,45 Q50,70 42,95 Q48,110 45,120" fill="none" stroke="${tentacleColor}" strokeWidth="1.2" />
          </svg>
        `;
        abyssContainer.appendChild(jelly);
        
        const t1 = gsap.fromTo(jelly,
          { y: startY },
          {
            y: endY,
            duration: speed,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 2
          }
        );
        abyssTweens.push(t1);
        
        const head = jelly.querySelector("path");
        if (head) {
          const t2 = gsap.fromTo(head,
            { scaleY: 1 },
            {
              scaleY: 0.8,
              transformOrigin: "top center",
              duration: speed / 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            }
          );
          abyssTweens.push(t2);
        }
      }

      // Spawn 18 bioluminescent deep sea minnows
      const numDeepMinnows = 18;
      for (let i = 0; i < numDeepMinnows; i++) {
        const m = document.createElement("div");
        m.className = styles.minnow;
        m.classList.add("dynamic-abyss-spawn");
        m.style.filter = "drop-shadow(0 0 8px var(--color-neon-yellow))";
        m.style.opacity = 0.55;
        
        m.innerHTML = `
          <svg viewBox="0 0 40 20" width="100%" height="100%">
            <path d="M5,10 C10,5 25,4 32,8 C35,6 38,4 40,7 C38,10 38,10 40,13 C38,15 35,13 32,12 C25,16 10,15 5,10 Z" fill="var(--color-neon-yellow)" opacity="0.8" />
          </svg>
        `;
        abyssContainer.appendChild(m);
        
        const startX = 200 + Math.random() * 450;
        const startY = 100 + Math.random() * (window.innerHeight - 200);
        gsap.set(m, { x: startX, y: startY });
        
        const duration = 6 + Math.random() * 5;
        const t3 = gsap.to(m, {
          x: `+=${100 - Math.random() * 200}`,
          y: `+=${80 - Math.random() * 160}`,
          duration: duration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 3
        });
        abyssTweens.push(t3);
      }
    }

    const angler = wrapper.querySelector("#angler-fish-element");
    const panel3 = wrapper.querySelector(`.${styles.panel3}`);
    let handlePanel3MouseMove = null;

    if (angler && panel3) {
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
      
      // Clean up Panel 1 salmons safely
      const salmonStream = wrapper.querySelector("#salmon-stream-container");
      if (salmonStream) {
        const spawned = salmonStream.querySelectorAll(".dynamic-salmon-spawn");
        spawned.forEach(el => el.remove());
      }
      salmonTweens.forEach(t => t.kill());
      
      // Clean up Panel 2 minnows safely
      if (panel2 && handleMouseMove) {
        panel2.removeEventListener("mousemove", handleMouseMove);
      }
      if (minnowContainer) {
        if (minnowContainer._ticker) {
          gsap.ticker.remove(minnowContainer._ticker);
        }
        const spawned = minnowContainer.querySelectorAll(".dynamic-minnow-spawn");
        spawned.forEach(el => el.remove());
      }
      
      // Clean up Panel 3 deep abyss safely
      const abyssContainer = wrapper.querySelector("#deep-abyss-container");
      if (abyssContainer) {
        const spawned = abyssContainer.querySelectorAll(".dynamic-abyss-spawn");
        spawned.forEach(el => el.remove());
      }
      abyssTweens.forEach(t => t.kill());
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
          <div className={styles.salmonStream} id="salmon-stream-container"></div>
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
          <div className={styles.deepAbyss} id="deep-abyss-container">
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
              <span className={styles.panelTagline}>Sea of Voice // Voice of SEA</span>
              <h2 className={styles.panelTitle}>The Digital Youth Wave</h2>
            </div>
            <div className={`${styles.panelRight} glass-card`}>
              <p className={styles.panelDesc}>
                Gen Z and Millennials are crossing the digital sea. Through pixel-perfect, 
                fluid frontend craftsmanship, we build interactive environments that empower the true voices 
                of Southeast Asian youth, shaping highly engaging entertainment and creative agency platforms for millions.
              </p>
              <div className={styles.statGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statVal}>Millions</span>
                  <span className={styles.statLabel}>Youth Impact</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statVal}>#VoiceOfPeople</span>
                  <span className={styles.statLabel}>Editorial Motto</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
