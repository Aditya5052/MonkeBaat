"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

interface KineticTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  baseDelay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "span" | "p";
}

export default function KineticText({
  text,
  className = "",
  charClassName = "",
  baseDelay = 0.1,
  stagger = 0.03,
  as: Tag = "h2",
}: KineticTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const lines = text.split("\n");
  let charIndex = 0;

  return (
    <Tag ref={ref as React.RefObject<never>} className={className}>
      {lines.map((line, lineIdx) => (
        <span key={lineIdx}>
          {lineIdx > 0 && <br />}
          <span className="no-wrap-heading">
            {line.split("").map((char) => {
              const delay = baseDelay + charIndex * stagger;
              charIndex++;

              if (char === " ") {
                return (
                  <span
                    key={`${lineIdx}-${charIndex}`}
                    style={{
                      display: "inline-block",
                      opacity: isInView ? undefined : 0,
                      animation: isInView
                        ? `charReveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s forwards`
                        : "none",
                    }}
                    className={charClassName}
                  >
                    &nbsp;
                  </span>
                );
              }

              return (
                <span
                  key={`${lineIdx}-${charIndex}`}
                  style={{
                    display: "inline-block",
                    opacity: isInView ? undefined : 0,
                    animation: isInView
                      ? `charReveal 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s forwards`
                      : "none",
                  }}
                  className={charClassName}
                >
                  {char}
                </span>
              );
            })}
          </span>
        </span>
      ))}
    </Tag>
  );
}
