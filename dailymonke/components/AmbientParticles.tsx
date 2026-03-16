"use client";

import { useRef, useEffect, useCallback } from "react";

type ParticleType = "snow" | "rain" | "steam" | "dust" | "fireflies";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

const CONFIGS: Record<
  ParticleType,
  {
    count: number;
    color: string;
    init: (w: number, h: number) => Particle;
    update: (p: Particle, w: number, h: number, t: number) => void;
    draw: (ctx: CanvasRenderingContext2D, p: Particle, t: number) => void;
  }
> = {
  snow: {
    count: 80,
    color: "rgba(240, 244, 248, OPACITY)",
    init: (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: 0.2 + Math.random() * 0.4,
      size: 1.5 + Math.random() * 3.5,
      opacity: 0.2 + Math.random() * 0.45,
      life: 0,
      maxLife: Infinity,
    }),
    update: (p, w, h, t) => {
      p.x += p.vx + Math.sin(t * 0.001 + p.y * 0.01) * 0.2;
      p.y += p.vy;
      if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
    },
    draw: (ctx, p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 244, 248, ${p.opacity})`;
      ctx.fill();
    },
  },
  rain: {
    count: 100,
    color: "rgba(178, 208, 230, OPACITY)",
    init: (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: -0.5,
      vy: 4 + Math.random() * 6,
      size: 1,
      opacity: 0.1 + Math.random() * 0.25,
      life: 0,
      maxLife: Infinity,
    }),
    update: (p, w, h) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y > h) { p.y = -20; p.x = Math.random() * w; }
    },
    draw: (ctx, p) => {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2);
      ctx.strokeStyle = `rgba(178, 208, 230, ${p.opacity})`;
      ctx.lineWidth = p.size;
      ctx.stroke();
    },
  },
  steam: {
    count: 40,
    color: "rgba(240, 244, 248, OPACITY)",
    init: (w, h) => ({
      x: w * 0.3 + Math.random() * w * 0.4,
      y: h + 10,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.3 + Math.random() * 0.5),
      size: 8 + Math.random() * 20,
      opacity: 0,
      life: 0,
      maxLife: 300 + Math.random() * 200,
    }),
    update: (p, w, h, t) => {
      p.life++;
      const progress = p.life / p.maxLife;
      p.x += p.vx + Math.sin(t * 0.002 + p.x * 0.005) * 0.3;
      p.y += p.vy;
      p.size += 0.15;
      p.opacity = progress < 0.2
        ? progress * 5 * 0.2
        : 0.2 * (1 - (progress - 0.2) / 0.8);
      if (p.life > p.maxLife) {
        p.x = w * 0.3 + Math.random() * w * 0.4;
        p.y = h + 10;
        p.life = 0;
        p.size = 8 + Math.random() * 20;
        p.vy = -(0.3 + Math.random() * 0.5);
      }
    },
    draw: (ctx, p) => {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, `rgba(240, 244, 248, ${p.opacity})`);
      gradient.addColorStop(1, `rgba(240, 244, 248, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  dust: {
    count: 50,
    color: "rgba(212, 140, 69, OPACITY)",
    init: (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.1,
      size: 1.5 + Math.random() * 2.5,
      opacity: 0.1 + Math.random() * 0.25,
      life: Math.random() * 600,
      maxLife: 600,
    }),
    update: (p, w, h, t) => {
      p.life++;
      p.x += p.vx + Math.sin(t * 0.0005 + p.y * 0.003) * 0.1;
      p.y += p.vy + Math.cos(t * 0.0003 + p.x * 0.003) * 0.05;
      const pulse = Math.sin(p.life * 0.01) * 0.5 + 0.5;
      p.opacity = 0.05 + pulse * 0.2;
      if (p.x < -5) p.x = w + 5;
      if (p.x > w + 5) p.x = -5;
      if (p.y < -5) p.y = h + 5;
      if (p.y > h + 5) p.y = -5;
    },
    draw: (ctx, p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 140, 69, ${p.opacity})`;
      ctx.fill();
    },
  },
  fireflies: {
    count: 35,
    color: "rgba(212, 200, 69, OPACITY)",
    init: (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      size: 2 + Math.random() * 2.5,
      opacity: 0,
      life: Math.random() * 400,
      maxLife: 400,
    }),
    update: (p, w, h, t) => {
      p.life++;
      p.x += p.vx + Math.sin(t * 0.001 + p.life * 0.02) * 0.3;
      p.y += p.vy + Math.cos(t * 0.0008 + p.life * 0.015) * 0.2;
      const blink = Math.sin(p.life * 0.04) * 0.5 + 0.5;
      p.opacity = blink * 0.4;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
    },
    draw: (ctx, p) => {
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      glow.addColorStop(0, `rgba(212, 200, 69, ${p.opacity})`);
      glow.addColorStop(0.4, `rgba(180, 210, 100, ${p.opacity * 0.4})`);
      glow.addColorStop(1, `rgba(180, 210, 100, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 220, ${p.opacity})`;
      ctx.fill();
    },
  },
};

const HABITAT_MAP: Record<string, ParticleType> = {
  "Temperate Mountain Forest": "snow",
  "Tropical Rainforest": "rain",
  "Temperate & Subalpine Forest": "steam",
  "Dry Spiny Forest & Gallery Forest": "dust",
  "Lowland Tropical Rainforest": "fireflies",
};

interface AmbientParticlesProps {
  habitatName: string;
  className?: string;
}

export default function AmbientParticles({
  habitatName,
  className = "",
}: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  const type = HABITAT_MAP[habitatName] ?? "dust";
  const config = CONFIGS[type];

  const animate = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        config.update(p, canvas.width, canvas.height, t);
        config.draw(ctx, p, t);
      }

      animRef.current = requestAnimationFrame(animate);
    },
    [config],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);

      particlesRef.current = Array.from({ length: config.count }, () =>
        config.init(rect.width, rect.height),
      );
    };

    resize();
    animRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [animate, config]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
