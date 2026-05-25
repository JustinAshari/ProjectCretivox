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

    // Split title into words
    const words = title.innerText.split(" ");
    title.innerHTML = "";
    
    words.forEach((word) => {
      const span = document.createElement("span");
      span.innerText = word + "\u00A0";
      span.style.display = "inline-block";
      span.style.whiteSpace = "nowrap";
      title.appendChild(span);
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

  // Swimming Fish & Ambient Bubble Emitter
  useEffect(() => {
    const fish = fishRef.current;
    if (!fish) return;

    const wrapper = heroRef.current;
    const fishWidth = 120;
    
    // Initial coordinates
    let fishX = -fishWidth;
    let fishY = 200 + Math.random() * 200;
    let direction = 1; // 1 = right, -1 = left
    let speed = 2.5;
    let angleFreq = 0.02;
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

    // Fish swim loop
    const animateSwim = () => {
      time += 0.05;
      
      // Horizontal motion
      fishX += speed * direction;
      
      // Vertical organic wave (sine motion)
      fishY += Math.sin(time) * 0.8;

      // Wrap around or flip direction
      const wWidth = window.innerWidth;
      if (direction === 1 && fishX > wWidth + 50) {
        direction = -1;
        speed = 1.8 + Math.random() * 1.5; // randomize speed
        fishY = 150 + Math.random() * (window.innerHeight - 300);
        gsap.to(fish, { scaleX: -1, duration: 0.4 }); // smooth turn flip
      } else if (direction === -1 && fishX < -fishWidth - 50) {
        direction = 1;
        speed = 1.8 + Math.random() * 1.5;
        fishY = 150 + Math.random() * (window.innerHeight - 300);
        gsap.to(fish, { scaleX: 1, duration: 0.4 });
      }

      gsap.set(fish, { x: fishX, y: fishY });

      // Spawn bubbles behind the fish tail coordinates
      if (Math.random() < 0.12) {
        const bubble = document.createElement("div");
        bubble.className = styles.bubbleParticle;
        
        // Offset bubble to spawn near the tail
        const tailOffset = direction === 1 ? -60 : 60;
        const bX = fishX + 60 + tailOffset;
        const bY = fishY + 30 + (Math.random() * 10 - 5);
        const size = 3 + Math.random() * 8;

        bubble.style.left = `${bX}px`;
        bubble.style.top = `${bY}px`;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        wrapper.appendChild(bubble);

        // Animate bubble rising and fading
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
      {/* Follow spot glow */}
      <div ref={glowRef} className={styles.glowTracker}></div>

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
          Swimming Against the Current
        </p>
        
        <h1 ref={titleRef} className={styles.heroTitle}>
          Fluid Mind. Resilient Strength.
        </h1>

        <p ref={descRef} className={styles.heroDescription}>
          I build high-end interactive digital landscapes. Through organic, storytelling-driven animations,
          I transform layouts into engaging, responsive aquatic experiences that flow beautifully with the user.
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
