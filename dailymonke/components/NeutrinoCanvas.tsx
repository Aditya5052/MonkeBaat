"use client";

import { useEffect, useRef, useCallback } from "react";

interface NeutrinoCanvasProps {
  active: boolean;
  className?: string;
}

class Neutrino {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  history: { x: number; y: number }[];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.alpha = 1;
    this.history = [];
    this.reset(x, y);
  }

  reset(x: number, y: number) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = Math.random() * 0.5 + 0.5;
    this.history = [];
  }

  update(intensity: number, centerX: number, centerY: number) {
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > 20) this.history.shift();

    this.x += this.vx * intensity;
    this.y += this.vy * intensity;
    this.alpha -= 0.01;
    if (this.alpha <= 0) this.reset(centerX, centerY);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.history[0]?.x ?? this.x, this.history[0]?.y ?? this.y);
    for (const p of this.history) ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = `rgba(212, 160, 23, ${this.alpha * 0.4})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

export default function NeutrinoCanvas({
  active,
  className = "",
}: NeutrinoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Neutrino[]>([]);
  const animationRef = useRef<number | null>(null);
  const activeRef = useRef(active);

  activeRef.current = active;

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    particlesRef.current = Array.from(
      { length: 150 },
      () => new Neutrino(cx, cy)
    );
  }, []);

  const animate = useCallback(() => {
    if (!activeRef.current) {
      animationRef.current = null;
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const intensity =
      1 + Math.sin(Date.now() * 0.005) * 0.5 + Math.random() * 0.2;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (const p of particlesRef.current) {
      p.update(intensity, cx, cy);
      p.draw(ctx);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    initParticles();

    const handleResize = () => {
      initParticles();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initParticles]);

  useEffect(() => {
    if (active) {
      if (!animationRef.current) animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [active, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${
        active ? "opacity-100" : "opacity-0"
      } ${className}`}
    />
  );
}
