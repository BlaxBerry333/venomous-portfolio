import type { IUniform } from "three";
import type { ImpactSignal } from "./useImpact";

export interface Heat {
  uHeat: IUniform<number>;
  uSurge: IUniform<number>;
}

export const HEAT_SURGE_PEAK = 1;

const HEAT_EASE = 2.5;
const HEAT_SURGE_DECAY = 5;
const HEAT_DEVIL_ABERRATION = 0.012;
const HEAT_DEVIL_SHAKE = 0.12;

export function heatTrack(
  uniforms: Heat,
  state: { heat: number; devil: boolean },
  target: number,
  impact: ImpactSignal,
  dt: number,
) {
  state.heat += (target - state.heat) * (1 - Math.exp(-HEAT_EASE * dt));
  uniforms.uHeat.value = state.heat;
  const devil = target >= 1;
  if (devil && !state.devil) {
    uniforms.uSurge.value = HEAT_SURGE_PEAK;
    impact.aberration = Math.max(impact.aberration, HEAT_DEVIL_ABERRATION);
    impact.shake = Math.max(impact.shake, HEAT_DEVIL_SHAKE);
  }
  state.devil = devil;
  uniforms.uSurge.value *= Math.exp(-HEAT_SURGE_DECAY * dt);
  if (uniforms.uSurge.value < 0.001) uniforms.uSurge.value = 0;
}
