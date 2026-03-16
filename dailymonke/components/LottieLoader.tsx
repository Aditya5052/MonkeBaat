"use client";

import { motion } from "framer-motion";

interface LottieLoaderProps {
  size?: number;
  className?: string;
}

export default function LottieLoader({
  size = 64,
  className = "",
}: LottieLoaderProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <motion.circle
          cx="50" cy="50" r="35"
          fill="none"
          stroke="var(--color-golden-orange)"
          strokeWidth="2"
          strokeOpacity={0.2}
        />
        <motion.circle
          cx="50" cy="50" r="35"
          fill="none"
          stroke="var(--color-golden-orange)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="80 140"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />
        <motion.circle
          cx="50" cy="50" r="4"
          fill="var(--color-golden-orange)"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
