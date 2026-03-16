"use client";

import { useEffect, useRef, useCallback } from "react";

interface AudioWaveformProps {
  analyser: AnalyserNode | null;
  active: boolean;
}

export default function AudioWaveform({ analyser, active }: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  const draw = useCallback(() => {
    if (!activeRef.current || !analyser) {
      animRef.current = null;
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const baseRadius = Math.min(w, h) * 0.25;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, w, h);

    const sliceCount = Math.min(bufferLength, 128);
    const angleStep = (Math.PI * 2) / sliceCount;

    // Outer waveform ring (golden)
    ctx.beginPath();
    for (let i = 0; i <= sliceCount; i++) {
      const idx = i % sliceCount;
      const v = dataArray[idx] / 255;
      const r = baseRadius + v * baseRadius * 0.8;
      const angle = idx * angleStep - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(212, 140, 69, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner mirror ring (icy blue, inverted)
    ctx.beginPath();
    for (let i = 0; i <= sliceCount; i++) {
      const idx = i % sliceCount;
      const v = dataArray[idx] / 255;
      const r = baseRadius - v * baseRadius * 0.3;
      const angle = idx * angleStep - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(178, 208, 230, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    animRef.current = requestAnimationFrame(draw);
  }, [analyser]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const onResize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (active && analyser) {
      if (!animRef.current) draw();
    } else if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
  }, [active, analyser, draw]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
