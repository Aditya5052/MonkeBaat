import { ImageResponse } from "next/og";
import { getMonkeyBySlug, getAllMonkeys } from "@/lib/monkeys";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllMonkeys().map((m) => ({ slug: m.slug }));
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  LC: { label: "Least Concern", color: "#34d399" },
  NT: { label: "Near Threatened", color: "#fbbf24" },
  VU: { label: "Vulnerable", color: "#f59e0b" },
  EN: { label: "Endangered", color: "#f87171" },
  CR: { label: "Critically Endangered", color: "#ef4444" },
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const monkey = getMonkeyBySlug(slug);

  if (!monkey) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "#0A0C10",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#F0F4F8",
            fontSize: "48px",
          }}
        >
          Not Found
        </div>
      ),
      { ...size },
    );
  }

  const status = STATUS_LABELS[monkey.conservationStatus] ?? {
    label: monkey.conservationStatus,
    color: "#B2D0E6",
  };

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
            background: `linear-gradient(90deg, ${status.color}, #D48C45, ${status.color})`,
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
          MonkeBaat Past Monkes · Specimen A-{monkey.id}
        </span>

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
            marginTop: "16px",
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
            marginTop: "8px",
          }}
        >
          {monkey.scientificName} · {monkey.family}
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "32px",
            padding: "8px 20px",
            borderRadius: "999px",
            border: `1px solid ${status.color}40`,
            background: `${status.color}15`,
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: status.color,
            }}
          />
          <span
            style={{
              fontSize: "14px",
              color: status.color,
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
            }}
          >
            {monkey.conservationStatus} · {status.label}
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            gap: "24px",
            fontSize: "12px",
            color: "rgba(240, 244, 248, 0.3)",
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
          }}
        >
          <span>{monkey.locationName}</span>
          <span>·</span>
          <span>{monkey.coordinates}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
