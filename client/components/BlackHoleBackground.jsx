"use client";

import { useEffect, useRef } from "react";
import styles from "./BlackHoleBackground.module.css";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const random = (min, max) => Math.random() * (max - min) + min;

function spawnParticle(width, height, center) {
  const maxRadius = Math.hypot(width, height) * 0.62;
  const angle = random(0, Math.PI * 2);
  const radius = random(maxRadius * 0.55, maxRadius);

  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius,
    vx: random(-0.03, 0.03),
    vy: random(-0.03, 0.03),
    size: random(0.6, 2.1),
    alpha: random(0.25, 0.95),
    twinkleSpeed: random(1.2, 3.6),
    twinkleOffset: random(0, Math.PI * 2),
  };
}

function resetParticle(particle, width, height, center) {
  const next = spawnParticle(width, height, center);
  particle.x = next.x;
  particle.y = next.y;
  particle.vx = next.vx;
  particle.vy = next.vy;
  particle.size = next.size;
  particle.alpha = next.alpha;
  particle.twinkleSpeed = next.twinkleSpeed;
  particle.twinkleOffset = next.twinkleOffset;
}

function updateParticle(particle, center, dt, width, height) {
  const dx = center.x - particle.x;
  const dy = center.y - particle.y;
  const distance = Math.hypot(dx, dy) || 0.0001;

  const dirX = dx / distance;
  const dirY = dy / distance;

  // Gravitational pull curve: gentle at distance, stronger near center.
  const gravity = 0.012 + 24 / (distance + 60);

  particle.vx += dirX * gravity * dt;
  particle.vy += dirY * gravity * dt;

  // Slight drag keeps velocity bounded and smooth.
  particle.vx *= 0.992;
  particle.vy *= 0.992;

  particle.x += particle.vx * dt;
  particle.y += particle.vy * dt;

  const centerResetRadius = 24;
  const outOfBounds =
    particle.x < -40 || particle.x > width + 40 || particle.y < -40 || particle.y > height + 40;

  if (distance < centerResetRadius || outOfBounds) {
    resetParticle(particle, width, height, center);
  }
}

export default function BlackHoleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });

    if (!ctx) {
      return;
    }

    let animationFrame = 0;
    const particles = [];
    let width = 0;
    let height = 0;
    const center = { x: 0, y: 0 };

    const particleCount = 200;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      center.x = width / 2;
      center.y = height / 2;

      if (particles.length === 0) {
        for (let i = 0; i < particleCount; i += 1) {
          particles.push(spawnParticle(width, height, center));
        }
      }
    };

    resize();

    let previous = performance.now();

    const animate = (timestamp) => {
      const frameDelta = timestamp - previous;
      previous = timestamp;

      // Clamp dt to avoid huge jumps if tab was inactive.
      const dt = clamp(frameDelta / (1000 / 60), 0.2, 2.4);
      const t = timestamp * 0.001;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];

        updateParticle(particle, center, dt, width, height);

        const twinkle = 0.65 + 0.35 * Math.sin(t * particle.twinkleSpeed + particle.twinkleOffset);
        const falloff = clamp(
          1 - Math.hypot(center.x - particle.x, center.y - particle.y) / (Math.hypot(width, height) * 0.75),
          0.2,
          1
        );

        ctx.globalAlpha = particle.alpha * twinkle * falloff;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className={styles.container} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.starCanvas} />

      <div className={`${styles.ring} ${styles.innerRing}`} />

      <div className={styles.coreGlow} />
      <div className={styles.coreVoid} />
    </div>
  );
}
