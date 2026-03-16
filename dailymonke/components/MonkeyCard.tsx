"use client";

import Link from "next/link";
import { Monkey } from "@/lib/types";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import IUCNBadge from "./IUCNBadge";
import ImageShimmer from "./ImageShimmer";

function formatDate(id: number) {
  const day = String(id).padStart(2, "0");
  return `${day}.12.23`;
}

function formatIndex(index: number) {
  return String(index).padStart(3, "0");
}

export default function MonkeyCard({
  monkey,
  featured = false,
  compact = false,
  index,
}: {
  monkey: Monkey;
  featured?: boolean;
  compact?: boolean;
  index: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (featured) {
    return (
      <Link href={`/archive/${monkey.slug}`} className="block relative z-[1]" style={{ perspective: "1000px" }}>
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="glass-card rounded-3xl group relative flex flex-col overflow-hidden"
        >
        <div className={`relative ${compact ? "aspect-[4/3] md:aspect-[3/2]" : "aspect-[16/9]"} overflow-hidden bg-deep-void`}>
          <ImageShimmer
            alt={monkey.displayName}
            src={monkey.imageUrl}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            unoptimized
            className="object-cover grayscale-[60%] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
          />
          <div className="absolute top-6 left-6">
            <span className="bg-deep-void/60 backdrop-blur-md px-3 py-1.5 text-[8px] font-mono uppercase tracking-[0.2em] text-golden-orange border border-golden-orange/20 rounded-full">
              Specimen A-{monkey.id}
            </span>
          </div>
          {/* Interactive Hover Detail Reveal */}
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] z-20">
            <p className="font-sans text-xs md:text-sm text-mist-white/90 italic leading-relaxed line-clamp-2">
              "{monkey.quote}"
            </p>
          </div>
        </div>

        <div className="p-6 md:p-10 flex flex-col">
          <h3 className="font-serif text-3xl md:text-5xl text-mist-white mb-1 italic">
            {monkey.displayName}
          </h3>
          <p className="text-sm text-mist-white/70 mb-1">
            {monkey.name}
          </p>
          <p className="font-mono text-[10px] text-icy-blue/60 uppercase tracking-[0.3em] mb-3">
            {monkey.scientificName}
          </p>
          <IUCNBadge status={monkey.conservationStatus} />
          <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-40">
              Observation // {formatIndex(index)}
            </span>
            <span className="font-mono text-xs text-golden-orange">
              {formatDate(monkey.id)}
            </span>
          </div>
        </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/archive/${monkey.slug}`} className="block relative z-[1]" style={{ perspective: "1000px" }}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass-card rounded-3xl group relative flex flex-col overflow-hidden"
      >
      <div className="relative aspect-square overflow-hidden bg-deep-void">
        <ImageShimmer
          alt={monkey.displayName}
          src={monkey.imageUrl}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
          className="object-cover grayscale-[60%] transition-all duration-1000 group-hover:grayscale-0"
        />
      </div>

      <div className="p-8 h-full flex flex-col justify-between relative group/content">
        <div className="transition-opacity duration-500 group-hover/content:opacity-0 relative z-10">
          <h3 className="font-serif text-3xl text-mist-white mb-1">
            {monkey.displayName}
          </h3>
          <p className="text-sm text-mist-white/60 mb-1">
            {monkey.name}
          </p>
          <p className="font-mono text-[9px] text-icy-blue/40 uppercase tracking-widest mb-3">
            {monkey.scientificName}
          </p>
          <IUCNBadge status={monkey.conservationStatus} />
        </div>
        
        {/* Interactive Hover Data Overlay for Standard Cards */}
        <div className="absolute inset-0 bg-deep-void-elevated/95 backdrop-blur-sm p-8 opacity-0 group-hover/content:opacity-100 transition-opacity duration-500 flex flex-col justify-center">
          <p className="font-mono text-[10px] text-golden-orange/50 uppercase tracking-widest mb-2">Habitat</p>
          <p className="font-sans text-sm text-mist-white/90 mb-6 leading-relaxed line-clamp-2">{monkey.habitatName}</p>
          
          <p className="font-mono text-[10px] text-golden-orange/50 uppercase tracking-widest mb-2">Field Note</p>
          <p className="font-sans text-sm text-mist-white/90 leading-relaxed line-clamp-3">{monkey.notes[0]}</p>
        </div>

        <div className="mt-8 text-right relative z-10 transition-all duration-500 group-hover/content:-translate-y-2 group-hover/content:opacity-0">
          <span className="font-mono text-[10px] text-golden-orange/80">
            {formatDate(monkey.id)}
          </span>
        </div>
      </div>
      </motion.div>
    </Link>
  );
}
