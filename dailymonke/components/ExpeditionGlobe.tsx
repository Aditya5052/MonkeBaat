"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { GlobeMethods } from "react-globe.gl";
import Link from "next/link";

const GOLDEN = "#D48C45";
const ICY_BLUE = "#B2D0E6";
const EARTH_NIGHT_URL = "//unpkg.com/three-globe/example/img/earth-night.jpg";

interface MonkeyPin {
  slug: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  conservationStatus: string;
}

interface ExpeditionGlobeProps {
  monkeys: MonkeyPin[];
  onClose: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  LC: "#34d399",
  NT: "#fbbf24",
  VU: "#f59e0b",
  EN: "#f87171",
  CR: "#ef4444",
};

export default function ExpeditionGlobe({ monkeys, onClose }: ExpeditionGlobeProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const nav = document.querySelector("nav");
    const footer = document.querySelector("footer");
    if (nav) nav.style.display = "none";
    if (footer) footer.style.display = "none";
    return () => {
      document.body.style.overflow = "";
      if (nav) nav.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [GlobeComponent, setGlobeComponent] = useState<React.ComponentType<any> | null>(null);
  const [selected, setSelected] = useState<MonkeyPin | null>(null);

  useEffect(() => {
    import("react-globe.gl").then((mod) => setGlobeComponent(() => mod.default));
  }, []);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
      controls.enableZoom = true;
    }
  }, [GlobeComponent]);

  const handlePointClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (point: any) => {
      const m = monkeys.find((mk) => mk.lat === point.lat && mk.lng === point.lng);
      if (m) {
        setSelected(m);
        if (globeRef.current) {
          globeRef.current.pointOfView({ lat: m.lat, lng: m.lng, altitude: 1.8 }, 800);
        }
      }
    },
    [monkeys],
  );

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 9990, background: "#000" }}
    >
      {/* Globe canvas -- absolute fill */}
      {GlobeComponent && dimensions.width > 0 && (
        <GlobeComponent
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={EARTH_NIGHT_URL}
          showAtmosphere
          atmosphereColor={ICY_BLUE}
          atmosphereAltitude={0.15}
          pointsData={monkeys}
          pointLat="lat"
          pointLng="lng"
          pointColor={(d: MonkeyPin) => STATUS_COLORS[d.conservationStatus] || GOLDEN}
          pointAltitude={0.06}
          pointRadius={0.35}
          pointResolution={12}
          onPointClick={handlePointClick}
          ringsData={monkeys}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => (t: number) => `rgba(212, 140, 69, ${0.3 * (1 - t)})`}
          ringMaxRadius={2}
          ringPropagationSpeed={1.5}
          ringRepeatPeriod={2000}
          labelsData={monkeys}
          labelLat="lat"
          labelLng="lng"
          labelText="name"
          labelColor={() => "rgba(240, 244, 248, 0.6)"}
          labelSize={0.6}
          labelAltitude={0.01}
          labelDotRadius={0.2}
          labelDotOrientation="bottom"
          labelResolution={2}
          animateIn
        />
      )}

      {/* Title -- top left */}
      <div style={{ position: "absolute", top: 24, left: 24, zIndex: 10, pointerEvents: "none" }}>
        <h2 className="font-serif text-2xl md:text-3xl italic text-golden-orange">
          Global Expedition
        </h2>
        <p className="font-mono text-[10px] tracking-[0.15em] text-icy-blue/80 mt-1">
          {monkeys.length} SPECIES CATALOGUED
        </p>
      </div>

      {/* Close button -- top right */}
      <button
        onClick={onClose}
        style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}
        className="px-5 py-2.5 rounded-full bg-deep-void-elevated/80 backdrop-blur-xl border border-white/15 font-mono text-[11px] tracking-[0.2em] uppercase text-golden-orange hover:bg-white/10 transition-colors cursor-pointer"
      >
        ← Back to Archive
      </button>

      {/* Legend -- bottom right */}
      <div
        style={{ position: "absolute", bottom: 24, right: 24, zIndex: 10 }}
        className="glass-card p-4 rounded-xl hidden md:block"
      >
        <p className="font-mono text-[9px] tracking-[0.15em] text-icy-blue/80 mb-3 uppercase">
          Conservation Status
        </p>
        {Object.entries(STATUS_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-mono text-[9px] text-mist-white/60">{key}</span>
          </div>
        ))}
      </div>

      {/* Selected monkey card -- bottom center */}
      {selected && (
        <div
          style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}
          className="glass-card p-6 rounded-2xl max-w-sm w-[90%] text-center"
        >
          <p className="font-mono text-[10px] tracking-[0.15em] text-icy-blue/80 mb-2">
            {selected.conservationStatus} · {selected.lat.toFixed(1)}°, {selected.lng.toFixed(1)}°
          </p>
          <h3 className="font-serif text-xl italic text-golden-orange mb-1">
            {selected.displayName}
          </h3>
          <p className="text-mist-white/80 text-sm mb-4">{selected.name}</p>
          <Link
            href={`/archive/${selected.slug}`}
            className="inline-block px-5 py-2 rounded-full glass-card font-mono text-[10px] tracking-[0.2em] uppercase text-golden-orange hover:bg-white/10 transition-colors"
          >
            View Specimen →
          </Link>
        </div>
      )}
    </div>
  );
}
