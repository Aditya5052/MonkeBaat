import type { Metadata } from "next";
import { getPastMonkeys } from "@/lib/monkeys";
import DynamicIslandNav from "@/components/DynamicIslandNav";
import KineticText from "@/components/KineticText";
import MonkeyCard from "@/components/MonkeyCard";
import { AnimatedGrid, AnimatedGridItem } from "@/components/AnimatedCardGrid";
import ArchivePagination from "@/components/ArchivePagination";
import ArchiveExpeditionToggle from "@/components/ArchiveExpeditionToggle";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Past Monkes — MonkeBaat",
  description:
    "A systematized repository of diurnal and nocturnal primate observations. Browse every primate featured on MonkeBaat.",
  openGraph: {
    title: "Past Monkes — MonkeBaat",
    description:
      "Browse the complete catalog of daily primate discoveries.",
    type: "website",
    siteName: "MonkeBaat",
  },
};

export const revalidate = 3600;

export default function ArchivePage() {
  const pastMonkeys = getPastMonkeys();
  const reversed = [...pastMonkeys].reverse();
  const now = new Date();
  const synced = `${now.getUTCFullYear()}.${String(now.getUTCMonth() + 1).padStart(2, "0")}.${String(now.getUTCDate()).padStart(2, "0")}`;

  return (
    <main>
      <DynamicIslandNav variant="archive" />

      {/* Archive Intro */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex flex-col items-center justify-center text-center px-4 md:px-6 pt-24 md:pt-32">
        <div className="absolute inset-0 mist-overlay z-0 animate-pulse-slow" />

        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-12 bg-golden-orange/60" />
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-golden-orange/60">
              Zoological Field Catalog // Database
            </p>
          </div>

          <KineticText
            text="Past Monkes"
            className="font-serif text-5xl sm:text-7xl md:text-9xl italic text-golden-orange"
            as="h1"
          />

          <p className="font-mono text-xs md:text-sm tracking-widest uppercase opacity-80 mb-8 max-w-2xl mx-auto mt-8">
            A systematized repository of diurnal and nocturnal primate observations.
          </p>

          <div className="mb-12 md:mb-20">
            <ArchiveExpeditionToggle
              monkeys={reversed.map((m) => ({
                slug: m.slug,
                name: m.name,
                displayName: m.displayName,
                lat: m.lat,
                lng: m.lng,
                conservationStatus: m.conservationStatus,
              }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 text-left mt-8 md:mt-12 border-t border-white/5 pt-8 md:pt-12">
            <div className="border-l border-golden-orange/30 pl-6">
              <p className="font-mono text-[10px] tracking-widest uppercase opacity-40 mb-1">
                Repository ID
              </p>
              <p className="font-mono text-xs text-icy-blue">[REF_ARC_042]</p>
            </div>
            <div className="border-l border-icy-blue/30 pl-6">
              <p className="font-mono text-[10px] tracking-widest uppercase opacity-40 mb-1">
                Classification
              </p>
              <p className="font-mono text-xs text-icy-blue">CATALOGUED</p>
            </div>
            <div className="border-l border-golden-orange/30 pl-6">
              <p className="font-mono text-[10px] tracking-widest uppercase opacity-40 mb-1">
                Last Synced
              </p>
              <p className="font-mono text-xs text-icy-blue">{synced}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Card Grid */}
      <section className="snap-start">
        {reversed.length > 0 ? (
          <AnimatedGrid className="grid grid-cols-1 gap-6 md:gap-12 md:grid-cols-4 lg:grid-cols-12 auto-rows-min max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
            {reversed.map((monkey, i) => (
              <AnimatedGridItem
                key={monkey.slug}
                className={
                  i === 0
                    ? "md:col-span-6 lg:col-span-7"
                    : i === 1
                    ? "md:col-span-6 lg:col-span-5"
                    : "md:col-span-4 lg:col-span-4"
                }
              >
                <MonkeyCard monkey={monkey} featured={i === 0 || i === 1} index={i} compact={i === 1} />
              </AnimatedGridItem>
            ))}
          </AnimatedGrid>
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-24 text-center">
            <p className="font-serif text-2xl italic text-mist-white/60">
              No past monkes yet — check back tomorrow!
            </p>
          </div>
        )}
      </section>

      <ArchivePagination />

      <Footer />
    </main>
  );
}
