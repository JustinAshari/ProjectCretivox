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

    let ctx = gsap.context(() => {
      // Horizontal pin only on desktop screens
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

    // Refresh ScrollTrigger to recalculate DOM heights
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.horizontalWrapper} id="story-scroll">
      <div ref={containerRef} className={styles.scrollContainer}>
        {/* Panel 1: Salmon Ethos */}
        <section className={`${styles.panel} ${styles.panel1}`}>
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
