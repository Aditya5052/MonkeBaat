"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

interface ImageShimmerProps extends Omit<ImageProps, "onLoad"> {
  shimmerColor?: string;
}

export default function ImageShimmer({
  shimmerColor = "var(--color-deep-void)",
  className = "",
  ...props
}: ImageShimmerProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div
          className="absolute inset-0 z-10 animate-shimmer"
          style={{
            background: `linear-gradient(
              110deg,
              ${shimmerColor} 0%,
              ${shimmerColor} 40%,
              rgba(178, 208, 230, 0.04) 50%,
              ${shimmerColor} 60%,
              ${shimmerColor} 100%
            )`,
            backgroundSize: "200% 100%",
          }}
        />
      )}
      <Image
        {...props}
        className={`${className} transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
