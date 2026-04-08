"use client";

import { useMemo } from "react";
import styles from "./TwinklingStarsField.module.css";

function createStars(count) {
  return Array.from({ length: count }, (_, index) => {
    const seed = index + 1;
    const randomA = Math.sin(seed * 91.73) * 10000;
    const randomB = Math.sin(seed * 53.19) * 10000;
    const randomC = Math.sin(seed * 11.41) * 10000;
    const randomD = Math.sin(seed * 77.07) * 10000;

    const x = (randomA - Math.floor(randomA)) * 100;
    const y = (randomB - Math.floor(randomB)) * 100;
    const size = 1 + (randomC - Math.floor(randomC)) * 2.2;
    const delay = (randomD - Math.floor(randomD)) * 6.5;
    const duration = 3.8 + ((randomA - Math.floor(randomA)) + (randomC - Math.floor(randomC))) * 3.2;

    return {
      id: `star-${index}`,
      x,
      y,
      size,
      delay,
      duration,
      alpha: 0.34 + (randomB - Math.floor(randomB)) * 0.62,
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
