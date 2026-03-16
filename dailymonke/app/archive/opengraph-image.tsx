import { ImageResponse } from "next/og";
import { getAllMonkeys } from "@/lib/monkeys";

export const runtime = "edge";
export const alt = "Past Monkes — MonkeBaat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const monkeys = getAllMonkeys();

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0C10",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #D48C45, #B2D0E6, #D48C45)",
          }}
        />

        <span
          style={{
            fontSize: "14px",
            color: "rgba(240, 244, 248, 0.4)",
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
            marginBottom: "24px",
          }}
        >
          Zoological Field Catalog
        </span>

        <span
          style={{
            fontSize: "80px",
            color: "#D48C45",
            fontStyle: "italic",
            lineHeight: 1.1,
          }}
        >
          Past Monkes
        </span>

        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "48px",
            alignItems: "center",
          }}
        >
          {monkeys.map((m) => (
            <div
              key={m.slug}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1px solid rgba(212, 140, 69, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  color: "#D48C45",
                }}
              >
                {m.id}
              </div>
              <span
                style={{
                  fontSize: "11px",
                  color: "rgba(178, 208, 230, 0.5)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  maxWidth: "120px",
                  textAlign: "center",
                }}
              >
                {m.displayName}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "12px",
            color: "rgba(240, 244, 248, 0.3)",
            letterSpacing: "0.3em",
            textTransform: "uppercase" as const,
          }}
        >
          monkebaat.vercel.app/archive
        </div>
      </div>
    ),
    { ...size },
  );
}
