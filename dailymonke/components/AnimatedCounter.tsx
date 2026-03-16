"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

function parseNumeric(value: string): {
  prefix: string;
  number: number;
  decimals: number;
  suffix: string;
} {
  const match = value.match(/^([^\d]*?)([\d,]+\.?\d*)(.*?)$/);
  if (!match) return { prefix: value, number: 0, decimals: 0, suffix: "" };

  const prefix = match[1];
  const numStr = match[2].replace(/,/g, "");
  const number = parseFloat(numStr);
  const decimalPart = numStr.split(".")[1];
  const decimals = decimalPart ? decimalPart.length : 0;
  const suffix = match[3];

  return { prefix, number, decimals, suffix };
}

function formatWithCommas(n: number, decimals: number): string {
  const fixed = n.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart ? `${withCommas}.${decPart}` : withCommas;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    const { prefix, number, decimals, suffix } = parseNumeric(value);
    if (number === 0) {
      setDisplay(value);
      return;
    }

    const duration = 2000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = eased * number;

      setDisplay(`${prefix}${formatWithCommas(current, decimals)}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [value]);

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true;
      animate();
    }
  }, [inView, animate]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
