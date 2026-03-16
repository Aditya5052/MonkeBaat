import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getMonkeyBySlug,
  getAdjacentMonkeys,
  getAllMonkeys,
  isMonkeyReleased,
} from "@/lib/monkeys";
import DynamicIslandNav from "@/components/DynamicIslandNav";
import HeroSection from "@/components/HeroSection";
import SpecimenBentoGrid from "@/components/SpecimenBentoGrid";
import AudioSection from "@/components/AudioSection";
import HabitatSection from "@/components/HabitatSection";
import FeaturedQuote from "@/components/FeaturedQuote";
import ConservationSection from "@/components/ConservationSection";
import PrevNextNav from "@/components/PrevNextNav";
import Footer from "@/components/Footer";
import SectionCard from "@/components/SectionCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const monkey = getMonkeyBySlug(slug);

  if (!monkey) {
    return { title: "Not Found — MonkeBaat" };
  }

  return {
    title: `${monkey.name} — MonkeBaat Past Monkes`,
    description: `${monkey.name} (${monkey.scientificName}). ${monkey.quote.slice(0, 150)}...`,
    openGraph: {
      title: `${monkey.name} — MonkeBaat`,
      description: monkey.quote,
      type: "article",
      siteName: "MonkeBaat",
    },
    twitter: {
      card: "summary_large_image",
      title: monkey.name,
      description: monkey.quote,
    },
  };
}

export function generateStaticParams() {
  return getAllMonkeys().map((m) => ({ slug: m.slug }));
}

export const revalidate = 3600;

export default async function MonkeyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const monkey = getMonkeyBySlug(slug);

  if (!monkey || !isMonkeyReleased(slug)) {
    notFound();
  }

  const { prev, next } = getAdjacentMonkeys(slug);
  let idx = 0;

  return (
    <main className="relative">
      <DynamicIslandNav variant="archive" />
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
        <PrevNextNav prev={prev} next={next} />
        <Footer dedicationText={monkey.dedicationText} />
      </SectionCard>
    </main>
  );
}
