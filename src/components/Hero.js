// src/components/Hero.js
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Hero.module.css";

export default function Hero() {
  const heroRef = useRef(null);
  const glowRef = useRef(null);
  const titleRef = useRef(null);
  const tagRef = useRef(null);
  const descRef = useRef(null);
  const fishRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  // Mouse-following glow spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      const glow = glowRef.current;
      if (!glow) return;
      
      const bounds = heroRef.current.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      gsap.to(glow, {
        x: x,
        y: y,
        duration: 0.8,
        ease: "power2.out"
      });
    };

    const container = heroRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Text Entrance Animations
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const tl = gsap.timeline({ delay: 0.6 });

    // Staggered reveal of tagline, title words, description and scroll indicator
    tl.fromTo(tagRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" })
      .fromTo(
        title.querySelectorAll("span"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, stagger: 0.1, ease: "back.out(1.5)" },
        "-=0.4"
      )
      .fromTo(descRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5")
      .fromTo(scrollIndicatorRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3");

  }, []);

  // Swimming Fish, Dynamic School & Click Feeding Emitter
  useEffect(() => {
    const leaderContainer = fishRef.current;
    if (!leaderContainer) return;

    const wrapper = heroRef.current;
    const fishWidth = 120;
    let time = 0;

    // --- Dynamic Parent/Leader Fish Spawning (4 massive parents) ---
    const numParents = 4;
    const parentElements = [];
    const parentColors = [
      "var(--color-turquoise)", // Cyan/Turquoise parent
      "var(--color-goldfish)",  // Golden Orange parent
      "var(--color-coral)",     // Coral/Red parent
      "var(--color-seafoam)"    // Seafoam Green parent
    ];
    const parentFills = [
      "rgba(174, 230, 220, 0.45)",
      "rgba(255, 220, 180, 0.45)",
      "rgba(255, 180, 180, 0.45)",
      "rgba(180, 245, 220, 0.45)"
    ];

    for (let i = 0; i < numParents; i++) {
      const pf = document.createElement("div");
      pf.className = styles.fishContainer;
      
      const pX = 100 + Math.random() * (window.innerWidth - 300);
      const pY = 150 + Math.random() * (window.innerHeight - 300);
      const dir = Math.random() > 0.5 ? 1 : -1;
      const sp = 2.0 + Math.random() * 1.5;
      
      const strokeColor = parentColors[i % parentColors.length];
      const fillColor = parentFills[i % parentFills.length];
      
      pf.innerHTML = `
        <svg viewBox="0 0 120 60" width="100%" height="100%">
          <!-- Fish Silhouette -->
          <path
            d="M20,30 C35,15 65,10 85,25 C95,20 105,15 110,22 C105,30 105,30 110,38 C105,45 95,40 85,35 C65,50 35,45 20,30 Z"
            fill="rgba(255, 255, 255, 0.45)"
            stroke="${strokeColor}"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <!-- Tail Fin -->
          <path
            class="parent-tail"
            d="M18,30 L3,12 C0,20 0,40 3,48 Z"
            fill="${fillColor}"
            stroke="${strokeColor}"
            strokeWidth="2"
          />
          <!-- Pectoral Fin -->
          <path
            class="parent-pec"
            d="M60,36 C55,42 45,46 45,46 C45,46 50,38 55,34"
            fill="none"
            stroke="${strokeColor}"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <!-- Fish Eye -->
          <circle cx="85" cy="24" r="2.5" fill="var(--color-marine)" />
          <!-- Gills Line -->
          <path d="M76,22 C73,26 73,32 76,36" fill="none" stroke="${strokeColor}" strokeWidth="1.8" />
        </svg>
      `;
      
      leaderContainer.appendChild(pf);
      
      parentElements.push({
        element: pf,
        tail: pf.querySelector(".parent-tail"),
        pec: pf.querySelector(".parent-pec"),
        x: pX,
        y: pY,
        direction: dir,
        speed: sp,
        timeOffset: Math.random() * 100
      });
    }

    // --- Dynamic School of Fish Setup ---
    const numSchool = 64; // Spawns an abundant, vibrant school of 64 baby fish!
    const schoolElements = [];

    for (let i = 0; i < numSchool; i++) {
      const sf = document.createElement("div");
      sf.className = styles.schoolFishContainer;
      
      // Smaller cute baby sizes
      const size = 15 + Math.random() * 14;
      sf.style.width = `${size}px`;
      sf.style.height = `${size / 2}px`;
      
      // Match baby color to its dynamically assigned parent color!
      const parentIndex = i % numParents;
      const color = parentColors[parentIndex];
      
      sf.innerHTML = `
        <svg viewBox="0 0 80 40" width="100%" height="100%">
          <path d="M12,20 C22,10 42,6 55,16 C62,13 68,10 72,15 C68,20 68,20 72,25 C68,30 62,27 55,24 C42,34 22,30 12,20 Z" fill="${color}" opacity="1.0" />
          <path class="school-tail" d="M11,20 L2,8 C0,13 0,27 2,32 Z" fill="${color}" opacity="0.85" />
          <circle cx="55" cy="16" r="1.5" fill="var(--color-marine)" />
        </svg>
      `;
      
      leaderContainer.appendChild(sf);
      
      const parent = parentElements[parentIndex];
      
      schoolElements.push({
        element: sf,
        tail: sf.querySelector(".school-tail"),
        x: parent.x - 20 - Math.random() * 80,
        y: parent.y + (Math.random() * 60 - 30),
        size: size,
        delayFactor: 0.06 + Math.random() * 0.05,
        offsetY: (Math.random() * 90 - 45), // cluster tightly vertically
        offsetX: -40 - Math.random() * 100 // cluster tightly behind parent
      });
    }

    // --- Interactive Feeding Mechanism ---
    let activeFoods = [];

    const handleWrapperClick = (e) => {
      // Exclude interactive items
      if (e.target.closest("button, a, span")) return;

      const rect = wrapper.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // If active food limit of 5 is reached, spawn ONLY bubbles
      if (activeFoods.length >= 5) {
        const bubbleCount = 6 + Math.floor(Math.random() * 4);
        for (let i = 0; i < bubbleCount; i++) {
          const bubble = document.createElement("div");
          bubble.className = styles.bubbleParticle;
          
          const size = 5 + Math.random() * 9;
          const bX = clickX + (Math.random() * 20 - 10);
          const bY = clickY + (Math.random() * 20 - 10);

          bubble.style.left = `${bX}px`;
          bubble.style.top = `${bY}px`;
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          leaderContainer.appendChild(bubble);

          gsap.to(bubble, {
            y: -120 - Math.random() * 150,
            x: `+=${Math.random() * 60 - 30}`,
            opacity: 0,
            scale: 1.6,
            duration: 1.5 + Math.random() * 1.5,
            ease: "power1.out",
            onComplete: () => {
              if (leaderContainer.contains(bubble)) {
                leaderContainer.removeChild(bubble);
              }
            }
          });
        }
        return;
      }

      // Create new food particle
      const food = document.createElement("div");
      food.className = styles.foodParticle;
      food.style.left = `${clickX}px`;
      food.style.top = `${clickY}px`;
      leaderContainer.appendChild(food);

      const foodObj = {
        element: food,
        currentX: clickX,
        currentY: clickY,
        active: true
      };
      activeFoods.push(foodObj);

      // Ripple expand and sink animation (sinks slower and deeper for 11.0 seconds)
      gsap.fromTo(food,
        { scale: 0.3, opacity: 1, y: 0 },
        { 
          scale: 1.1, 
          y: 250, // sink down deeper
          duration: 11.0, 
          ease: "power1.out",
          onUpdate: () => {
            if (foodObj.active) {
              const yOffset = gsap.getProperty(food, "y") || 0;
              foodObj.currentY = clickY + yOffset;
            }
          }
        }
      );
      
      // Delay before fading out (11.5 seconds from click, ensuring it stays visible for >10s)
      gsap.to(food, {
        opacity: 0,
        delay: 11.5,
        duration: 2.0,
        onComplete: () => {
          foodObj.active = false;
          if (leaderContainer.contains(food)) {
            leaderContainer.removeChild(food);
          }
          activeFoods = activeFoods.filter(f => f !== foodObj);
        }
      });
    };

    wrapper.addEventListener("mousedown", handleWrapperClick);

    // --- Sway Kelp Forest ---
    const kelps = wrapper.querySelectorAll(`.${styles.kelp}`);
    if (kelps.length > 0) {
      gsap.to(kelps, {
        skewX: 10,
        rotate: 3,
        transformOrigin: "bottom center",
        repeat: -1,
        yoyo: true,
        duration: 4 + Math.random() * 2,
        ease: "sine.inOut",
        stagger: {
          each: 0.5,
          from: "random"
        }
      });
    }

    // Unified swim animation ticker loop
    const animateSwim = () => {
      time += 0.05;
      const wWidth = window.innerWidth;

      // 1. Update Parent/Leader Fish positions & animations
      parentElements.forEach((parent) => {
        parent.timeOffset += 0.05;
        
        // Sway tail & pectoral fins dynamically
        if (parent.tail) {
          const wiggle = Math.sin(parent.timeOffset * 6) * 15;
          gsap.set(parent.tail, { rotate: wiggle, transformOrigin: "left center" });
        }
        if (parent.pec) {
          const pecWiggle = Math.sin(parent.timeOffset * 3) * 10;
          gsap.set(parent.pec, { rotate: pecWiggle, transformOrigin: "top right" });
        }

        // Find nearest food for this parent
        let nearestFood = null;
        let minDist = Infinity;
        activeFoods.forEach(food => {
          if (!food.active) return;
          const dx = food.currentX - parent.x;
          const dy = food.currentY - parent.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) {
            minDist = dist;
            nearestFood = food;
          }
        });

        if (nearestFood) {
          // Swim towards food
          const dx = nearestFood.currentX - parent.x;
          const dy = nearestFood.currentY - parent.y;
          
          // Face food direction
          const toFoodDir = dx > 0 ? 1 : -1;
          if (toFoodDir !== parent.direction) {
            parent.direction = toFoodDir;
            gsap.to(parent.element, { scaleX: parent.direction, duration: 0.4 });
          }

          // Swim with accelerated attraction speed
          const activeSpeed = Math.min(8.5, parent.speed * 2.8);
          parent.x += (dx / minDist) * activeSpeed;
          parent.y += (dy / minDist) * activeSpeed;

          // Tail wiggles frantically when going for food
          if (parent.tail) {
            gsap.set(parent.tail, { rotate: Math.sin(parent.timeOffset * 15) * 25, transformOrigin: "left center" });
          }

          // Eat food if very close
          if (minDist < 45) {
            nearestFood.active = false;
            const eatenFood = nearestFood;
            gsap.to(eatenFood.element, {
              scale: 0,
              opacity: 0,
              duration: 0.2,
              onComplete: () => {
                if (wrapper.contains(eatenFood.element)) {
                  wrapper.removeChild(eatenFood.element);
                }
              }
            });
            activeFoods = activeFoods.filter(f => f !== eatenFood);
          }
        } else {
          // Normal horizontal movement of parent
          parent.x += parent.speed * parent.direction;
          parent.y += Math.sin(parent.timeOffset * 0.8) * 0.8;

          // Flip at edge boundaries
          if (parent.direction === 1 && parent.x >= wWidth - 140) {
            parent.direction = -1;
            parent.speed = 1.8 + Math.random() * 1.5;
            gsap.to(parent.element, { scaleX: -1, duration: 0.4 });
          } else if (parent.direction === -1 && parent.x <= 20) {
            parent.direction = 1;
            parent.speed = 1.8 + Math.random() * 1.5;
            gsap.to(parent.element, { scaleX: 1, duration: 0.4 });
          }
        }

        // Clamp
        parent.x = Math.max(10, Math.min(wWidth - 130, parent.x));
        parent.y = Math.max(100, Math.min(window.innerHeight - 100, parent.y));

        gsap.set(parent.element, { x: parent.x, y: parent.y });

        // Spawn bubbles behind each parent tail
        if (Math.random() < 0.04) {
          const bubble = document.createElement("div");
          bubble.className = styles.bubbleParticle;
          
          const tailOffset = parent.direction === 1 ? -60 : 60;
          const bX = parent.x + 60 + tailOffset;
          const bY = parent.y + 30 + (Math.random() * 10 - 5);
          const size = 3 + Math.random() * 8;

          bubble.style.left = `${bX}px`;
          bubble.style.top = `${bY}px`;
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          leaderContainer.appendChild(bubble);

          gsap.to(bubble, {
            y: -100 - Math.random() * 150,
            x: `+=${Math.random() * 40 - 20}`,
            opacity: 0,
            scale: 1.5,
            duration: 2 + Math.random() * 2,
            ease: "power1.out",
            onComplete: () => {
              if (leaderContainer.contains(bubble)) {
                leaderContainer.removeChild(bubble);
              }
            }
          });
        }
      });

      // 2. Update School Minnow Positions
      schoolElements.forEach((sf, idx) => {
        let targetX = 0;
        let targetY = 0;
        let swimEase = sf.delayFactor;
        
        // Find nearest food for this school minnow
        let nearestFood = null;
        let minDist = Infinity;
        activeFoods.forEach(food => {
          if (!food.active) return;
          const dx = food.currentX - sf.x;
          const dy = food.currentY - sf.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) {
            minDist = dist;
            nearestFood = food;
          }
        });

        if (nearestFood) {
          targetX = nearestFood.currentX + (idx % 2 === 0 ? 20 : -20) + Math.sin(time + idx) * 12;
          targetY = Math.min(window.innerHeight - 100, nearestFood.currentY + (idx % 2 === 0 ? 15 : -15) + Math.cos(time + idx) * 12);
          swimEase = 0.12; 
          
          if (sf.tail) {
            gsap.set(sf.tail, { 
              rotate: Math.sin(time * 10 + idx) * 28, 
              transformOrigin: "left center" 
            });
          }

          const toFoodDir = targetX > sf.x ? 1 : -1;
          gsap.set(sf.element, { scaleX: toFoodDir });

          if (minDist < 30) {
            nearestFood.active = false;
            const eatenFood = nearestFood;
            gsap.to(eatenFood.element, {
              scale: 0,
              opacity: 0,
              duration: 0.2,
              onComplete: () => {
                if (leaderContainer.contains(eatenFood.element)) {
                  leaderContainer.removeChild(eatenFood.element);
                }
              }
            });
            activeFoods = activeFoods.filter(f => f !== eatenFood);
          }
        } else {
          // Follow dynamically assigned parent (index % 4)
          const assignedParent = parentElements[idx % numParents];
          const followDirection = assignedParent.direction;
          const behindOffset = followDirection === 1 ? sf.offsetX : -sf.offsetX;
          targetX = assignedParent.x + behindOffset + Math.sin(time * 0.8 + idx) * 15;
          targetY = assignedParent.y + sf.offsetY + Math.cos(time * 0.8 + idx) * 10;
          
          const currentScale = followDirection === 1 ? 1 : -1;
          gsap.set(sf.element, { scaleX: currentScale });
          
          if (sf.tail) {
            gsap.set(sf.tail, { 
              rotate: Math.sin(time * 3 + idx) * 12, 
              transformOrigin: "left center" 
            });
          }
        }
        
        sf.x += (targetX - sf.x) * swimEase;
        sf.y += (targetY - sf.y) * swimEase;
        
        sf.x = Math.max(5, Math.min(wWidth - sf.size - 5, sf.x));
        sf.y = Math.max(50, Math.min(window.innerHeight - 50, sf.y));

        gsap.set(sf.element, { x: sf.x, y: sf.y });
      });
    };

    gsap.ticker.add(animateSwim);

    return () => {
      gsap.ticker.remove(animateSwim);
      wrapper.removeEventListener("mousedown", handleWrapperClick);
      
      // Clean up dynamic parents safely
      parentElements.forEach(parent => {
        if (leaderContainer && leaderContainer.contains(parent.element)) {
          leaderContainer.removeChild(parent.element);
        }
      });
      
      // Clean up school elements
      schoolElements.forEach(sf => {
        if (leaderContainer.contains(sf.element)) {
          leaderContainer.removeChild(sf.element);
        }
      });
      // Clean up all active foods
      activeFoods.forEach(food => {
        if (leaderContainer.contains(food.element)) {
          leaderContainer.removeChild(food.element);
        }
      });
    };
  }, []);

  const handleScrollClick = () => {
    // Scroll smoothly to the next section
    const nextSection = document.querySelector("#fierce-gallery");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={heroRef} className={styles.heroWrapper} id="hero">
      {/* Sunlight/God Rays effect */}
      <div className={styles.lightRays}></div>

      {/* Follow spot glow */}
      <div ref={glowRef} className={styles.glowTracker}></div>

      {/* Sandy ocean floor lighting */}
      <div className={styles.seaFloor}></div>

      {/* Swaying Kelp Forest Background */}
      <div className={styles.kelpForest}>
        <div className={`${styles.kelp} ${styles.kelp1}`}>
          <svg viewBox="0 0 40 200" preserveAspectRatio="none" width="100%" height="100%">
            <path d="M20,200 Q10,150 20,100 T20,0 Q30,100 20,150 Z" fill="rgba(174, 230, 220, 0.08)" />
          </svg>
        </div>
        <div className={`${styles.kelp} ${styles.kelp2}`}>
          <svg viewBox="0 0 40 240" preserveAspectRatio="none" width="100%" height="100%">
            <path d="M20,240 Q30,180 20,120 T20,0 Q10,120 20,180 Z" fill="rgba(174, 230, 220, 0.12)" />
          </svg>
        </div>
        <div className={`${styles.kelp} ${styles.kelp3}`}>
          <svg viewBox="0 0 40 220" preserveAspectRatio="none" width="100%" height="100%">
            <path d="M20,220 Q10,165 20,110 T20,0 Q30,110 20,165 Z" fill="rgba(160, 220, 245, 0.1)" />
          </svg>
        </div>
        <div className={`${styles.kelp} ${styles.kelp4}`}>
          <svg viewBox="0 0 40 260" preserveAspectRatio="none" width="100%" height="100%">
            <path d="M20,260 Q30,195 20,130 T20,0 Q10,130 20,195 Z" fill="rgba(160, 220, 245, 0.07)" />
          </svg>
        </div>
      </div>

      {/* Container for Dynamic Spawning of 4 Parent/Leader Fishes */}
      <div ref={fishRef} className={styles.leaderFishContainer} id="leader-fish-container"></div>

      <div className={styles.heroContent}>
        <p ref={tagRef} className={styles.serifTagline}>
          Aliran Harmoni di Bawah Riak Samudera
        </p>
        
        <h1 ref={titleRef} className={styles.heroTitle}>
          <div style={{ display: "block" }}>
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>Crystal&nbsp;</span>
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>Lagoon.</span>
          </div>
          <div style={{ display: "block" }}>
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>Silent&nbsp;</span>
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>Life.</span>
          </div>
        </h1>

        <p ref={descRef} className={styles.heroDescription}>
          Menyelami kedalaman laguna samudera yang jernih, tempat kawanan ikan berenang bebas mengikuti arus alami yang tenang. 
          Seperti kehidupan laut yang terus mengalir tanpa henti, keindahan terumbu karang dan riak air di bawah sinar matahari pagi 
          mengajarkan kita tentang harmoni, ketenangan, dan ketangguhan sejati dalam mengarungi luasnya samudera kehidupan.
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className={styles.scrollIndicator}
        onClick={handleScrollClick}
      >
        <span>SCROLL DOWN</span>
        <div className={styles.waterDrop}>
          <div className={styles.dropInner}></div>
        </div>
      </div>
    </section>
  );
}
