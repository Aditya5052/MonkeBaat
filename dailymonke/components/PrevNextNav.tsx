"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

interface NavMonkey {
  slug: string;
  displayName: string;
  name: string;
}

export default function PrevNextNav({
  prev,
  next,
}: {
  prev: NavMonkey | null;
  next: NavMonkey | null;
}) {
  return (
    <section className="py-12 md:py-24 px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-4 md:gap-6">
        {prev ? (
          <ScrollReveal direction="left" delay={0}>
            <Link
              href={`/archive/${prev.slug}`}
              className="glass-card rounded-xl px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4 hover:bg-white/5 transition-colors"
            >
              <span className="text-golden-orange text-lg">&larr;</span>
              <div>
                <span className="block font-serif text-sm text-mist-white/80 italic">
                  {prev.displayName}
                </span>
                <span className="block font-mono text-[10px] text-icy-blue/50 uppercase tracking-wider">
                  {prev.name}
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ) : (
          <div />
        )}
        {next ? (
          <ScrollReveal direction="right" delay={0.1}>
            <Link
              href={`/archive/${next.slug}`}
              className="glass-card rounded-xl px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4 hover:bg-white/5 transition-colors sm:text-right sm:ml-auto"
            >
              <div>
                <span className="block font-serif text-sm text-mist-white/80 italic">
                  {next.displayName}
                </span>
                <span className="block font-mono text-[10px] text-icy-blue/50 uppercase tracking-wider">
                  {next.name}
                </span>
              </div>
              <span className="text-golden-orange text-lg">&rarr;</span>
            </Link>
          </ScrollReveal>
        ) : (
          <div />
        )}
      </div>
    </section>
  );
}
