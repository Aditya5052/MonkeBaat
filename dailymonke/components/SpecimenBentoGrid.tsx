"use client";

import { useRef, useState, useCallback, type MouseEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Monkey } from "@/lib/types";
import AuroraBackground from "./AuroraBackground";

function BentoTile({
  title,
  subtitle,
  children,
  className = "",
  delay = 0,
  centered = false,
}: {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  centered?: boolean;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.015, y: -2 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ type: "spring", stiffness: 400, damping: 30, delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-[24px] saturate-[120%] p-6 md:p-8 cursor-default hover:border-white/[0.2] hover:shadow-[0_8px_30px_rgba(212,140,69,0.12),0_20px_50px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.08)_inset] transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.05)_inset] ${className}`}
    >
      {/* Cursor-tracking radial glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212,140,69,0.30), transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div className="relative z-10 h-full flex flex-col">
        <div className={`flex flex-col flex-grow text-sm text-mist-white/70 font-sans leading-relaxed ${centered ? "justify-center" : "justify-between"}`}>
          {(title || subtitle) && (
            <div className={`flex flex-col ${centered ? "items-center text-center mb-6" : "mb-8 text-left"}`}>
              {subtitle && (
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-icy-blue/60 mb-3">
                  {subtitle}
                </p>
              )}
              {title && (
                <h3 className="font-serif text-[1.78rem] text-mist-white italic tracking-tighter leading-none">
                  {title}
                </h3>
              )}
            </div>
          )}
          <div className={`w-full flex-grow flex flex-col ${centered ? "items-center justify-center" : "justify-end"}`}>
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Interactive Widgets ---

function LifespanWidget({ years }: { years: number }) {
  const maxYears = 60; // relative scale max
  const percentage = Math.min((years / maxYears) * 100, 100);
  const circumference = 2 * Math.PI * 36; // r=36

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-3">
        {/* Background Track */}
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          {/* Animated Progress */}
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="var(--color-golden-orange)"
            strokeWidth="6"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-serif text-2xl text-mist-white">{years}</span>
          <span className="font-mono text-[8px] uppercase tracking-widest text-golden-orange/70 -mt-1">YRS</span>
        </div>
      </div>
    </div>
  );
}

function ActivityWidget({ pattern }: { pattern: "diurnal" | "nocturnal" | "crepuscular" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-10%" });

  const isNight = pattern === "nocturnal";
  const label = pattern.charAt(0).toUpperCase() + pattern.slice(1);

  // Sky colors
  const initialSky = isNight ? "#1A2E44" : "#050B14";
  const targetSky = isNight ? "#050B14" : "#1A2E44";

  // Use "150" to push well off-screen in either direction
  // Diurnal: moon visible (y:0) → sets off-screen below (y:150), sun off-screen (y:150) → rises to center (y:0)
  // Nocturnal: sun visible (y:0) → sets off-screen below (y:150), moon off-screen (y:150) → rises to center (y:0)
  const offScreen = 150;

  const moonInitialY = isNight ? offScreen : 0;
  const moonTargetY = isNight ? 0 : offScreen;

  const sunInitialY = isNight ? 0 : offScreen;
  const sunTargetY = isNight ? offScreen : 0;

  const starsInitial = isNight ? 0 : 1;
  const starsTarget = isNight ? 1 : 0;

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[140px] rounded-2xl overflow-hidden border border-white/5 pointer-events-none">
      {/* Sky Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{ backgroundColor: inView ? targetSky : initialSky }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }}
      />

      {/* Stars Container */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: inView ? starsTarget : starsInitial }}
        transition={{ duration: 1, ease: "easeInOut", delay: isNight ? 0.8 : 0.2 }}
      >
        {[...Array(8)].map((_, i) => (
           <motion.div
             key={i}
             className="absolute w-1 h-1 bg-white rounded-full"
             style={{ top: `${10 + (i * 7 + 5) % 60}%`, left: `${10 + (i * 11 + 3) % 80}%` }}
             animate={{ opacity: [0.2, 0.8, 0.2] }}
             transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
           />
        ))}
      </motion.div>
      
      {/* Sun */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-golden-orange shadow-[0_0_30px_rgba(212,140,69,0.8)]"
        initial={{ y: sunInitialY }}
        animate={inView ? { y: sunTargetY } : { y: sunInitialY }}
        transition={{ type: "spring", stiffness: 40, damping: 15, delay: isNight ? 0.2 : 0.8 }}
      />

      {/* Moon */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-mist-white/90 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        initial={{ y: moonInitialY }}
        animate={inView ? { y: moonTargetY } : { y: moonInitialY }}
        transition={{ type: "spring", stiffness: 40, damping: 15, delay: isNight ? 0.8 : 0.2 }}
      />
      
      {/* Label */}
      <div className="absolute bottom-2 inset-x-0 flex justify-center z-10">
        <span className="px-4 py-1.5 bg-deep-void/80 backdrop-blur-md rounded-full font-mono text-[9px] uppercase tracking-[0.2em] text-mist-white/80 border border-white/10">
          {label} Routine
        </span>
      </div>
      
      {/* Inner shadow overlay for depth */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_20px_40px_rgba(0,0,0,0.5)] opacity-50" />
    </div>
  );
}

export default function SpecimenBentoGrid({ monkey }: { monkey: Monkey }) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <AuroraBackground className="bg-deep-void">
      <section
        ref={sectionRef}
        className="relative min-h-[80vh] flex flex-col items-center justify-center py-24 md:py-32 px-4 md:px-6 max-w-7xl mx-auto"
      >
        <div className="relative z-10 text-center mb-20">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-golden-orange mb-8">
            Specimen Data
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl italic">
            <span
              style={{
                display: "inline-block",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.8s cubic-bezier(0.32, 0.72, 0, 1)",
              }}
              className="text-mist-white"
            >
              Vital Statistics
            </span>
          </h2>
        </div>

        {/* Ambient gradient mesh for glass card backdrop-filter */}
        <div
          className="absolute -inset-32 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(212,140,69,0.20) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(178,208,230,0.14) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main Hero Tile - spans 2 cols */}
          <BentoTile
            title="Field Notes"
            subtitle="Observation"
            className="lg:col-span-2 md:row-span-2 group/notes"
            delay={0.1}
          >
            <div className="relative h-full flex flex-col -translate-y-[5%]">
              {/* Quotes symbol */}
              <div className="select-none pointer-events-none mb-2" aria-hidden="true">
                <span className="font-serif text-5xl md:text-6xl leading-none text-golden-orange/40 transition-all duration-700 group-hover/notes:text-golden-orange/60">
                  &ldquo;
                </span>
              </div>

              <p className="text-[1.06rem] md:text-[1.28rem] lg:text-[1.60rem] text-mist-white/80 mb-6 md:mb-8 font-serif italic leading-snug tracking-tight transition-all duration-500 group-hover/notes:text-mist-white group-hover/notes:drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
                {monkey.notes[0]}
              </p>

              <div className="relative h-px w-24 mb-6 md:mb-8 overflow-hidden bg-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-golden-orange/60 to-transparent bg-[length:200%_100%] animate-shimmer" />
              </div>

              <p className="text-[0.85rem] md:text-[0.95rem] lg:text-[1.06rem] text-mist-white/60 leading-relaxed transition-all duration-500 group-hover/notes:text-mist-white/80">
                {monkey.notes[1]}
              </p>
            </div>
          </BentoTile>

          {/* Activity Pattern Box */}
          <BentoTile
            subtitle="Activity"
            centered
            className="lg:col-span-1 min-h-[220px]"
            delay={0.2}
          >
            <ActivityWidget pattern={monkey.activityPattern} />
          </BentoTile>

          {/* Lifespan Box */}
          <BentoTile
            subtitle="Avg. Lifespan"
            centered
            className="lg:col-span-1"
            delay={0.3}
          >
            <LifespanWidget years={monkey.lifespan} />
          </BentoTile>
        </div>
      </section>
    </AuroraBackground>
  );
}
