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

    // Split title into two lines with word spans for staggered animation
    const lines = ["Crystal Lagoon.", "Silent Life."];
    title.innerHTML = "";
    
    lines.forEach((lineText) => {
      const lineDiv = document.createElement("div");
      lineDiv.style.display = "block";
      
      const words = lineText.split(" ");
      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.innerText = word + (index < words.length - 1 ? "\u00A0" : "");
        span.style.display = "inline-block";
        span.style.whiteSpace = "nowrap";
        lineDiv.appendChild(span);
      });
      
      title.appendChild(lineDiv);
    });

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
    const fish = fishRef.current;
    if (!fish) return;

    const wrapper = heroRef.current;
    const fishWidth = 120;
    
    // Initial coordinates for primary fish (guaranteed to start on screen)
    let fishX = 100 + Math.random() * (window.innerWidth - 300);
    let fishY = 200 + Math.random() * 200;
    let direction = 1; // 1 = right, -1 = left
    let speed = 2.5;
    let time = 0;

    gsap.set(fish, { x: fishX, y: fishY, scaleX: direction });

    // Sway tail fin animation
    const tailFin = fish.querySelector("#tail-fin");
    if (tailFin) {
      gsap.to(tailFin, {
        rotate: 15,
        transformOrigin: "left center",
        repeat: -1,
        yoyo: true,
        duration: 0.35,
        ease: "sine.inOut"
      });
    }

    // Sway pectoral fin animation
    const pecFin = fish.querySelector("#pec-fin");
    if (pecFin) {
      gsap.to(pecFin, {
        rotate: 12,
        transformOrigin: "top right",
        repeat: -1,
        yoyo: true,
        duration: 0.5,
        ease: "sine.inOut"
      });
    }

    // --- Dynamic School of Fish Setup ---
    const numSchool = 6;
    const schoolElements = [];
    const schoolColors = [
      "var(--color-goldfish)",
      "var(--color-coral)",
      "var(--color-glow-blue)",
      "var(--color-neon-yellow)",
      "var(--color-turquoise)",
      "var(--color-salmon)"
    ];

    for (let i = 0; i < numSchool; i++) {
      const sf = document.createElement("div");
      sf.className = styles.schoolFishContainer;
      
      const size = 30 + Math.random() * 18;
      sf.style.width = `${size}px`;
      sf.style.height = `${size / 2}px`;
      
      const color = schoolColors[i % schoolColors.length];
      
      sf.innerHTML = `
        <svg viewBox="0 0 80 40" width="100%" height="100%">
          <path d="M12,20 C22,10 42,6 55,16 C62,13 68,10 72,15 C68,20 68,20 72,25 C68,30 62,27 55,24 C42,34 22,30 12,20 Z" fill="${color}" opacity="0.85" />
          <path class="school-tail" d="M11,20 L2,8 C0,13 0,27 2,32 Z" fill="${color}" opacity="0.65" />
          <circle cx="55" cy="16" r="1.5" fill="var(--color-marine)" />
        </svg>
      `;
      
      wrapper.appendChild(sf);
      
      schoolElements.push({
        element: sf,
        tail: sf.querySelector(".school-tail"),
        x: fishX - 100 - (i * 35),
        y: fishY + (i % 2 === 0 ? 35 : -35),
        size: size,
        delayFactor: 0.04 + (i * 0.01),
        offsetY: (i % 2 === 0 ? 35 : -35) - (Math.random() * 15),
        offsetX: -65 - (i * 25)
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
          wrapper.appendChild(bubble);

          gsap.to(bubble, {
            y: -120 - Math.random() * 150,
            x: `+=${Math.random() * 60 - 30}`,
            opacity: 0,
            scale: 1.6,
            duration: 1.5 + Math.random() * 1.5,
            ease: "power1.out",
            onComplete: () => {
              if (wrapper.contains(bubble)) {
                wrapper.removeChild(bubble);
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
      wrapper.appendChild(food);

      const foodObj = {
        element: food,
        currentX: clickX,
        currentY: clickY,
        active: true
      };
      activeFoods.push(foodObj);

      // Ripple expand and sink animation (sinks for 4.5 seconds)
      gsap.fromTo(food,
        { scale: 0.3, opacity: 1, y: 0 },
        { 
          scale: 1.2, 
          y: 120, // sink down
          duration: 4.5, 
          ease: "power1.out",
          onUpdate: () => {
            if (foodObj.active) {
              const yOffset = gsap.getProperty(food, "y") || 0;
              foodObj.currentY = clickY + yOffset;
            }
          }
        }
      );
      
      // Delay before fading out (7.0 seconds from click)
      gsap.to(food, {
        opacity: 0,
        delay: 7.0,
        duration: 1.0,
        onComplete: () => {
          foodObj.active = false;
          if (wrapper.contains(food)) {
            wrapper.removeChild(food);
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

      // Find nearest food for leader fish
      let leaderNearestFood = null;
      let leaderMinDist = Infinity;
      activeFoods.forEach(food => {
        if (!food.active) return;
        const dx = food.currentX - fishX;
        const dy = food.currentY - fishY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < leaderMinDist) {
          leaderMinDist = dist;
          leaderNearestFood = food;
        }
      });

      if (leaderNearestFood) {
        // Swim towards the food
        const dx = leaderNearestFood.currentX - fishX;
        const dy = leaderNearestFood.currentY - fishY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Face the food direction
        const toFoodDir = dx > 0 ? 1 : -1;
        if (toFoodDir !== direction) {
          direction = toFoodDir;
          gsap.to(fish, { scaleX: direction, duration: 0.4 });
        }

        // Swim with attraction speed
        fishX += (dx / dist) * speed * 1.5;
        fishY += (dy / dist) * speed * 1.5;

        // Eat food if very close
        if (dist < 40) {
          const eatenFood = leaderNearestFood;
          eatenFood.active = false;
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
        // Normal horizontal motion of leader fish
        fishX += speed * direction;
        
        // Vertical organic wave (sine motion)
        fishY += Math.sin(time) * 0.8;

        // Wrap around or flip direction BEFORE leaving the screen
        if (direction === 1 && fishX >= wWidth - fishWidth - 20) {
          direction = -1;
          speed = 1.8 + Math.random() * 1.5;
          fishY = 150 + Math.random() * (window.innerHeight - 300);
          gsap.to(fish, { scaleX: -1, duration: 0.4 });
        } else if (direction === -1 && fishX <= 20) {
          direction = 1;
          speed = 1.8 + Math.random() * 1.5;
          fishY = 150 + Math.random() * (window.innerHeight - 300);
          gsap.to(fish, { scaleX: 1, duration: 0.4 });
        }
      }

      // Clamp coordinates so the leader never swims off-screen
      fishX = Math.max(10, Math.min(wWidth - fishWidth - 10, fishX));
      fishY = Math.max(100, Math.min(window.innerHeight - 100, fishY));

      gsap.set(fish, { x: fishX, y: fishY });

      // Update school fish positions
      schoolElements.forEach((sf, idx) => {
        let targetX = 0;
        let targetY = 0;
        let swimEase = sf.delayFactor;
        
        // Find nearest food for this school fish
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
          // Attracted to food coordinates with small individual offsets
          targetX = nearestFood.currentX + (idx % 2 === 0 ? 15 : -15) + Math.sin(time + idx) * 8;
          targetY = Math.min(window.innerHeight - 100, nearestFood.currentY + (idx % 2 === 0 ? 10 : -10) + Math.cos(time + idx) * 8);
          swimEase = 0.08; // swim faster to food
          
          // Tail wiggles rapidly during feeding
          if (sf.tail) {
            gsap.set(sf.tail, { 
              rotate: Math.sin(time * 8 + idx) * 22, 
              transformOrigin: "left center" 
            });
          }

          // Point fish towards food
          const toFoodDir = targetX > sf.x ? 1 : -1;
          gsap.set(sf.element, { scaleX: toFoodDir });

          // School fish eats food if very close
          if (minDist < 25) {
            const eatenFood = nearestFood;
            eatenFood.active = false;
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
          // Follow main fish with delay and spatial offset
          const followDirection = direction;
          const behindOffset = followDirection === 1 ? sf.offsetX : -sf.offsetX;
          targetX = fishX + behindOffset + Math.sin(time * 0.8 + idx) * 15;
          targetY = fishY + sf.offsetY + Math.cos(time * 0.8 + idx) * 10;
          
          // Match school fish face direction smoothly
          const currentScale = followDirection === 1 ? 1 : -1;
          gsap.set(sf.element, { scaleX: currentScale });
          
          // Normal ambient tail wiggling
          if (sf.tail) {
            gsap.set(sf.tail, { 
              rotate: Math.sin(time * 3 + idx) * 12, 
              transformOrigin: "left center" 
            });
          }
        }
        
        // Damped motion to target coordinates
        sf.x += (targetX - sf.x) * swimEase;
        sf.y += (targetY - sf.y) * swimEase;
        
        // Clamp school fish position inside the viewport
        sf.x = Math.max(5, Math.min(wWidth - sf.size - 5, sf.x));
        sf.y = Math.max(50, Math.min(window.innerHeight - 50, sf.y));

        gsap.set(sf.element, { x: sf.x, y: sf.y });
      });

      // Spawn bubbles behind the main fish tail coordinates
      if (Math.random() < 0.12) {
        const bubble = document.createElement("div");
        bubble.className = styles.bubbleParticle;
        
        const tailOffset = direction === 1 ? -60 : 60;
        const bX = fishX + 60 + tailOffset;
        const bY = fishY + 30 + (Math.random() * 10 - 5);
        const size = 3 + Math.random() * 8;

        bubble.style.left = `${bX}px`;
        bubble.style.top = `${bY}px`;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        wrapper.appendChild(bubble);

        gsap.to(bubble, {
          y: -100 - Math.random() * 150,
          x: `+=${Math.random() * 40 - 20}`,
          opacity: 0,
          scale: 1.5,
          duration: 2 + Math.random() * 2,
          ease: "power1.out",
          onComplete: () => {
            if (wrapper.contains(bubble)) {
              wrapper.removeChild(bubble);
            }
          }
        });
      }
    };

    gsap.ticker.add(animateSwim);

    return () => {
      gsap.ticker.remove(animateSwim);
      wrapper.removeEventListener("mousedown", handleWrapperClick);
      // Clean up school elements
      schoolElements.forEach(sf => {
        if (wrapper.contains(sf.element)) {
          wrapper.removeChild(sf.element);
        }
      });
      // Clean up all active foods
      activeFoods.forEach(food => {
        if (wrapper.contains(food.element)) {
          wrapper.removeChild(food.element);
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

      {/* Elegant Swimming Fish (Sleek minimalist fish path SVG) */}
      <div ref={fishRef} className={styles.fishContainer}>
        <svg viewBox="0 0 120 60" width="100%" height="100%">
          {/* Fish Silhouette */}
          <path
            d="M20,30 C35,15 65,10 85,25 C95,20 105,15 110,22 C105,30 105,30 110,38 C105,45 95,40 85,35 C65,50 35,45 20,30 Z"
            fill="rgba(15, 60, 90, 0.08)"
            stroke="var(--color-turquoise)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Tail Fin */}
          <path
            id="tail-fin"
            d="M18,30 L3,12 C0,20 0,40 3,48 Z"
            fill="rgba(174, 230, 220, 0.4)"
            stroke="var(--color-turquoise)"
            strokeWidth="1.5"
          />
          {/* Pectoral Fin */}
          <path
            id="pec-fin"
            d="M60,36 C55,42 45,46 45,46 C45,46 50,38 55,34"
            fill="none"
            stroke="var(--color-turquoise)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Fish Eye */}
          <circle cx="85" cy="24" r="2.5" fill="var(--color-marine)" />
          {/* Gills Line */}
          <path d="M76,22 C73,26 73,32 76,36" fill="none" stroke="var(--color-turquoise)" strokeWidth="1.2" />
        </svg>
      </div>

      <div className={styles.heroContent}>
        <p ref={tagRef} className={styles.serifTagline}>
          Aliran Harmoni di Bawah Riak Samudera
        </p>
        
        <h1 ref={titleRef} className={styles.heroTitle}>
          Crystal Lagoon. <br /> Silent Life.
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
