// src/components/CustomCursor.js
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const containerRef = useRef(null);
  const [hoverType, setHoverType] = useState(""); // "", "hovered", "clickable"

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // GSAP quickSetter for high performance position setting
    const xSet = gsap.quickSetter(cursor, "x", "px");
    const ySet = gsap.quickSetter(cursor, "y", "px");

    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };

    let lastX = 0;
    let lastY = 0;

    // Fluid drag effect (inertia lag) & dynamic bubble trail
    const onMouseMove = (e) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      mousePos.x = currentX;
      mousePos.y = currentY;

      // Distance check for abundant and dense bubble trail
      const dx = currentX - lastX;
      const dy = currentY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 15) { // Spawn a trail bubble every 15px moved (much more abundant!)
        lastX = currentX;
        lastY = currentY;

        const container = containerRef.current;
        if (container) {
          const bubble = document.createElement("div");
          bubble.className = styles.trailBubble;
          bubble.style.left = `${currentX}px`;
          bubble.style.top = `${currentY}px`;
          
          const size = 4 + Math.random() * 8; // larger and clearer micro-bubbles (4px - 12px)
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          container.appendChild(bubble);

          // Animate floating up and drifting slightly left/right
          gsap.to(bubble, {
            y: -60 - Math.random() * 80, // float upwards
            x: (Math.random() * 40 - 20), // drift slightly
            opacity: 0,
            scale: 1.5,
            duration: 0.6 + Math.random() * 0.6, // faster fade for high-performance dense trail
            ease: "power1.out",
            onComplete: () => {
              if (container.contains(bubble)) {
                container.removeChild(bubble);
              }
            }
          });
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    // Ticker loop for custom inertia damping
    const updatePosition = () => {
      const ease = 0.14; // fluid lag factor
      cursorPos.x += (mousePos.x - cursorPos.x) * ease;
      cursorPos.y += (mousePos.y - cursorPos.y) * ease;

      xSet(cursorPos.x);
      ySet(cursorPos.y);
    };

    gsap.ticker.add(updatePosition);

    // Click splash effect (spawning liquid micro-bubbles)
    const onMouseDown = (e) => {
      const container = containerRef.current;
      if (!container) return;

      const numBubbles = 4;
      for (let i = 0; i < numBubbles; i++) {
        const bubble = document.createElement("div");
        bubble.className = styles.bubble;
        bubble.style.left = `${e.clientX}px`;
        bubble.style.top = `${e.clientY}px`;
        container.appendChild(bubble);

        // Animate each bubble drifting away organically and fading out
        const angle = Math.random() * Math.PI * 2;
        const speed = 20 + Math.random() * 40;
        const distanceX = Math.cos(angle) * speed;
        const distanceY = Math.sin(angle) * speed;
        const size = 6 + Math.random() * 12;

        gsap.set(bubble, { width: 0, height: 0, opacity: 1 });

        gsap.to(bubble, {
          width: size,
          height: size,
          x: distanceX,
          y: distanceY - 15, // float upwards slightly
          opacity: 0,
          duration: 0.6 + Math.random() * 0.4,
          ease: "power2.out",
          onComplete: () => {
            if (container.contains(bubble)) {
              container.removeChild(bubble);
            }
          },
        });
      }

      // Small cursor compression on click
      gsap.to(cursor, { scale: 0.85, duration: 0.1 });
    };

    const onMouseUp = () => {
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Hover state management
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      // Morph cursor on interactive items
      const isInteractive = target.closest("a, button, [role='button'], input, textarea");
      const isGalleryCard = target.closest("[data-hover-text]");

      if (isGalleryCard) {
        setHoverType(target.closest("[data-hover-text]").getAttribute("data-hover-text"));
      } else if (isInteractive) {
        setHoverType("EXPLORE");
      } else {
        setHoverType("");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      gsap.ticker.remove(updatePosition);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.cursorContainer}>
      <div
        ref={cursorRef}
        className={`${styles.cursorRing} ${hoverType ? styles.hovered : ""}`}
      >
        {hoverType && <span className={styles.hoveredText}>{hoverType}</span>}
      </div>
    </div>
  );
}
