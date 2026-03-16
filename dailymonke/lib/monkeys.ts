import type { Monkey } from "./types";
import monkeysData from "../data/monkeys.json";

const monkeys: Monkey[] = monkeysData as Monkey[];

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
const START_DATE = Date.UTC(2026, 2, 1); // March 1, 2026 00:00 IST (expressed as a day boundary)
const MS_PER_DAY = 86_400_000;

function todayIST(): number {
  const nowMs = Date.now() + IST_OFFSET_MS;
  const d = new Date(nowMs);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function todayIndex(): number {
  return Math.floor((todayIST() - START_DATE) / MS_PER_DAY);
}

export function getAllMonkeys(): Monkey[] {
  return monkeys;
}

export function getTodaysMonkey(): Monkey {
  const idx = Math.min(Math.max(todayIndex(), 0), monkeys.length - 1);
  return monkeys[idx];
}

export function getPastMonkeys(): Monkey[] {
  const idx = todayIndex();
  return monkeys.slice(0, Math.max(idx, 0));
}

export function getReleasedMonkeys(): Monkey[] {
  const idx = todayIndex();
  return monkeys.slice(0, Math.min(idx + 1, monkeys.length));
}

export function isMonkeyReleased(slug: string): boolean {
  const released = getReleasedMonkeys();
  return released.some((m) => m.slug === slug);
}

export function getMonkeyBySlug(slug: string): Monkey | undefined {
  return monkeys.find((m) => m.slug === slug);
}

export function getMonkeyDateString(index: number): string {
  return new Date(START_DATE + index * MS_PER_DAY).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric", timeZone: "Asia/Kolkata" },
  );
}

export function getDayOfYear(): number {
  return todayIndex();
}

export function getMonkeyByIndex(index: number): Monkey {
  const len = monkeys.length;
  return monkeys[((index % len) + len) % len];
}

export function getAdjacentMonkeys(
  slug: string,
): { prev: Monkey | null; next: Monkey | null } {
  const released = getReleasedMonkeys();
  const idx = released.findIndex((m) => m.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? released[idx - 1] : null,
    next: idx < released.length - 1 ? released[idx + 1] : null,
  };
}
