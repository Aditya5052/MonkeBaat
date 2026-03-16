"use client";

import dynamic from "next/dynamic";
import type { Monkey } from "@/lib/types";
import KineticText from "./KineticText";
import ScrollReveal from "./ScrollReveal";
import ImageShimmer from "./ImageShimmer";
import AmbientParticles from "./AmbientParticles";
import LottieLoader from "./LottieLoader";

const HabitatGlobe = dynamic(() => import("@/components/HabitatGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <LottieLoader size={64} />
    </div>
  ),
});

interface HabitatSectionProps {
  monkey: Monkey;
}

export default function HabitatSection({ monkey }: HabitatSectionProps) {
  return (
    <section className="relative min-h-screen bg-deep-void overflow-hidden">
      {/* Mist overlay */}
      <div className="absolute inset-0 mist-overlay z-0 animate-pulse-slow" />

      {/* Ambient habitat particles */}
      <div className="absolute inset-0 z-[2] opacity-90">
        <AmbientParticles habitatName={monkey.habitatName} />
      </div>

      {/* Globe — fills the section on desktop, fixed height on mobile */}
      <div className="absolute inset-0 z-[1] opacity-90">
        <div className="w-full h-full md:block hidden">
          <HabitatGlobe
            lat={monkey.lat}
            lng={monkey.lng}
            locationName={monkey.locationName}
          />
        </div>
      </div>

      {/* Mobile globe — stacked, not overlaid */}
      <div className="md:hidden w-full h-[320px] relative z-[1]">
        <HabitatGlobe
          lat={monkey.lat}
          lng={monkey.lng}
          locationName={monkey.locationName}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-8 md:pb-16 flex flex-col md:min-h-screen md:justify-between">
        {/* Top: Heading + coordinates */}
        <div className="space-y-4">
          <ScrollReveal direction="down" delay={0}>
            <KineticText
              text={`Habitat:\n${monkey.habitatName}`}
              className="font-serif text-3xl sm:text-5xl md:text-6xl text-icy-blue leading-tight text-balance"
              as="h2"
            />
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.15}>
            <div className="inline-flex items-center gap-3 font-mono text-[10px] md:text-xs tracking-widest uppercase text-golden-orange/70">
              <span className="inline-block w-2 h-2 rounded-full bg-golden-orange animate-pulse" />
              <span>{monkey.coordinates}</span>
              <span className="text-mist-white/30">·</span>
              <span className="text-mist-white/50">{monkey.locationName}</span>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom: Sensory panel + habitat photo inset */}
        <div className="mt-8 md:mt-0 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          {/* Sensory glass panel */}
          <ScrollReveal direction="up" delay={0.2} className="w-full lg:max-w-md">
            <div className="glass-card backdrop-blur-sm bg-deep-void/40 p-5 md:p-8 space-y-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-golden-orange">
                Sensory Profile
              </p>
              <div className="h-px bg-gradient-to-r from-golden-orange/30 via-transparent to-transparent" />

              {([
                { label: "Thermal", value: monkey.sensory.thermal },
                { label: "Olfactory", value: monkey.sensory.olfactory },
                { label: "Auditory", value: monkey.sensory.auditory },
              ] as const).map((item, i) => (
                <ScrollReveal key={item.label} delay={0.1 + 0.2 * i}>
                  <div>
                    <h3 className="font-mono text-[10px] md:text-xs uppercase tracking-[0.15em] text-icy-blue/60 mb-1.5">
                      {item.label}
                    </h3>
                    <p className="text-mist-white/70 text-sm font-light leading-relaxed">
                      {item.value}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>

          {/* Habitat photo inset — hidden on mobile */}
          <ScrollReveal
            direction="right"
            delay={0.35}
            className="hidden xl:block flex-shrink-0"
          >
            <div className="relative group w-[200px]">
              <div
                className="absolute -inset-3 border border-icy-blue/20 rotate-2 transition-transform group-hover:rotate-0"
                style={{
                  transition:
                    "transform 1.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }}
              />
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <ImageShimmer
                  src={monkey.habitatImageUrl}
                  alt={monkey.habitatName}
                  fill
                  sizes="200px"
                  unoptimized
                  className="object-cover brightness-110"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card p-3 w-48">
                <p className="text-[10px] italic text-mist-white/60 leading-snug">
                  {monkey.habitatImageCaption}
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
