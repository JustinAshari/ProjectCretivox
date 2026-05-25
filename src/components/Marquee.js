// src/components/Marquee.js
"use client";

import styles from "./Marquee.module.css";

export default function Marquee() {
  const items = [
    "Voice of People",
    "Cretivox Endurance Test",
    "Justin Farrel Hazza Ashari",
    "Fluid Frontend Experiences",
    "GSAP Scroll Animation"
  ];

  // Repeat the items list to fill the width, duplicated inside the track for seamless looping
  const renderSet = (key) => (
    <div key={key} className={styles.marqueeSet}>
      {items.map((item, idx) => (
        <span key={idx} className={styles.marqueeText}>
          {item}
          <span className={styles.dot} />
        </span>
      ))}
    </div>
  );

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        {renderSet(1)}
        {renderSet(2)}
      </div>
    </div>
  );
}
