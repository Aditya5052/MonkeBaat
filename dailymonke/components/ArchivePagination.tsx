"use client";

import MagneticButton from "./MagneticButton";

export default function ArchivePagination() {
  return (
    <section className="py-32 flex flex-col items-center justify-center">
      <div className="w-px h-24 bg-gradient-to-b from-transparent via-golden-orange/40 to-transparent mb-12" />

      <MagneticButton>
        <div className="relative z-10 w-48 h-48 rounded-full flex items-center justify-center glass-card hover:bg-white/5 transition-colors group">
          <div className="text-center">
            <svg
              className="w-8 h-8 text-golden-orange mx-auto mb-2 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span className="block font-mono text-[8px] tracking-[0.3em] text-icy-blue uppercase px-4">
              Retrieve Historical Data
            </span>
          </div>

          <svg
            className="absolute inset-0 w-full h-full p-4 pointer-events-none"
            viewBox="0 0 100 100"
          >
            <circle
              className="text-golden-orange/30 animate-[spin_20s_linear_infinite]"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeDasharray="5 2"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      </MagneticButton>

      <p className="mt-12 font-mono text-[10px] tracking-[0.4em] uppercase opacity-40">
        End of Catalog Sequence
      </p>
    </section>
  );
}
