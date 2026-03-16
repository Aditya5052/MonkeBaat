interface MonkeLogoProps {
  className?: string;
}

export default function MonkeLogo({ className }: MonkeLogoProps) {
  return (
    <img
      src="/logo.png"
      alt="MonkeBaat"
      className={className ?? "w-full h-full object-contain"}
    />
  );
}
