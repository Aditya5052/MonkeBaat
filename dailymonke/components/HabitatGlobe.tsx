"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { GlobeMethods } from "react-globe.gl";
import { useScroll, useVelocity, useSpring, useTransform } from "framer-motion";

const GOLDEN = "#D48C45";
const ICY_BLUE = "#B2D0E6";
const EARTH_NIGHT_URL =
  "//unpkg.com/three-globe/example/img/earth-night.jpg";

interface HabitatGlobeProps {
  lat: number;
  lng: number;
  locationName: string;
}

export default function HabitatGlobe({
  lat,
  lng,
  locationName,
}: HabitatGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [GlobeComponent, setGlobeComponent] = useState<React.ComponentType<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > | null>(null);

  useEffect(() => {
    import("react-globe.gl").then((mod) => setGlobeComponent(() => mod.default));
  }, []);

  const measure = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    setDimensions({ width: Math.round(width), height: Math.round(height) });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pre-center the globe on mount but keep it frozen
  useEffect(() => {
    if (!globeRef.current) return;
    const globe = globeRef.current;
    globe.pointOfView({ lat, lng, altitude: 2.2 }, 0);
    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = false;
      controls.enableZoom = window.innerWidth >= 768;
    }
  }, [lat, lng, GlobeComponent]);

  // When section scrolls into view, re-center with a smooth fly-in
  useEffect(() => {
    if (!hasEnteredView || !globeRef.current) return;
    const globe = globeRef.current;

    globe.pointOfView({ lat, lng, altitude: 2.2 }, 1200);

    const timer = setTimeout(() => {
      const controls = globe.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4; // Base speed
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [hasEnteredView, lat, lng]);

  // Tie rotation to scroll velocity
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  useEffect(() => {
    const unsub = smoothVelocity.on("change", (latest) => {
      if (!globeRef.current) return;
      const controls = globeRef.current.controls();
      if (controls && controls.autoRotate) {
        // Base speed 0.4, add up to 3.0 based on scroll velocity magnitude
        controls.autoRotateSpeed = 0.4 + Math.min(Math.abs(latest) * 0.005, 3.0);
      }
    });
    return unsub;
  }, [smoothVelocity]);

  const pointData = [{ lat, lng, name: locationName }];

  const ringData = [{ lat, lng }];

  const labelData = [{ lat, lng, text: locationName }];

  return (
    <div ref={containerRef} className="w-full h-full">
      {GlobeComponent && dimensions.width > 0 && (
        <GlobeComponent
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={EARTH_NIGHT_URL}
          showAtmosphere={true}
          atmosphereColor={ICY_BLUE}
          atmosphereAltitude={0.15}
          pointsData={pointData}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => GOLDEN}
          pointAltitude={0.12}
          pointRadius={0.5}
          pointResolution={12}
          ringsData={ringData}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => (t: number) =>
            `rgba(212, 140, 69, ${1 - t})`
          }
          ringMaxRadius={4}
          ringPropagationSpeed={2}
          ringRepeatPeriod={800}
          labelsData={labelData}
          labelLat="lat"
          labelLng="lng"
          labelText="text"
          labelColor={() => GOLDEN}
          labelSize={1.2}
          labelAltitude={0.02}
          labelDotRadius={0.4}
          labelDotOrientation="bottom"
          labelResolution={3}
          animateIn={true}
        />
      )}
    </div>
  );
}
