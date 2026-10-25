import * as Utils from "@/utils";
import { useFrame } from "@react-three/fiber";
import type { Vector3 } from "three";

export interface FlashCycle {
  rate: number;
  phase: number;
  sharpness: number;
  jitter: number;
  seed: number;
}

interface FlashDriverProps {
  cycles: readonly FlashCycle[];
  uniforms: { value: Vector3 }[];
  spread: readonly [number, number];
  reducedMotion: boolean;
}

export function FlashDriver({ cycles, uniforms, spread, reducedMotion }: FlashDriverProps) {
  useFrame((state) => {
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    cycles.forEach((cycle, i) => {
      const c = t * cycle.rate + cycle.phase;
      const envelope =
        Math.pow(Math.max(Math.sin(c * Math.PI * 2), 0), cycle.sharpness) *
        (0.6 + 0.4 * Math.sin(t * cycle.jitter));
      const k = Math.floor(c) % 32;
      uniforms[i].value.set(
        (Utils.hash(k + cycle.seed) - 0.5) * spread[0],
        (Utils.hash(k + cycle.seed + 17) - 0.5) * spread[1],
        envelope,
      );
    });
  });

  return null;
}
