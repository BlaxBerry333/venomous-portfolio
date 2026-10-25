import type * as Common from "@/ui/themes/warhammer/__common__";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { Vector4 } from "three";

const RIPPLE_MAX = 5;
const RIPPLE_LIFE = 1.6;
const RIPPLE_SURGE_LIFE = 2.4;

interface RippleUniforms {
  uRipple: { value: Vector4[] };
  uSurge: { value: Vector4 };
}

export const GLSL_RIPPLE = `
uniform vec4 uRipple[${RIPPLE_MAX}];
uniform vec4 uSurge;

vec2 warhammerRippleBend(vec2 p, float k) {
  for (int i = 0; i < ${RIPPLE_MAX}; i++) {
    vec4 rp = uRipple[i];
    if (rp.z < 0.0) continue;
    vec2 rd = p - rp.xy;
    float dist = length(rd);
    float ring = rp.z * 0.5;
    float edge = (dist - ring) / 0.12;
    float env = exp(-edge * edge) * (1.0 - rp.z / ${RIPPLE_LIFE.toFixed(2)});
    p += rd / max(dist, 0.001) * env * 0.045 * rp.w * k;
  }
  if (uSurge.z >= 0.0) {
    vec2 sd = p - uSurge.xy;
    float surgeDistance = length(sd);
    float surgeEdge = (surgeDistance - uSurge.z * 0.7) / 0.2;
    float surgeEnvelope = exp(-surgeEdge * surgeEdge) * (1.0 - uSurge.z / ${RIPPLE_SURGE_LIFE.toFixed(2)});
    p += sd / max(surgeDistance, 0.001) * surgeEnvelope * 0.12 * uSurge.w * k;
  }
  return p;
}

float warhammerRipplePart(vec2 p) {
  if (uSurge.z < 0.0) return 0.0;
  float fade = 1.0 - uSurge.z / ${RIPPLE_SURGE_LIFE.toFixed(2)};
  float surgeDistance = length(p - uSurge.xy);
  return uSurge.w * fade * fade * (1.0 - smoothstep(uSurge.z * 0.45, uSurge.z * 0.7 + 0.15, surgeDistance));
}

float warhammerRippleFlash(vec2 p) {
  float f = 0.0;
  for (int i = 0; i < ${RIPPLE_MAX}; i++) {
    vec4 rp = uRipple[i];
    if (rp.z < 0.0) continue;
    vec2 rd = p - rp.xy;
    f += exp(-dot(rd, rd) * 9.0) * exp(-rp.z * 5.0);
  }
  if (uSurge.z >= 0.0) {
    vec2 sd = p - uSurge.xy;
    f += 1.6 * exp(-uSurge.z * 2.5) * exp(-dot(sd, sd) * 3.0);
  }
  return f;
}
`;

export function useRipple(): RippleUniforms {
  return useMemo(
    () => ({
      uRipple: { value: Array.from({ length: RIPPLE_MAX }, () => new Vector4(0, 0, -1, 0)) },
      uSurge: { value: new Vector4(0, 0, -1, 0) },
    }),
    [],
  );
}

function rippleYoungest(ripples: Vector4[]): Vector4 | null {
  let youngest: Vector4 | null = null;
  for (const r of ripples) {
    if (r.z >= 0 && (youngest === null || r.z < youngest.z)) youngest = r;
  }
  return youngest;
}

function rippleSlot(ripples: Vector4[]): Vector4 {
  let slot = ripples[0];
  for (const r of ripples) {
    if (r.z < 0) return r;
    if (r.z > slot.z) slot = r;
  }
  return slot;
}

export function RippleDriver({
  ripple,
  press,
  reducedMotion,
}: {
  ripple: RippleUniforms;
  press: Common.PressRef;
  reducedMotion: boolean;
}) {
  const seen = useMemo(() => ({ tap: -Infinity, surge: -Infinity }), []);

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.1);
    const ripples = ripple.uRipple.value;
    const surge = ripple.uSurge.value;
    const run = press.run;
    if (run.at !== seen.tap) {
      seen.tap = run.at;
      const youngest = run.quick ? rippleYoungest(ripples) : null;
      if (youngest) {
        if (!reducedMotion) youngest.w = Math.min(youngest.w + 0.5, 2);
      } else {
        rippleSlot(ripples).set(run.x, run.y, 0, reducedMotion ? 0 : 1);
      }
    }
    if (run.surge !== seen.surge) {
      seen.surge = run.surge;
      surge.set(run.x, run.y, 0, reducedMotion ? 0 : 1);
    }
    for (const r of ripples) {
      if (r.z < 0) continue;
      r.z += step;
      if (r.z > RIPPLE_LIFE) r.z = -1;
    }
    if (surge.z >= 0) {
      surge.z += step;
      if (surge.z > RIPPLE_SURGE_LIFE) surge.z = -1;
    }
  });

  return null;
}
