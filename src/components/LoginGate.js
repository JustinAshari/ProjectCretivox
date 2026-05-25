// src/components/LoginGate.js
"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./LoginGate.module.css";

export default function LoginGate({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const bubblesContainerRef = useRef(null);
  const fishContainerRef = useRef(null);

  // Generate floating silhouette fish inside the login gate
  useEffect(() => {
    const fishContainer = fishContainerRef.current;
    if (!fishContainer) return;

    const numFish = 6;
    const fishElements = [];

    for (let i = 0; i < numFish; i++) {
      const fishSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      fishSvg.setAttribute("viewBox", "0 0 120 60");
      fishSvg.setAttribute("class", styles.loginSilhouetteFish);
      
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M20,30 C35,15 65,10 85,25 C95,20 105,15 110,22 C105,30 105,30 110,38 C105,45 95,40 85,35 C65,50 35,45 20,30 Z");
      path.setAttribute("fill", "rgba(174, 230, 220, 0.12)");
      path.setAttribute("stroke", "rgba(174, 230, 220, 0.3)");
      path.setAttribute("stroke-width", "1");
      fishSvg.appendChild(path);

      // Tail fin
      const tail = document.createElementNS("http://www.w3.org/2000/svg", "path");
      tail.setAttribute("d", "M18,30 L3,12 C0,20 0,40 3,48 Z");
      tail.setAttribute("fill", "rgba(174, 230, 220, 0.22)");
      tail.setAttribute("stroke", "rgba(174, 230, 220, 0.3)");
      tail.setAttribute("stroke-width", "1");
      fishSvg.appendChild(tail);

      const size = 60 + Math.random() * 60;
      fishSvg.style.width = `${size}px`;
      fishSvg.style.height = `${size / 2}px`;
      
      fishContainer.appendChild(fishSvg);
      fishElements.push({ element: fishSvg, size });
    }

    const fishCtx = gsap.context(() => {
      fishElements.forEach(({ element, size }) => {
        // Random swim parameters
        const startLeft = Math.random() > 0.5;
        const xStart = startLeft ? -size - 20 : window.innerWidth + 20;
        const xEnd = startLeft ? window.innerWidth + size + 20 : -size - 20;
        const scaleX = startLeft ? 1 : -1;
        
        const swim = () => {
          const yPos = 50 + Math.random() * (window.innerHeight - 150);
          const duration = 12 + Math.random() * 14;
          const delay = Math.random() * 5;

          gsap.fromTo(element, 
            { x: xStart, y: yPos, scaleX: scaleX, opacity: 0 },
            { 
              x: xEnd,
              y: yPos + (Math.random() * 100 - 50),
              opacity: 0.7,
              duration: duration,
              delay: delay,
              ease: "sine.inOut",
              onComplete: () => {
                // Repeat with new random values
                swim();
              }
            }
          );
          
          // Subtle tail wiggling
          const tailFin = element.lastChild;
          if (tailFin) {
            gsap.to(tailFin, {
              rotate: 15,
              transformOrigin: "left center",
              repeat: -1,
              yoyo: true,
              duration: 0.2 + Math.random() * 0.2,
              ease: "sine.inOut"
            });
          }
        };

        swim();
      });
    }, fishContainer);

    return () => {
      fishCtx.revert();
      fishElements.forEach(({ element }) => {
        if (fishContainer.contains(element)) {
          fishContainer.removeChild(element);
        }
      });
    };
  }, []);

  // Generate floating bubbles inside the login gate
  useEffect(() => {
    const bubblesContainer = bubblesContainerRef.current;
    if (!bubblesContainer) return;

    const numBubbles = 15;
    const bubbles = [];

    for (let i = 0; i < numBubbles; i++) {
      const bubble = document.createElement("div");
      bubble.className = styles.overlayBubble;
      
      const size = 15 + Math.random() * 35;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = 12 + Math.random() * 10;

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${left}%`;
      bubble.style.animationDelay = `${delay}s`;
      bubble.style.animationDuration = `${duration}s`;

      bubblesContainer.appendChild(bubble);
      bubbles.push(bubble);
    }

    // Intro stagger for login container elements
    gsap.fromTo(
      containerRef.current.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" }
    );

    return () => {
      bubbles.forEach(b => {
        if (bubblesContainer.contains(b)) {
          bubblesContainer.removeChild(b);
        }
      });
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Please fill in both fields.");
      playShake();
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("https://dummyjson.com/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.accessToken) {
        // Success!
        // Save to localStorage
        localStorage.setItem("cretivox_user", JSON.stringify(data));
        localStorage.setItem("cretivox_token", data.accessToken);
        
        // Success Liquid Splash GSAP Transition
        triggerExitTransition(data);
      } else {
        // Auth failed
        setErrorMsg(data.message || "Invalid username or password.");
        playShake();
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again later.");
      playShake();
    } finally {
      setLoading(false);
    }
  };

  // Shake container on error
  const playShake = () => {
    gsap.fromTo(
      containerRef.current,
      { x: -10 },
      { x: 0, duration: 0.5, ease: "rough({template: none, strength: 8, points: 10, taper: none, randomize: true, clamp: false})" }
    );
  };

  // Circular splash zoom out transition
  const triggerExitTransition = (userData) => {
    const overlay = overlayRef.current;
    const container = containerRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        onLoginSuccess(userData);
      }
    });

    // Shrink login card elegantly like a bubble popping
    tl.to(container, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "back.in(1.7)"
    });

    // Scale clipPath circle to 0 to simulate a water droplet pinch closing
    tl.to(overlay, {
      clipPath: "circle(0% at center)",
      duration: 1.0,
      ease: "power4.inOut"
    }, "-=0.25");
  };

  return (
    <div ref={overlayRef} className={styles.loginOverlay}>
      <div ref={bubblesContainerRef} className={styles.ambientBubbles}></div>
      <div ref={fishContainerRef} className={styles.ambientFish}></div>
      
      <div ref={containerRef} className={`${styles.loginContainer} glass-card`}>
        <h1 className={styles.loginTitle}>THE FLOW</h1>
        <p className={styles.loginSubtitle}>
          Authorize credentials to dive into the creative frontend experience.
        </p>

        {errorMsg && <div className={styles.errorCard}>{errorMsg}</div>}

        <form style={{ width: "100%" }} onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Username</label>
            <input
              type="text"
              className={styles.inputField}
              placeholder="e.g. emilys"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                className={styles.inputField}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.passwordToggleBtn}
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <span>ENTER THE FLOW</span>
            )}
          </button>
        </form>

        <div className={styles.hints}>
          <p className={styles.hintText}>
            <strong>ACCESS CREDENTIALS:</strong><br />
            Username: <span className={styles.hintValue}>emilys</span> &nbsp;|&nbsp; Password: <span className={styles.hintValue}>emilyspass</span>
          </p>
        </div>
      </div>
    </div>
  );
}
