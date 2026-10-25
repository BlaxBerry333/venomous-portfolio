import * as Stage from "@/ui/shared/stage";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, type RefObject } from "react";

interface StageDebugProbeProps {
  target: RefObject<HTMLElement>;
}

const STAGE_DEBUG_INTERVAL_MS = 500;

export function StageDebugProbe({ target }: StageDebugProbeProps) {
  const tier = Stage.useTier();
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);
  const state = useMemo(() => ({ sum: 0, max: 0, count: 0, last: performance.now() }), []);

  useFrame((_, delta) => {
    const ms = delta * 1000;
    state.sum += ms;
    state.max = Math.max(state.max, ms);
    state.count += 1;
    const now = performance.now();
    if (now - state.last < STAGE_DEBUG_INTERVAL_MS || !target.current) return;
    const avg = state.sum / state.count;
    target.current.textContent = [
      `${(1000 / avg).toFixed(0)} fps`,
      `avg ${avg.toFixed(1)} ms`,
      `max ${state.max.toFixed(1)} ms`,
      `tier ${tier}`,
      `dpr ${dpr.toFixed(2)}`,
      `${Math.round(size.width * dpr)}×${Math.round(size.height * dpr)}`,
    ].join("  ·  ");
    state.sum = 0;
    state.max = 0;
    state.count = 0;
    state.last = now;
  });

  return null;
}
