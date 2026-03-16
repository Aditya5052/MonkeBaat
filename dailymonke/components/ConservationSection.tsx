"use client";

import { useRef, useState, useCallback, type MouseEvent } from "react";
import { useInView } from "framer-motion";
import { Monkey } from "@/lib/types";
import AnimatedCounter from "./AnimatedCounter";
import IUCNBadge from "./IUCNBadge";
import PopulationChart from "./PopulationChart";

function HeadingCharReveal({
  line,
  className,
  startIndex,
  baseDelay,
  stagger,
  inView,
}: {
  line: string;
  className?: string;
  startIndex: number;
  baseDelay: number;
  stagger: number;
  inView: boolean;
}) {
  let idx = startIndex;
  return (
    <span className={`no-wrap-heading ${className ?? ""}`}>
      {line.split("").map((char) => {
        const delay = baseDelay + idx * stagger;
        idx++;
        if (char === " ") {
          return (
            <span
              key={idx}
              style={{
                display: "inline-block",
                opacity: inView ? undefined : 0,
                animation: inView
                  ? `charReveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s forwards`
                  : "none",
              }}
            >
              &nbsp;
            </span>
          );
        }
        return (
          <span
            key={idx}
            style={{
              display: "inline-block",
              opacity: inView ? undefined : 0,
              animation: inView
                ? `charReveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s forwards`
                : "none",
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

export default function ConservationSection({ monkey }: { monkey: Monkey }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [chartMouse, setChartMouse] = useState({ x: 0, y: 0 });
  const [chartHovered, setChartHovered] = useState(false);
  const handleChartMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setChartMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const line1 = "The Line of";
  const line2 = "Survival";

  return (
    <section
      ref={ref}
      className="min-h-screen py-16 md:py-24 bg-deep-void px-4 md:px-6 overflow-hidden flex items-center"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left column */}
        <div>
          <h2 className="font-serif text-4xl md:text-6xl mb-8">
            <HeadingCharReveal
              line={line1}
              startIndex={0}
              baseDelay={0.1}
              stagger={0.03}
              inView={inView}
            />
            <br />
            <HeadingCharReveal
              line={line2}
              className="text-golden-orange"
              startIndex={line1.length}
              baseDelay={0.1}
              stagger={0.03}
              inView={inView}
            />
          </h2>

          <p className="text-mist-white/80 leading-normal font-normal mb-8 max-w-md">
            {monkey.conservationText.split(monkey.scientificName).length > 1 ? (
              <>
                {monkey.conservationText.split(monkey.scientificName)[0]}
                <i>{monkey.scientificName}</i>
                {monkey.conservationText.split(monkey.scientificName).slice(1).join(monkey.scientificName)}
              </>
            ) : (
              monkey.conservationText
            )}
          </p>

          <div className="mb-8">
            <IUCNBadge status={monkey.conservationStatus} size="md" />
          </div>

          <div className="flex space-x-8">
            <div className="space-y-1">
              <AnimatedCounter
                value={monkey.populationEstimate}
                className="block font-mono text-xl text-golden-orange"
              />
              <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-icy-blue/80">
                Individuals Remaining
              </span>
            </div>
            <div className="space-y-1">
              <AnimatedCounter
                value={monkey.habitatRecoveryRate}
                className="block font-mono text-xl text-icy-blue"
              />
              <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-icy-blue/80">
                Habitat Recovery Rate
              </span>
            </div>
          </div>
        </div>

        {/* Right column — population trend chart */}
        <div className="relative h-[300px] md:h-[500px]">
          {/* Ambient gradient mesh for glass card backdrop-filter */}
          <div
            className="absolute -inset-32 z-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(212,140,69,0.20) 0%, transparent 60%), radial-gradient(ellipse at 50% 60%, rgba(178,208,230,0.14) 0%, transparent 60%)",
              filter: "blur(80px)",
            }}
          />
        <div
          className="relative z-10 h-full"
          onMouseMove={handleChartMouseMove}
          onMouseEnter={() => setChartHovered(true)}
          onMouseLeave={() => setChartHovered(false)}
        >
          <div
            className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 rounded-inherit"
            style={{
              background: `radial-gradient(800px circle at ${chartMouse.x}px ${chartMouse.y}px, rgba(212,140,69,0.30), transparent 50%)`,
              opacity: chartHovered ? 1 : 0,
            }}
          />
          <div className="relative z-10 h-full glass-card overflow-hidden flex items-center justify-center p-4 md:p-6">
            <PopulationChart
              history={monkey.populationHistory}
              status={monkey.conservationStatus}
              className="w-full h-full"
            />
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
