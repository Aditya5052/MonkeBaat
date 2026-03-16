"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Monkey } from "@/lib/types";

const STATUS_PALETTE: Record<
  Monkey["conservationStatus"],
  { stroke: string; fill: string; glow: string; label: string }
> = {
  LC: {
    stroke: "#34d399",
    fill: "rgba(52, 211, 153, 0.08)",
    glow: "rgba(52, 211, 153, 0.3)",
    label: "Stable",
  },
  NT: {
    stroke: "#fbbf24",
    fill: "rgba(251, 191, 36, 0.08)",
    glow: "rgba(251, 191, 36, 0.3)",
    label: "Near Threatened",
  },
  VU: {
    stroke: "#f59e0b",
    fill: "rgba(245, 158, 11, 0.08)",
    glow: "rgba(245, 158, 11, 0.3)",
    label: "Declining",
  },
  EN: {
    stroke: "#f87171",
    fill: "rgba(248, 113, 113, 0.08)",
    glow: "rgba(248, 113, 113, 0.3)",
    label: "Critical Decline",
  },
  CR: {
    stroke: "#ef4444",
    fill: "rgba(239, 68, 68, 0.12)",
    glow: "rgba(239, 68, 68, 0.4)",
    label: "Collapse",
  },
};

interface PopulationChartProps {
  history: { year: number; population: number }[];
  status: Monkey["conservationStatus"];
  className?: string;
}

function formatPopulation(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

export default function PopulationChart({
  history,
  status,
  className = "",
}: PopulationChartProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const palette = STATUS_PALETTE[status];

  const vw = 400;
  const vh = 280;
  const pad = { top: 40, right: 24, bottom: 36, left: 52 };
  const chartW = vw - pad.left - pad.right;
  const chartH = vh - pad.top - pad.bottom;

  const years = history.map((d) => d.year);
  const pops = history.map((d) => d.population);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const maxPop = Math.max(...pops);
  const minPop = Math.min(...pops);
  const popRange = maxPop - minPop || 1;
  const popPadding = popRange * 0.15;
  const yMin = Math.max(0, minPop - popPadding);
  const yMax = maxPop + popPadding;
  const yRange = yMax - yMin || 1;

  function toX(year: number) {
    return pad.left + ((year - minYear) / (maxYear - minYear)) * chartW;
  }

  function toY(pop: number) {
    return pad.top + (1 - (pop - yMin) / yRange) * chartH;
  }

  const linePath = history
    .map((d, i) => `${i === 0 ? "M" : "L"}${toX(d.year).toFixed(1)},${toY(d.population).toFixed(1)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L${toX(maxYear).toFixed(1)},${(pad.top + chartH).toFixed(1)}` +
    ` L${toX(minYear).toFixed(1)},${(pad.top + chartH).toFixed(1)} Z`;

  const lastPoint = history[history.length - 1];
  const lastX = toX(lastPoint.year);
  const lastY = toY(lastPoint.population);

  const isRecovering = history.length >= 2 && history[history.length - 1].population > history[history.length - 2].population;

  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round(yMin + (yRange * i) / yTicks),
  );

  const xTickYears = years.filter((_, i) => i % 2 === 0 || i === years.length - 1);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${vw} ${vh}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`area-fill-${status}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.stroke} stopOpacity={0.2} />
          <stop offset="100%" stopColor={palette.stroke} stopOpacity={0.02} />
        </linearGradient>
        <filter id={`glow-${status}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Horizontal grid lines */}
      {yTickValues.map((val) => (
        <line
          key={val}
          x1={pad.left}
          y1={toY(val)}
          x2={vw - pad.right}
          y2={toY(val)}
          stroke="rgba(240, 244, 248, 0.08)"
          strokeWidth="0.5"
        />
      ))}

      {/* Y-axis labels */}
      {yTickValues.map((val) => (
        <text
          key={`label-${val}`}
          x={pad.left - 8}
          y={toY(val) + 3}
          textAnchor="end"
          fill="rgba(240, 244, 248, 0.55)"
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
        >
          {formatPopulation(val)}
        </text>
      ))}

      {/* X-axis labels */}
      {xTickYears.map((yr) => (
        <text
          key={yr}
          x={toX(yr)}
          y={vh - 6}
          textAnchor="middle"
          fill="rgba(240, 244, 248, 0.55)"
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
        >
          {yr}
        </text>
      ))}

      {/* Animated area fill */}
      <motion.path
        d={areaPath}
        fill={`url(#area-fill-${status})`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      {/* Animated trend line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={palette.stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#glow-${status})`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
      />

      {/* Data points */}
      {history.map((d, i) => (
        <motion.circle
          key={d.year}
          cx={toX(d.year)}
          cy={toY(d.population)}
          r={i === history.length - 1 ? 4 : 2}
          fill={i === history.length - 1 ? palette.stroke : "transparent"}
          stroke={palette.stroke}
          strokeWidth={i === history.length - 1 ? 0 : 1}
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
        />
      ))}

      {/* Pulsing glow on last point */}
      {inView && (
        <motion.circle
          cx={lastX}
          cy={lastY}
          r={8}
          fill="none"
          stroke={palette.stroke}
          strokeWidth="1"
          initial={{ opacity: 0.6, r: 4 }}
          animate={{ opacity: 0, r: 16 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Current value label */}
      <motion.g
        initial={{ opacity: 0, y: 5 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <text
          x={lastX}
          y={lastY - 14}
          textAnchor="middle"
          fill={palette.stroke}
          fontFamily="JetBrains Mono, monospace"
          fontSize="11"
          fontWeight="bold"
        >
          {formatPopulation(lastPoint.population)}
        </text>
      </motion.g>

      {/* Status indicator top-right */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <circle
          cx={vw - pad.right - 6}
          cy={pad.top - 20}
          r={3}
          fill={palette.stroke}
        />
        <text
          x={vw - pad.right - 14}
          y={pad.top - 17}
          textAnchor="end"
          fill={palette.stroke}
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          opacity={0.9}
        >
          {isRecovering ? "RECOVERING" : palette.label.toUpperCase()}
        </text>
      </motion.g>

      {/* Trend arrow */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <text
          x={pad.left + 4}
          y={pad.top - 20}
          fill="rgba(240, 244, 248, 0.7)"
          fontFamily="JetBrains Mono, monospace"
          fontSize="10"
          fontWeight="500"
          style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
        >
          POPULATION TREND · {minYear}–{maxYear}
        </text>
      </motion.g>
    </svg>
  );
}
