"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Monkey } from "@/lib/types";
import NeutrinoCanvas from "./NeutrinoCanvas";
import AudioWaveform from "./AudioWaveform";
import MagneticButton from "./MagneticButton";
import AudioReactiveRings from "./AudioReactiveRings";

interface AudioSectionProps {
  monkey: Monkey;
}

export default function AudioSection({ monkey }: AudioSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isPlayingRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const emitAudioState = useCallback((playing: boolean) => {
    window.dispatchEvent(
      new CustomEvent("monke-audio", { detail: { playing } })
    );
  }, []);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.volume = 1;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    emitAudioState(false);
  }, [emitAudioState]);

  useEffect(() => {
    const handleScroll = () => {
      if (!isPlayingRef.current || !sectionRef.current || !audioRef.current) return;

      // Traverse up to the SectionCard container:
      // section → motion.div (sticky) → div.relative (SectionCard container)
      const container =
        sectionRef.current.parentElement?.parentElement;
      if (!container) return;

      const containerBottom = container.getBoundingClientRect().bottom;
      const vh = window.innerHeight;
      const fadeStart = vh * 1.2;

      if (containerBottom >= fadeStart) {
        audioRef.current.volume = 1;
        return;
      }

      if (containerBottom <= 0) {
        stopPlayback();
        return;
      }

      audioRef.current.volume = Math.max(
        0,
        Math.min(1, containerBottom / fadeStart)
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [stopPlayback]);

  const ensureAudioContext = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return;
    const src = audioRef.current.currentSrc || audioRef.current.src;
    const isSameOrigin =
      src &&
      new URL(src, window.location.href).origin === window.location.origin;
    if (!isSameOrigin) return;
    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(audioRef.current);
      const node = ctx.createAnalyser();
      node.fftSize = 256;
      source.connect(node);
      node.connect(ctx.destination);
      audioCtxRef.current = ctx;
      setAnalyser(node);
    } catch {
      // Web Audio unavailable — waveform won't render, audio still plays natively
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || !analyser) return;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let rafId: number;
    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length / 255;
      window.dispatchEvent(
        new CustomEvent("monke-audio-intensity", { detail: { intensity: avg } })
      );
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, analyser]);

  const togglePlay = async () => {
    const next = !isPlaying;
    setIsPlaying(next);
    isPlayingRef.current = next;
    emitAudioState(next);

    if (!audioRef.current) return;

    if (next) {
      ensureAudioContext();
      if (audioCtxRef.current) audioCtxRef.current.resume();
      audioRef.current.volume = 1;
      try {
        await audioRef.current.play();
      } catch {
        setIsPlaying(false);
        isPlayingRef.current = false;
        emitAudioState(false);
      }
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative pt-20 pb-20 md:pt-32 md:pb-32 bg-deep-void overflow-hidden flex flex-col justify-center"
    >
      <NeutrinoCanvas active={isPlaying} />
      <AudioWaveform analyser={analyser} active={isPlaying} />

      <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
        <h2 className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-golden-orange mb-16">
          Listen to their call
        </h2>

        <div className="relative flex justify-center items-center py-12">
          {/* Ambient gradient mesh behind play button */}
          <div
            className="absolute -inset-32 z-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(212,140,69,0.35) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(178,208,230,0.14) 0%, transparent 60%)",
              filter: "blur(80px)",
            }}
          />
          {/* Static decorative concentric rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
            <div className="absolute w-64 h-64 rounded-full border border-golden-orange/20 animate-pulse-slow" />
            <div className="absolute w-[260px] h-[260px] md:w-[360px] md:h-[360px] rounded-full border border-golden-orange/[0.15]" />
            <div className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full border border-golden-orange/[0.10]" />
            <div className="absolute w-[540px] h-[540px] md:w-[640px] md:h-[640px] rounded-full border border-golden-orange/[0.08]" />
          </div>
          {/* Audio reactive rings */}
          <AudioReactiveRings analyser={analyser} isPlaying={isPlaying} />

          {/* Play button */}
          <MagneticButton className="relative z-10" onClick={togglePlay}>
          <div
            className="w-36 h-36 md:w-48 md:h-48 rounded-full flex items-center justify-center glass-card hover:bg-white/5 transition-colors group"
          >
            <div className="text-center">
              {isPlaying ? (
                <svg
                  className="w-8 h-8 text-golden-orange mx-auto mb-2 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8 text-golden-orange mx-auto mb-2 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
              <span className="block font-mono text-[10px] tracking-widest text-icy-blue">
                {isPlaying ? "PAUSE CALL" : "PLAY CALL"}
              </span>
            </div>

            {/* Spinning dashed circle */}
            <svg
              className="absolute inset-0 w-full h-full p-4 pointer-events-none"
              viewBox="0 0 100 100"
            >
              <circle
                className="text-golden-orange/50 animate-[spin_20s_linear_infinite]"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeDasharray="5 2"
                strokeWidth="0.8"
              />
            </svg>
          </div>
          </MagneticButton>
        </div>

        <p className="font-serif text-xl md:text-2xl italic mt-16 md:mt-20 text-icy-blue/80">
          &ldquo;{monkey.audioQuote}&rdquo;
        </p>
        <p className="font-mono text-[10px] text-icy-blue/60 mt-2 uppercase tracking-[0.15em]">
          {monkey.audioMeta}
        </p>
      </div>

      {(monkey.soundUrl || monkey.soundUrlMp3) && (
        <audio
          ref={audioRef}
          preload="metadata"
          loop
          src={monkey.soundUrlMp3 || monkey.soundUrl}
        />
      )}
    </section>
  );
}
