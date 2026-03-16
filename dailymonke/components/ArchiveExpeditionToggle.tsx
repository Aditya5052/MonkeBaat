"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const ExpeditionGlobe = dynamic(() => import("./ExpeditionGlobe"), { ssr: false });

interface MonkeyPin {
  slug: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  conservationStatus: string;
}

export default function ArchiveExpeditionToggle({ monkeys }: { monkeys: MonkeyPin[] }) {
  const [showGlobe, setShowGlobe] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowGlobe(true)}
        className="px-5 py-2.5 rounded-full glass-card font-mono text-[11px] tracking-[0.2em] uppercase text-golden-orange hover:bg-white/10 hover:border-white/20 transition-all"
      >
        🌍 Globe Expedition
      </button>

      {showGlobe && (
        <ExpeditionGlobe monkeys={monkeys} onClose={() => setShowGlobe(false)} />
      )}
    </>
  );
}
