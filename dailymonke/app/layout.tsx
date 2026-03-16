import type { Metadata } from "next";
import { DM_Serif_Display, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import CursorFollower from "@/components/CursorFollower";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MonkeBaat — Daily Primate Discovery",
    template: "%s | MonkeBaat",
  },
  description:
    "A new primate species every day. Explore the diversity of primates through cinematic documentation.",
  metadataBase: new URL("https://monkebaat.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MonkeBaat",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSerifDisplay.variable} ${jetbrainsMono.variable} ${inter.variable} antialiased`}
      >
        <SmoothScroll>
          <ScrollProgress />
          <CursorFollower />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
