import type { Monkey } from "@/lib/types";

const STATUS_CONFIG: Record<
  Monkey["conservationStatus"],
  { label: string; bg: string; border: string; text: string }
> = {
  LC: {
    label: "Least Concern",
    bg: "bg-emerald-950/40",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
  },
  NT: {
    label: "Near Threatened",
    bg: "bg-yellow-950/40",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
  },
  VU: {
    label: "Vulnerable",
    bg: "bg-amber-950/40",
    border: "border-amber-500/30",
    text: "text-amber-400",
  },
  EN: {
    label: "Endangered",
    bg: "bg-red-950/40",
    border: "border-red-400/30",
    text: "text-red-400",
  },
  CR: {
    label: "Critically Endangered",
    bg: "bg-red-950/60",
    border: "border-red-500/40",
    text: "text-red-300",
  },
};

interface IUCNBadgeProps {
  status: Monkey["conservationStatus"];
  size?: "sm" | "md";
}

export default function IUCNBadge({ status, size = "sm" }: IUCNBadgeProps) {
  const config = STATUS_CONFIG[status];

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[8px] gap-1.5"
      : "px-3 py-1 text-[10px] gap-2";

  return (
    <span
      className={`inline-flex items-center font-mono uppercase tracking-[0.15em] backdrop-blur-sm border rounded-full ${config.bg} ${config.border} ${config.text} ${sizeClasses}`}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${
          status === "CR" || status === "EN"
            ? "animate-pulse bg-red-400"
            : "bg-current opacity-60"
        }`}
      />
      <span>{status}</span>
      <span className="opacity-50">·</span>
      <span className="opacity-70">{config.label}</span>
    </span>
  );
}
