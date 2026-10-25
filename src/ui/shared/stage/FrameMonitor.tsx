import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { TIER_MAX } from "./useTier";

interface FrameMonitorProps {
  tier: number;
  onTier: (tier: number) => void;
  maxFlips?: number;
  maxInclines?: number;
}

const FRAME_WINDOW = 45;
const FRAME_WARMUP = 40;
const FRAME_PROBE_SKIP = 15;
const FRAME_INTERVAL_MIN_MS = 4;
const FRAME_INTERVAL_MAX_MS = 16.7;
const FRAME_SLOW_RATIO = 1.3;
const FRAME_CRAWL_RATIO = 1.8;
const FRAME_FAST_RATIO = 1.05;
const FRAME_SLOW_STREAK = 2;
const FRAME_FAST_STREAK = 3;

export function FrameMonitor({ tier, onTier, maxFlips = 4, maxInclines = 1 }: FrameMonitorProps) {
  const state = useMemo(
    () => ({
      sum: 0,
      count: 0,
      flips: 0,
      inclines: 0,
      slow: 0,
      fast: 0,
      warmup: FRAME_WARMUP,
      probe: Infinity,
      interval: FRAME_INTERVAL_MAX_MS,
    }),
    [],
  );

  useFrame((_, delta) => {
    const ms = Math.min(delta * 1000, 100);
    if (state.warmup > 0) {
      state.warmup -= 1;
      if (state.warmup < FRAME_WARMUP - FRAME_PROBE_SKIP && ms > 0) {
        state.probe = Math.min(state.probe, ms);
      }
      if (state.warmup === 0 && Number.isFinite(state.probe)) {
        state.interval = Math.min(
          Math.max(state.probe, FRAME_INTERVAL_MIN_MS),
          FRAME_INTERVAL_MAX_MS,
        );
      }
      return;
    }
    state.sum += ms;
    state.count += 1;
    if (state.count < FRAME_WINDOW) return;
    const avg = state.sum / state.count;
    state.sum = 0;
    state.count = 0;
    state.slow = avg > state.interval * FRAME_SLOW_RATIO ? state.slow + 1 : 0;
    state.fast = avg < state.interval * FRAME_FAST_RATIO ? state.fast + 1 : 0;
    if (state.flips >= maxFlips) return;
    const crawl = avg > state.interval * FRAME_CRAWL_RATIO;
    if ((crawl || state.slow >= FRAME_SLOW_STREAK) && tier < TIER_MAX) {
      state.flips += 1;
      state.slow = 0;
      state.warmup = 30;
      onTier(tier + 1);
    } else if (state.fast >= FRAME_FAST_STREAK && tier > 0 && state.inclines < maxInclines) {
      state.flips += 1;
      state.inclines += 1;
      state.fast = 0;
      state.warmup = 30;
      onTier(tier - 1);
    }
  });

  return null;
}
