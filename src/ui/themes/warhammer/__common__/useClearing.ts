import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { MathUtils, Vector4 } from "three";

const CLEARING_MAX = 12;

interface ClearingKind {
  selector: string;
  rest: number;
  lit: number;
  glow: number;
  litGlow: number;
  pad: number;
}

const CLEARING_KINDS: readonly ClearingKind[] = [
  { selector: ".ui-card", rest: 0.8, lit: 0.9, glow: 0, litGlow: 0.25, pad: 30 },
  { selector: ".ui-panel", rest: 0.8, lit: 0.8, glow: 0, litGlow: 0, pad: 30 },
  {
    selector: ".ui-button:not(:disabled)",
    rest: 0.4,
    lit: 0.75,
    glow: 0,
    litGlow: 0.2,
    pad: 18,
  },
  { selector: ".ui-link", rest: 0, lit: 0.5, glow: 0, litGlow: 0.12, pad: 12 },
  { selector: ".ui-quote", rest: 0.45, lit: 0.45, glow: 0, litGlow: 0, pad: 20 },
];

interface ClearingState {
  clear: number;
  glow: number;
}

interface ClearingUniforms {
  uClearRect: { value: Vector4[] };
  uClearPower: { value: Vector4[] };
}

export const GLSL_CLEARING = `
uniform vec4 uClearRect[${CLEARING_MAX}];
uniform vec4 uClearPower[${CLEARING_MAX}];

vec4 warhammerClearing(vec2 p, float wobble, float t, out vec2 push) {
  float clear = 0.0;
  float glow = 0.0;
  float shade = 0.0;
  float wall = 0.0;
  push = vec2(0.0);
  for (int i = 0; i < ${CLEARING_MAX}; i++) {
    vec4 pw = uClearPower[i];
    if (pw.x + pw.y < 0.001) continue;
    vec4 rc = uClearRect[i];
    vec2 rd = p - rc.xy;
    vec2 q = abs(rd) - rc.zw;
    float box = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
    float sd = box + wobble * pw.z * 1.5;
    float band = (sd - pw.z * 0.3) / (pw.z * 0.8);
    clear = max(clear, pw.x * (1.0 - smoothstep(-pw.z, pw.z * 1.2, sd)));
    glow = max(glow, pw.y * (1.0 - smoothstep(-pw.z, pw.z * 0.6, sd)));
    shade = max(shade, pw.x * (1.0 - smoothstep(-pw.z, pw.z * 3.0, box)));
    wall = max(wall, max(pw.x, pw.y) * exp(-band * band));
    vec2 n = rd / (rc.zw + pw.z);
    n /= max(length(n), 1.0);
    float turn = sin(t * 0.21 + rc.x * 7.0 + rc.y * 5.0) * 0.8;
    push += (n + vec2(-n.y, n.x) * turn) * pw.x * pw.z * 0.6 * exp(-box * box / (pw.z * pw.z));
  }
  return vec4(clear, glow, shade, wall);
}
`;

export function useClearing(): ClearingUniforms {
  return useMemo(
    () => ({
      uClearRect: { value: Array.from({ length: CLEARING_MAX }, () => new Vector4()) },
      uClearPower: { value: Array.from({ length: CLEARING_MAX }, () => new Vector4()) },
    }),
    [],
  );
}

export function ClearingDriver({
  clearing,
  reducedMotion,
}: {
  clearing: ClearingUniforms;
  reducedMotion: boolean;
}) {
  const states = useMemo(() => new Map<Element, ClearingState>(), []);

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.1);
    const { width, height } = state.size;
    const rects = clearing.uClearRect.value;
    const powers = clearing.uClearPower.value;
    const seen = new Set<Element>();
    let slot = 0;
    for (const kind of CLEARING_KINDS) {
      for (const element of document.querySelectorAll(kind.selector)) {
        const rect = element.getBoundingClientRect();
        const margin = kind.pad * 4;
        if (rect.width === 0 || rect.bottom < -margin || rect.top > height + margin) continue;
        const lit = element.matches(":hover, :focus-visible");
        const prev = states.get(element) ?? { clear: 0, glow: 0 };
        const rate = reducedMotion ? Infinity : lit ? 7 : 2.4;
        const next = {
          clear: MathUtils.damp(prev.clear, lit ? kind.lit : kind.rest, rate, step),
          glow: MathUtils.damp(prev.glow, lit ? kind.litGlow : kind.glow, rate, step),
        };
        states.set(element, next);
        seen.add(element);
        if (slot >= CLEARING_MAX || next.clear + next.glow < 0.001) continue;
        const halfW = rect.width / 2 / height;
        const halfH = rect.height / 2 / height;
        rects[slot].set(
          (rect.left + rect.width / 2 - width / 2) / height,
          (height / 2 - rect.top - rect.height / 2) / height,
          halfW + kind.pad / height,
          halfH + kind.pad / height,
        );
        powers[slot].set(
          next.clear,
          next.glow,
          MathUtils.clamp(Math.min(halfW, halfH) * 1.2 + 0.03, 0.05, 0.1),
          0,
        );
        slot++;
      }
    }
    for (; slot < CLEARING_MAX; slot++) powers[slot].set(0, 0, 1, 0);
    for (const element of states.keys()) {
      if (!seen.has(element)) states.delete(element);
    }
  });

  return null;
}
