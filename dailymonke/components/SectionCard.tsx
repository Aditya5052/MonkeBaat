"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface SectionCardProps {
  children: ReactNode;
  index: number;
  isLast?: boolean;
}

export default function SectionCard({
  children,
  index,
  isLast = false,
}: SectionCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.8, 0]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [0, 24]);

  const sectionBg = index % 2 === 0 ? "#000000" : "#0d0d14";

  if (isLast) {
    return (
      <div
        ref={containerRef}
        className="relative"
        style={{ zIndex: index + 1, backgroundColor: sectionBg }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ zIndex: index + 1, backgroundColor: "#000" }}
    >
      <div className="sticky top-0" style={{ zIndex: index + 1 }}>
        <motion.div
          style={{
            scale,
            opacity,
            borderRadius,
            backgroundColor: sectionBg,
            transformOrigin: "top center",
          }}
          className="will-change-transform overflow-hidden"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
