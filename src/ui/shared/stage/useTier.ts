import { createContext, useContext } from "react";

export const TIER_MAX = 2;

export const TierContext = createContext(0);

export function useTier(): number {
  return useContext(TierContext);
}

export function tierDpr(tier: number, maxDpr: number): number {
  if (tier >= 2) return 0.75;
  if (tier === 1) return 1;
  return maxDpr;
}

const TIER_STORAGE_KEY = "portfolio-scene-tier";

export function tierRead(): number {
  try {
    const raw = window.localStorage.getItem(TIER_STORAGE_KEY);
    if (raw === null) return 0;
    const value = Number(raw);
    return Number.isInteger(value) && value >= 0 && value <= TIER_MAX ? value : 0;
  } catch {
    return 0;
  }
}

export function tierWrite(tier: number): void {
  try {
    window.localStorage.setItem(TIER_STORAGE_KEY, String(tier));
  } catch {
    return;
  }
}

export function tierForget(): void {
  try {
    window.localStorage.removeItem(TIER_STORAGE_KEY);
  } catch {
    return;
  }
}
