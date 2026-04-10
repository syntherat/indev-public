"use client";

import { useMemo } from "react";
import styles from "./TwinklingStarsField.module.css";

function mulberry32(seed) {
  let t = seed >>> 0;

  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function roundTo(value, digits = 3) {
  return Number(value.toFixed(digits));
}

function createStars(count) {
  return Array.from({ length: count }, (_, index) => {
    const random = mulberry32((index + 1) * 1664525);
    const a = random();
    const b = random();
    const c = random();
    const d = random();

    const x = roundTo(a * 100);
    const y = roundTo(b * 100);
    const size = roundTo(1 + c * 2.2);
    const delay = roundTo(d * 6.5);
    const duration = roundTo(3.8 + (a + c) * 3.2);

    return {
      id: `star-${index}`,
      x,
      y,
      size,
      delay,
      duration,
      alpha: roundTo(0.34 + b * 0.62),
    };
  });
}

export default function TwinklingStarsField({ count = 120 }) {
  const stars = useMemo(() => createStars(count), [count]);

  return (
    <div className={styles.field} aria-hidden="true">
      <div className={styles.haze} />
      {stars.map((star) => (
        <span
          key={star.id}
          className={styles.star}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: star.alpha,
          }}
        />
      ))}
    </div>
  );
}
