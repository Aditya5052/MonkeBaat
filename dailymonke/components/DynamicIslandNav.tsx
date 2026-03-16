"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import MonkeLogo from "./MonkeLogo";

interface DynamicIslandNavProps {
  variant?: "default" | "archive";
}

export default function DynamicIslandNav({ variant = "default" }: DynamicIslandNavProps) {
  const isArchive = variant === "archive";
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-150%", opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-full px-5 py-3 border ${
        scrolled
          ? "w-[90%] md:w-[600px] bg-deep-void-elevated/80 backdrop-blur-xl border-white/15 shadow-[0_4px_30px_rgba(212,140,69,0.15),0_8px_32px_rgba(0,0,0,0.5)]"
          : "w-[90%] md:w-[100%] max-w-7xl bg-transparent border-transparent px-8"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-7 h-7 transition-transform duration-300 hover:scale-110">
          <MonkeLogo />
        </div>
        <span className="hidden sm:inline-flex items-baseline gap-1.5 pointer-events-none">
          <span className="font-serif text-sm md:text-base italic text-golden-orange tracking-wide">
            MonkeBaat
          </span>
          {isArchive && (
            <span className="font-mono text-[9px] md:text-[10px] tracking-widest text-mist-white/50">
              / Archive
            </span>
          )}
        </span>
      </div>
      
      <div className="flex items-center font-sans text-xs tracking-[0.1em] uppercase text-mist-white/70">
        {isArchive ? (
          <Link href="/" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-golden-orange hover:shadow-[0_0_20px_rgba(212,140,69,0.08)] transition-all" data-magnetic>
            ← Current
          </Link>
        ) : (
          <Link href="/archive" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-golden-orange hover:shadow-[0_0_20px_rgba(212,140,69,0.08)] transition-all" data-magnetic>
            Archive
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
