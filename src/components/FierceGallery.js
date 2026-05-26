// src/components/FierceGallery.js
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./FierceGallery.module.css";

export default function FierceGallery() {
  const sectionRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    // Register ScrollTrigger client-side
    gsap.registerPlugin(ScrollTrigger);

    const header = headerRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;

    // Header reveal
    gsap.fromTo(
      header.children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // GSAP ScrollTrigger Entrance for the cards with Parallax sways
    // Left card entries
    gsap.fromTo(
      card1,
      { x: -100, y: 150, opacity: 0, rotate: -5 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: card1,
          start: "top 85%",
          scrub: 1,
        },
      }
    );

    // Center card scale-up
    gsap.fromTo(
      card2,
      { y: 200, scale: 0.9, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card2,
          start: "top 85%",
          scrub: 1,
        },
      }
    );

    // Right card entries
    gsap.fromTo(
      card3,
      { x: 100, y: 150, opacity: 0, rotate: 5 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: card3,
          start: "top 85%",
          scrub: 1,
        },
      }
    );

    // Dynamic water-radius wiggling loop
    const animateBorderRadii = () => {
      // Card 1 wiggle
      gsap.to(card1, {
        borderRadius: "45% 55% 65% 35% / 55% 45% 55% 45%",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Card 2 wiggle
      gsap.to(card2, {
        borderRadius: "55% 45% 35% 65% / 45% 55% 45% 55%",
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // Card 3 wiggle
      gsap.to(card3, {
        borderRadius: "35% 65% 55% 45% / 65% 35% 65% 35%",
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.0,
      });
    };

    animateBorderRadii();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Magnetic 3D tilt interaction
  const handleMouseMove = (e, card) => {
    if (window.innerWidth < 992) return; // disable on tablets/mobiles
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / (rect.height / 2)) * -12; // max tilt 12 degrees
    const tiltY = (x / (rect.width / 2)) * 12;

    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 1000,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (card) => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  return (
    <section ref={sectionRef} className={styles.galleryWrapper} id="fierce-gallery">
      <div ref={headerRef} className={styles.sectionHeader}>
        <p className={styles.serifSubtitle}>The Three Facets</p>
        <h2 className={styles.sectionTitle}>Fierce Profiles</h2>
      </div>

      <div className={styles.galleryGrid}>
        {/* Card 1: Left Profile */}
        <div
          ref={card1Ref}
          className={styles.galleryCard}
          data-hover-text="ANALYTICAL"
          onMouseMove={(e) => handleMouseMove(e, card1Ref.current)}
          onMouseLeave={() => handleMouseLeave(card1Ref.current)}
        >
          <div className={styles.imageWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fierce/Kiri.png"
              alt="Fierce Left Face Profile"
              className={styles.fierceImage}
            />
          </div>
          <div className={styles.cardOverlay}>
            <span className={styles.overlayTag}>Left Face // Analytical</span>
            <h3 className={styles.overlayTitle}>Sisi Kiri: Reading The Waves</h3>
            <p className={styles.overlayDesc}>
              Analyzing every angle, observing structural patterns, and mapping out fluid routes.
              True frontend craftsmanship starts with absolute technical design logic.
            </p>
          </div>
        </div>

        {/* Card 2: Front Profile */}
        <div
          ref={card2Ref}
          className={styles.galleryCard}
          data-hover-text="FOCUS"
          onMouseMove={(e) => handleMouseMove(e, card2Ref.current)}
          onMouseLeave={() => handleMouseLeave(card2Ref.current)}
        >
          <div className={styles.imageWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fierce/Depan.jpg"
              alt="Fierce Front Profile Face"
              className={styles.fierceImage}
            />
          </div>
          <div className={styles.cardOverlay}>
            <span className={styles.overlayTag}>Front Face // Visionary</span>
            <h3 className={styles.overlayTitle}>Sisi Depan: The Fierce Focus</h3>
            <p className={styles.overlayDesc}>
              Locking eyes with challenges. Resilient, relentless, and direct. The interface
              is the soul of the digital experience—bold, uncompromising, and flawless.
            </p>
          </div>
        </div>

        {/* Card 3: Right Profile */}
        <div
          ref={card3Ref}
          className={styles.galleryCard}
          data-hover-text="CREATIVE"
          onMouseMove={(e) => handleMouseMove(e, card3Ref.current)}
          onMouseLeave={() => handleMouseLeave(card3Ref.current)}
        >
          <div className={styles.imageWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fierce/Kanan.png"
              alt="Fierce Right Face Profile"
              className={styles.fierceImage}
            />
          </div>
          <div className={styles.cardOverlay}>
            <span className={styles.overlayTag}>Right Face // Intuitive</span>
            <h3 className={styles.overlayTitle}>Sisi Kanan: The Creative Reef</h3>
            <p className={styles.overlayDesc}>
              Nurturing artistic expression, thinking out of the shell, and shaping organic ideas.
              Fluid styling breathes life into static code.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
