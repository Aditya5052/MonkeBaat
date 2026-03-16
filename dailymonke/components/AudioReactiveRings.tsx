"use client";

import { useRef, useEffect } from "react";
import { motion, useSpring } from "framer-motion";

export default function AudioReactiveRings({
  analyser,
  isPlaying,
}: {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}) {
  const innerScaleRef = useRef(1);
  const outerScaleRef = useRef(1);
  const reqRef = useRef<number>(0);

  const innerSpring = useSpring(1, { damping: 15, stiffness: 200 });
  const outerSpring = useSpring(1, { damping: 12, stiffness: 100 });

  useEffect(() => {
    if (!isPlaying || !analyser) {
      innerSpring.set(1);
      outerSpring.set(1);
      return;
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const update = () => {
      analyser.getByteFrequencyData(dataArray);

      // Calculate average of low frequencies for the inner ring
      let lowSum = 0;
      for (let i = 0; i < 10; i++) lowSum += dataArray[i];
      const lowAvg = lowSum / 10;

      // Calculate average of mid frequencies for the outer ring
      let midSum = 0;
      for (let i = 10; i < 50; i++) midSum += dataArray[i];
      const midAvg = midSum / 40;

      // Map values to scale
      const nextInnerScale = 1 + (lowAvg / 255) * 0.4; // max scale 1.4
      const nextOuterScale = 1 + (midAvg / 255) * 0.6; // max scale 1.6

      innerSpring.set(nextInnerScale);
      outerSpring.set(nextOuterScale);

      reqRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying, analyser, innerSpring, outerSpring]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        title="audio-reactive-inner"
        style={{ scale: innerSpring }}
        className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full border border-golden-orange/40"
      />
      <motion.div
        title="audio-reactive-outer"
        style={{ scale: outerSpring }}
        className="absolute w-56 h-56 md:w-80 md:h-80 rounded-full border border-icy-blue/20"
      />
    </div>
  );
}
