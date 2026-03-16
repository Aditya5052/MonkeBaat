"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Monkey } from "@/lib/types";
import IUCNBadge from "./IUCNBadge";
import ImageShimmer from "./ImageShimmer";

function CharReveal({
  text,
  className,
  baseDelay = 0.1,
  increment = 0.05,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  increment?: number;
}) {
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <span className={`char-reveal ${className ?? ""}`}>
      {words.map((word, wi) => (
        <span key={wi} className="no-wrap-heading">
          {word.split("").map((char) => {
            const delay = baseDelay + charIndex * increment;
            charIndex++;
            return (
              <span key={`${wi}-${charIndex}`} style={{ animationDelay: `${delay}s` }}>
                {char}
              </span>
            );
          })}
          {wi < words.length - 1 && <span style={{ display: "inline-block", width: "0.3em" }}>{" "}</span>}
        </span>
      ))}
    </span>
  );
}

export default function HeroSection({ monkey }: { monkey: Monkey }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Gradient placeholder visible before image loads */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(212,140,69,0.12) 0%, transparent 40%), radial-gradient(ellipse at 50% 40%, rgba(212,140,69,0.25) 0%, transparent 60%), radial-gradient(ellipse at 30% 60%, rgba(178,208,230,0.06) 0%, transparent 50%)",
        }}
      />
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
        <motion.div
          initial={{ scale: 1.1, filter: "grayscale(100%)", opacity: 0.15 }}
          animate={{ scale: 1, filter: "grayscale(0%)", opacity: 0.6 }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0 w-full h-full"
          style={{ scale: imgScale }}
        >
          <ImageShimmer
            alt={monkey.displayName}
            src={monkey.imageUrl}
            fill
            sizes="100vw"
            priority
            unoptimized
            className="object-cover hover:grayscale-0 transition-all duration-[2000ms]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-deep-void via-transparent to-deep-void" />
      </motion.div>

      {/* Animated SVG sketch overlay */}
      <svg
        className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-50 animate-breath"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          className="sketch-path"
          cx="500"
          cy="450"
          r="280"
          fill="none"
          stroke="var(--color-golden-orange)"
          strokeWidth="0.5"
        />
        <path
          className="sketch-path"
          d="M400,350 Q500,150 600,350"
          fill="none"
          stroke="var(--color-icy-blue)"
          strokeWidth="0.5"
        />
        <path
          className="sketch-path"
          d="M300,550 L700,550"
          fill="none"
          stroke="var(--color-golden-orange)"
          strokeWidth="0.2"
        />
        <text
          fill="var(--color-icy-blue)"
          fontFamily="JetBrains Mono, monospace"
          fontSize="10"
          textAnchor="start"
          x="80"
          y="180"
        >
          SPECIMEN: {monkey.scientificName.toUpperCase()}
        </text>
        <text
          fill="var(--color-icy-blue)"
          fontFamily="JetBrains Mono, monospace"
          fontSize="10"
          textAnchor="end"
          x="920"
          y="200"
        >
          HABITAT: {monkey.habitatName.toUpperCase()}
        </text>
      </svg>

      {/* Centered content */}
      <div className="relative z-20 text-center max-w-6xl px-4 md:px-6 mt-12">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-80 mb-12">
          Daily Primate Discovery
        </p>

        <h1 className="font-serif text-5xl sm:text-7xl md:text-9xl mb-4 italic text-golden-orange mt-8 tracking-tighter">
          <CharReveal text={monkey.displayName} />
        </h1>

        <p className="font-sans text-lg md:text-2xl text-mist-white/90 tracking-wide mb-2">
          {monkey.name}
        </p>
        <p className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-icy-blue/80 mb-4">
          {monkey.scientificName} · {monkey.family} · {monkey.locationName}
        </p>
        <div>
          <IUCNBadge status={monkey.conservationStatus} size="md" />
        </div>
      </div>
    </section>
  );
}
