"use client";

import { useEffect, useState, type ReactNode } from "react";

interface AuroraBackgroundProps {
  children: ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}

const gradients = `
  repeating-linear-gradient(
    100deg,
    #000000 0%,
    #111111 5%,
    #D48C45 10%,
    #000000 16%,
    #0e1520 22%,
    #B2D0E6 28%,
    #000000 34%
  ),
  repeating-linear-gradient(
    100deg,
    #000000 0%,
    #D48C45 12%,
    #000000 20%,
    #B2D0E6 28%,
    #000000 36%
  )
`;

export default function AuroraBackground({
  children,
  className,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  const [audioIntensity, setAudioIntensity] = useState(0);

  useEffect(() => {
    let isPlaying = false;

    const handleAudio = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      isPlaying = detail?.playing ?? false;
      if (!isPlaying) setAudioIntensity(0);
    };

    const handleIntensity = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (isPlaying) setAudioIntensity(detail?.intensity ?? 0);
    };

    window.addEventListener("monke-audio", handleAudio);
    window.addEventListener("monke-audio-intensity", handleIntensity);
    return () => {
      window.removeEventListener("monke-audio", handleAudio);
      window.removeEventListener("monke-audio-intensity", handleIntensity);
    };
  }, []);

  const baseOpacity = 0.30;
  const boostedOpacity = baseOpacity + audioIntensity * 0.35;
  const blurAmount = 20 + audioIntensity * 15;

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <div
        className="pointer-events-none absolute -inset-[10px]"
        style={{
          opacity: boostedOpacity,
          backgroundImage: gradients,
          backgroundSize: "300% 200%, 200% 200%",
          filter: `blur(${blurAmount}px)`,
          willChange: "transform",
          transition: "opacity 0.15s ease-out, filter 0.15s ease-out",
          ...(showRadialGradient
            ? {
                maskImage:
                  "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
              }
            : {}),
        }}
      >
        <div
          className="absolute inset-0 animate-aurora mix-blend-soft-light"
          style={{
            backgroundImage: gradients,
            backgroundSize: "300% 200%, 200% 200%",
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
