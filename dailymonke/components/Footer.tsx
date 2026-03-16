"use client";

interface FooterProps {
  dedicationText?: string;
}

export default function Footer({ dedicationText }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative p-6 md:p-12 border-t border-white/10 bg-deep-void text-center overflow-hidden">
      {/* Ambient gradient mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(212,140,69,0.10) 0%, transparent 60%), radial-gradient(ellipse at 50% 70%, rgba(178,208,230,0.06) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center space-y-8">
        <div className="font-serif text-3xl italic text-golden-orange">
          MonkeBaat
        </div>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-icy-blue to-transparent" />
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-icy-blue/60">
          {dedicationText ??
            "Dedicated to the Preservation of Primates through Digital Documentation"}
        </p>
        <div className="text-[10px] font-mono opacity-40 pt-8">
          © {year} MONKEBAAT. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
