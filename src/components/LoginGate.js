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
  
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const bubblesContainerRef = useRef(null);

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
            <input
              type="password"
              className={styles.inputField}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
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
            🔐 <strong>POINT ++ CREDENTIALS:</strong><br />
            Username: <span className={styles.hintValue}>emilys</span> &nbsp;|&nbsp; Password: <span className={styles.hintValue}>emilyspass</span>
          </p>
        </div>
      </div>
    </div>
  );
}
