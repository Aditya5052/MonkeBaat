"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AuroraBackground from "./AuroraBackground";

function getTimeToMidnightIST() {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(now.getTime() + istOffsetMs + now.getTimezoneOffset() * 60 * 1000);
  const midnightIST = new Date(nowIST);
  midnightIST.setHours(24, 0, 0, 0);
  const diff = midnightIST.getTime() - nowIST.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function Digit({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-card px-4 py-3 md:px-8 md:py-6 rounded-xl flex flex-col items-center">
      <div className="relative overflow-hidden h-[1em] font-serif text-3xl sm:text-5xl md:text-7xl text-golden-orange tabular-nums leading-none">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="block"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-icy-blue/80 mt-2">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <span className="font-serif text-3xl sm:text-5xl md:text-7xl text-icy-blue/30 animate-pulse self-start pt-3 md:pt-6">
      :
    </span>
  );
}

export default function CountdownTimer() {
  const [time, setTime] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    setTime(getTimeToMidnightIST());
    const id = setInterval(() => {
      setTime(getTimeToMidnightIST());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mounted = time !== null;

  return (
    <AuroraBackground className="bg-deep-void">
      <section className="relative py-16 md:py-32 flex items-center justify-center px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-golden-orange mb-16">
            Next Specimen Arrives In
          </p>

          <div className="relative">
            {/* Ambient gradient mesh for glass card backdrop-filter */}
            <div
              className="absolute -inset-32 z-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 40% 50%, rgba(212,140,69,0.20) 0%, transparent 60%), radial-gradient(ellipse at 60% 50%, rgba(178,208,230,0.14) 0%, transparent 60%)",
                filter: "blur(80px)",
              }}
            />
          </div>
          <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-4 md:gap-12">
            {mounted ? (
              <>
                <Digit value={pad(time.hours)} label="Hours" />
                <Colon />
                <Digit value={pad(time.minutes)} label="Minutes" />
                <Colon />
                <Digit value={pad(time.seconds)} label="Seconds" />
              </>
            ) : (
              <>
                <Digit value="--" label="Hours" />
                <Colon />
                <Digit value="--" label="Minutes" />
                <Colon />
                <Digit value="--" label="Seconds" />
              </>
            )}
          </div>
        </div>
      </section>
    </AuroraBackground>
  );
}
