"use client";

import { motion } from "framer-motion";
import AuroraBackground from "./AuroraBackground";

export default function FeaturedQuote({ quote }: { quote: string }) {
  return (
    <AuroraBackground className="bg-deep-void">
      <section className="relative min-h-screen py-20 md:py-32 flex items-center justify-center px-4 md:px-6">
        <motion.div
          className="max-w-6xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Vertical golden line */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-golden-orange/40 to-transparent" />

          <h2 className="font-serif text-xl sm:text-[2rem] md:text-[3.4rem] text-mist-white leading-[1.12] italic tracking-tight">
            <span aria-hidden="true">&ldquo;</span>
            {quote.split(" ").map((word, i) => (
              <span
                key={i}
                className="inline-block cursor-default transition-all duration-300 hover:text-golden-orange hover:scale-105"
              >
                {word}
                {i < quote.split(" ").length - 1 ? "\u00A0" : ""}
              </span>
            ))}
            <span aria-hidden="true">&rdquo;</span>
          </h2>

          <div className="mt-12 flex flex-col items-center">
            <div className="w-12 h-px bg-golden-orange opacity-60 mb-4" />
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-icy-blue/60">
              Field Observation Abstract
            </span>
          </div>
        </motion.div>
      </section>
    </AuroraBackground>
  );
}
