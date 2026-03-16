import { ImageResponse } from "next/og";
import { getTodaysMonkey, getDayOfYear } from "@/lib/monkeys";

export const runtime = "edge";
export const alt = "MonkeBaat — Daily Primate Discovery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoDataUri =
  "data:image/png;base64,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";

export default async function Image() {
  const monkey = getTodaysMonkey();
  const day = getDayOfYear();

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
        <div
          style={{
            position: "absolute",
            top: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <img
            src={logoDataUri}
            width={32}
            height={32}
            style={{ borderRadius: "50%" }}
          />
          <span
            style={{
              fontSize: "14px",
              color: "rgba(240, 244, 248, 0.5)",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
            }}
          >
            Daily Primate Discovery · Day {day}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              color: "#D48C45",
              fontStyle: "italic",
              lineHeight: 1.1,
              textAlign: "center",
              maxWidth: "900px",
            }}
          >
            {monkey.displayName}
          </span>
          <span
            style={{
              fontSize: "28px",
              color: "rgba(240, 244, 248, 0.8)",
              letterSpacing: "0.05em",
            }}
          >
            {monkey.name}
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "#B2D0E6",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              opacity: 0.6,
            }}
          >
            {monkey.scientificName} · {monkey.family}
          </span>
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
          monkebaat.vercel.app
        </div>
      </div>
    ),
    { ...size },
  );
}
