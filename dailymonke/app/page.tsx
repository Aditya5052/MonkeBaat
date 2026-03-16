import type { Metadata } from "next";
import { getTodaysMonkey, getDayOfYear, getMonkeyDateString } from "@/lib/monkeys";
import DynamicIslandNav from "@/components/DynamicIslandNav";
import HeroSection from "@/components/HeroSection";
import SpecimenBentoGrid from "@/components/SpecimenBentoGrid";
import AudioSection from "@/components/AudioSection";
import HabitatSection from "@/components/HabitatSection";
import FeaturedQuote from "@/components/FeaturedQuote";
import ConservationSection from "@/components/ConservationSection";
import CountdownTimer from "@/components/CountdownTimer";
import Footer from "@/components/Footer";
import SectionCard from "@/components/SectionCard";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const monkey = getTodaysMonkey();
  const day = getDayOfYear();
  const dateStr = getMonkeyDateString(day);

  return {
    title: `MonkeBaat — ${monkey.name} | ${dateStr}`,
    description: `Today's primate: ${monkey.name} (${monkey.scientificName}). ${monkey.quote.slice(0, 150)}...`,
    openGraph: {
      title: `MonkeBaat — ${monkey.name}`,
      description: monkey.quote,
      type: "website",
      siteName: "MonkeBaat",
    },
    twitter: {
      card: "summary_large_image",
      title: `MonkeBaat — ${monkey.name} | ${dateStr}`,
      description: monkey.quote,
    },
  };
}

export default function HomePage() {
  const monkey = getTodaysMonkey();
  let idx = 0;

  return (
    <main className="relative">
      <DynamicIslandNav variant="default" />
      <SectionCard index={idx++}>
        <HeroSection monkey={monkey} />
      </SectionCard>
      <SectionCard index={idx++}>
        <SpecimenBentoGrid monkey={monkey} />
      </SectionCard>
      {(monkey.soundUrl || monkey.soundUrlMp3) && (
        <SectionCard index={idx++}>
          <AudioSection monkey={monkey} />
        </SectionCard>
      )}
      <SectionCard index={idx++}>
        <HabitatSection monkey={monkey} />
      </SectionCard>
      <SectionCard index={idx++}>
        <FeaturedQuote quote={monkey.quote} />
      </SectionCard>
      <SectionCard index={idx++}>
        <ConservationSection monkey={monkey} />
      </SectionCard>
      <SectionCard index={idx++} isLast>
        <CountdownTimer />
      </SectionCard>
      <Footer dedicationText={monkey.dedicationText} />
    </main>
  );
}
