"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function BananaRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bananasRef = useRef<{ x: number; y: number; vy: number; vx: number; rot: number; rotSpeed: number; size: number }[]>([]);

  useEffect(() => {
    if (!active) {
      bananasRef.current = [];
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 40; i++) {
      bananasRef.current.push({
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height * 0.5,
        vy: 2 + Math.random() * 4,
        vx: (Math.random() - 0.5) * 2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
        size: 16 + Math.random() * 16,
      });
    }

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allDone = true;
      for (const b of bananasRef.current) {
        b.y += b.vy;
        b.x += b.vx;
        b.rot += b.rotSpeed;
        if (b.y < canvas.height + 50) allDone = false;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.font = `${b.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🍌", 0, 0);
        ctx.restore();
      }
      if (!allDone) {
        rafId = requestAnimationFrame(draw);
      }
    };
    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none"
    />
  );
}

function MonkeyBurst({ x, y, active }: { x: number; y: number; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const emojis = useRef<{ x: number; y: number; vx: number; vy: number; rot: number; rotSpeed: number; size: number; alpha: number }[]>([]);

  useEffect(() => {
    if (!active) { emojis.current = []; return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 5;
      emojis.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        size: 14 + Math.random() * 10,
        alpha: 1,
      });
    }

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const e of emojis.current) {
        e.x += e.vx;
        e.y += e.vy;
        e.vy += 0.15;
        e.rot += e.rotSpeed;
        e.alpha -= 0.012;
        if (e.alpha <= 0) continue;
        alive = true;
        ctx.save();
        ctx.globalAlpha = e.alpha;
        ctx.translate(e.x, e.y);
        ctx.rotate(e.rot);
        ctx.font = `${e.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🐵", 0, 0);
        ctx.restore();
      }
      if (alive) rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [active, x, y]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 z-[9998] pointer-events-none" />;
}

export default function CursorFollower() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [bananaRain, setBananaRain] = useState(false);
  const [monkeyBurst, setMonkeyBurst] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [burstPos, setBurstPos] = useState({ x: 0, y: 0 });
  const typedRef = useRef("");
  const activeTargetRef = useRef<HTMLElement | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const prevXRef = useRef(0);
  const tiltResetRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const clickTimesRef = useRef<number[]>([]);
  const sleepingRef = useRef(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 600, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 600, damping: 28 });

  useEffect(() => {
    const handleAudio = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setAudioPlaying(detail?.playing ?? false);
    };
    window.addEventListener("monke-audio", handleAudio);
    return () => window.removeEventListener("monke-audio", handleAudio);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      typedRef.current += e.key.toLowerCase();
      if (typedRef.current.length > 20) typedRef.current = typedRef.current.slice(-20);
      if (typedRef.current.endsWith("monkey")) {
        typedRef.current = "";
        setBurstPos({ x: cursorX.get(), y: cursorY.get() });
        setMonkeyBurst(true);
        setSpinning(true);
        setTimeout(() => setMonkeyBurst(false), 2500);
        setTimeout(() => setSpinning(false), 800);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cursorX, cursorY]);

  const resetIdleTimer = useCallback(() => {
    if (sleepingRef.current) {
      sleepingRef.current = false;
      setSleeping(false);
    }
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      sleepingRef.current = true;
      setSleeping(true);
    }, 30000);
  }, []);

  const handleClick = useCallback(() => {
    setClicking(true);
    setTimeout(() => setClicking(false), 200);

    const now = Date.now();
    clickTimesRef.current.push(now);
    clickTimesRef.current = clickTimesRef.current.filter((t) => now - t < 2000);
    if (clickTimesRef.current.length >= 10) {
      clickTimesRef.current = [];
      setBananaRain(true);
      setTimeout(() => setBananaRain(false), 4000);
    }
  }, []);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;

    setVisible(true);
    resetIdleTimer();

    const move = (e: MouseEvent) => {
      resetIdleTimer();

      if (activeTargetRef.current && document.contains(activeTargetRef.current)) {
        const rect = activeTargetRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          cursorX.set(rect.left + rect.width / 2);
          cursorY.set(rect.top + rect.height / 2);
          return;
        }
      }

      if (activeTargetRef.current && !document.contains(activeTargetRef.current)) {
        setHovered(false);
        activeTargetRef.current = null;
      }
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (imgRef.current) {
        const dx = e.clientX - prevXRef.current;
        const tilt = Math.max(-15, Math.min(15, dx * 0.8));
        imgRef.current.style.transform = `rotate(${tilt}deg)`;
        prevXRef.current = e.clientX;

        clearTimeout(tiltResetRef.current);
        tiltResetRef.current = setTimeout(() => {
          if (imgRef.current) imgRef.current.style.transform = "rotate(0deg)";
        }, 100);
      }
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactable = target.closest("button") || target.closest("[data-magnetic]");
      if (interactable) {
        setHovered(true);
        activeTargetRef.current = interactable as HTMLElement;
        const rect = interactable.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          cursorX.set(rect.left + rect.width / 2);
          cursorY.set(rect.top + rect.height / 2);
        }
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactable = target.closest("button") || target.closest("[data-magnetic]");
      if (interactable) {
        setHovered(false);
        activeTargetRef.current = null;
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", handleOver, { passive: true });
    document.addEventListener("mouseout", handleOut, { passive: true });
    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      window.removeEventListener("mousedown", handleClick);
      clearTimeout(idleTimerRef.current);
    };
  }, [cursorX, cursorY, handleClick, resetIdleTimer]);

  if (!visible) return null;

  const size = hovered ? 40 : 26;

  let imgSrc: string;
  if (sleeping) {
    imgSrc = "/cursors/monkey-normal.png";
  } else if (audioPlaying) {
    imgSrc = "/cursors/monkey-screaming.png";
  } else {
    imgSrc = "/cursors/monkey-normal.png";
  }

  const sleepStyle = sleeping
    ? { filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5)) brightness(0.5)", transition: "filter 1s ease" }
    : { filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))", transition: "filter 0.3s ease" };

  return (
    <>
      <BananaRain active={bananaRain} />
      <MonkeyBurst x={burstPos.x} y={burstPos.y} active={monkeyBurst} />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: size,
          height: size,
          transition: "width 0.3s cubic-bezier(0.2,0.8,0.2,1), height 0.3s cubic-bezier(0.2,0.8,0.2,1)",
        }}
      >
        <div className={`w-full h-full ${audioPlaying && !sleeping ? "animate-shake" : ""}`}>
          <div
            className="w-full h-full"
            style={{
              transform: clicking ? "scaleX(1.2) scaleY(0.8)" : hovered ? "scale(1.3)" : spinning ? "rotate(360deg)" : "scale(1)",
              transition: spinning ? "transform 0.6s cubic-bezier(0.2,0.8,0.2,1)" : "transform 0.15s cubic-bezier(0.2,0.8,0.2,1)",
            }}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt=""
              className="w-full h-full object-contain"
              style={{
                ...sleepStyle,
                transition: `transform 0.1s ease-out, ${sleepStyle.transition}`,
              }}
              draggable={false}
            />
            {sleeping && (
              <div className="absolute -top-3 -right-2 text-[10px] animate-bounce text-golden-orange/80 select-none">
                💤
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
