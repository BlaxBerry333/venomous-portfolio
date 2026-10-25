import * as Common from "@/ui/themes/warhammer/__common__";
import * as Utils from "@/utils";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { MathUtils, Vector2, Vector4 } from "three";

const BOLT_MAX = 7;
const BOLT_BRANCHES = [1, 2] as const;
const BOLT_GHOST = 3;
const BOLT_FREE_FROM = 4;
const BOLT_GHOST_FADE = 22;
const BOLT_POINTS = 16;
const BOLT_REFRESH = 0.055;
const BOLT_BURST_LIFE = 0.32;
const BOLT_BURST_REACH = 0.28;
const BOLT_STORM_COUNT = 5;
const BOLT_STORM_GAP = 0.16;
const BOLT_STORM_LIFE = 0.5;

interface LightningUniforms {
  uBolt: { value: Vector2[] };
  uBoltPower: { value: Vector4[] };
}

interface BoltRun {
  life: number;
  max: number;
  strength: number;
  power: number;
  width: number;
  ax: number;
  ay: number;
  bx: number;
  by: number;
  seed: number;
  refresh: number;
}

export const GLSL_LIGHTNING = `
uniform vec2 uBolt[${BOLT_MAX * BOLT_POINTS}];
uniform vec4 uBoltPower[${BOLT_MAX}];

float tzeentchBoltCore = 0.0;
float tzeentchBoltHalo = 0.0;
float tzeentchBoltGlow = 0.0;
float tzeentchBoltNode = 0.0;

float tzeentchBoltSegment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 0.00001), 0.0, 1.0);
  return length(p - a - ab * h);
}

void tzeentchLightning(vec2 p) {
  float live = 0.0;
  for (int b = 0; b < ${BOLT_MAX}; b++) live = max(live, uBoltPower[b].x);
  if (live < 0.001) return;
  float phase = sin(uTime * 0.9) * 8.0 + cos(uTime * 0.53) * 5.0;
  vec2 wob = vec2(stageNoise(vec3(p * 22.0, phase * 0.25)), stageNoise(vec3(p * 22.0 + 7.0, phase * 0.25 + 3.0)));
  vec2 pa = p + wob * 0.0045;
  vec2 pb = p - wob.yx * 0.007;
  float grain = 0.65 + 0.35 * stageNoise(vec3(p * 38.0, phase));
  float breath = 0.75 + 0.25 * stageNoise(vec3(p * 9.0, phase * 0.4));
  for (int b = 0; b < ${BOLT_MAX}; b++) {
    vec4 pw = uBoltPower[b];
    if (pw.x < 0.001) continue;
    float d = 10.0;
    for (int i = 0; i < ${BOLT_POINTS - 1}; i++) {
      d = min(d, tzeentchBoltSegment(p, uBolt[b * ${BOLT_POINTS} + i], uBolt[b * ${BOLT_POINTS} + i + 1]));
    }
    tzeentchBoltHalo += pw.x * breath * pw.y * exp(-d * 38.0) * (0.7 + 0.3 * grain);
    tzeentchBoltGlow += pw.x * pw.y * exp(-d * 5.5);
    if (pw.z > 0.5) {
      vec2 tip = p - uBolt[b * ${BOLT_POINTS} + ${BOLT_POINTS - 1}];
      tzeentchBoltNode += pw.x * exp(-dot(tip, tip) * 1400.0) * breath;
    }
    if (d > 0.03) continue;
    float da = 10.0;
    float db = 10.0;
    for (int i = 0; i < ${BOLT_POINTS - 1}; i++) {
      vec2 a = uBolt[b * ${BOLT_POINTS} + i];
      vec2 c = uBolt[b * ${BOLT_POINTS} + i + 1];
      da = min(da, tzeentchBoltSegment(pa, a, c));
      db = min(db, tzeentchBoltSegment(pb, a, c));
    }
    tzeentchBoltCore += pw.x * grain * (exp(-da * da / (0.0000035 * pw.y)) + 0.55 * exp(-db * db / (0.0000025 * pw.y)));
  }
  tzeentchBoltCore = clamp(tzeentchBoltCore, 0.0, 1.6);
  tzeentchBoltHalo = clamp(tzeentchBoltHalo, 0.0, 1.6);
  tzeentchBoltGlow = clamp(tzeentchBoltGlow, 0.0, 1.2);
  tzeentchBoltNode = clamp(tzeentchBoltNode, 0.0, 1.0);
}

void tzeentchBoltMatter(float layer, inout float dens, inout float lit) {
  float near = tzeentchBoltGlow * mix(0.5, 1.0, layer);
  lit = mix(lit, 1.0, clamp(near, 0.0, 1.0) * 0.6);
  dens *= 1.0 - (tzeentchBoltHalo * 0.35 + tzeentchBoltNode * 0.6) * layer;
}

vec3 tzeentchBoltLight(vec3 col, float transmit) {
  float veil = 0.45 + 0.55 * transmit;
  col += mix(uElectric, uCore, 0.6) * tzeentchBoltGlow * 0.32 * veil;
  col += mix(uElectric, uCore, 0.8) * tzeentchBoltHalo * 0.7 * (0.35 + 0.65 * transmit);
  col += mix(uCore, uWhite, 0.55) * tzeentchBoltCore * 0.85 * (0.2 + 0.8 * transmit * transmit);
  col += mix(uCore, uWhite, 0.4) * tzeentchBoltNode * 0.5 * (0.3 + 0.7 * transmit);
  return col;
}
`;

export function useLightning(): LightningUniforms {
  return useMemo(
    () => ({
      uBolt: { value: Array.from({ length: BOLT_MAX * BOLT_POINTS }, () => new Vector2()) },
      uBoltPower: { value: Array.from({ length: BOLT_MAX }, () => new Vector4()) },
    }),
    [],
  );
}

function boltTrace(points: Vector2[], offset: number, run: BoltRun, amp: number): void {
  const dx = run.bx - run.ax;
  const dy = run.by - run.ay;
  const len = Math.hypot(dx, dy) || 0.001;
  const nx = -dy / len;
  const ny = dx / len;
  let wander = 0;
  for (let i = 0; i < BOLT_POINTS; i++) {
    const t = i / (BOLT_POINTS - 1);
    const envelope = Math.sin(t * Math.PI);
    wander += (Utils.hash(run.seed + i * 3.7) - 0.5) * amp * len;
    const off =
      wander * envelope * 0.35 +
      (Utils.hash(run.seed * 1.3 + i) - 0.5) * amp * len * envelope * 0.2 +
      (Utils.hash(run.seed * 2.1 + i * 7.3) - 0.5) * amp * len * 0.06;
    points[offset + i].set(run.ax + dx * t + nx * off, run.ay + dy * t + ny * off);
  }
}

function boltLaunch(
  runs: BoltRun[],
  points: Vector2[],
  index: number,
  bolt: { life: number; strength: number; width: number; amp: number },
): void {
  const run = runs[index];
  run.life = 0;
  run.max = bolt.life;
  run.strength = bolt.strength;
  run.power = bolt.strength;
  run.width = bolt.width;
  boltTrace(points, index * BOLT_POINTS, run, bolt.amp);
}

function boltFree(runs: BoltRun[]): number {
  for (let i = BOLT_FREE_FROM; i < runs.length; i++) if (runs[i].life < 0) return i;
  return -1;
}

export function LightningDriver({
  lightning,
  press,
  origin,
  reducedMotion,
}: {
  lightning: LightningUniforms;
  press: Common.PressRef;
  origin: Vector2;
  reducedMotion: boolean;
}) {
  const runs = useMemo<BoltRun[]>(
    () =>
      Array.from({ length: BOLT_MAX }, (_, i) => ({
        life: -1,
        max: 1,
        strength: 0,
        power: 0,
        width: i === BOLT_GHOST ? 0.8 : 1,
        ax: 0,
        ay: 0,
        bx: 0,
        by: 0,
        seed: 0,
        refresh: 0,
      })),
    [],
  );
  const state = useMemo(
    () => ({ tap: -Infinity, surge: -Infinity, storm: 0, stormAt: 0, hold: 0 }),
    [],
  );

  useFrame((frame, delta) => {
    const step = Math.min(delta, 0.1);
    const now = frame.clock.elapsedTime;
    const points = lightning.uBolt.value;
    const powers = lightning.uBoltPower.value;
    const hold = press.uniforms.uPress.value;
    const main = runs[0];
    const ghost = runs[BOLT_GHOST];

    const want = reducedMotion ? 0 : hold.z;
    state.hold = MathUtils.damp(state.hold, want, want > state.hold ? 14 : 6, step);
    if (state.hold > 0.02) {
      main.ax = origin.x;
      main.ay = origin.y;
      main.bx = hold.x;
      main.by = hold.y;
      main.refresh -= step;
      if (main.refresh <= 0) {
        if (main.power > 0.05) {
          for (let i = 0; i < BOLT_POINTS; i++) {
            points[BOLT_GHOST * BOLT_POINTS + i].copy(points[i]);
          }
          ghost.power = main.power * 0.7;
        }
        main.refresh = BOLT_REFRESH * (0.6 + Utils.hash(now * 7.1) * 0.8);
        main.seed = now * 13.7;
        boltTrace(points, 0, main, 0.5);
        for (const slot of BOLT_BRANCHES) {
          const branch = runs[slot];
          const from =
            points[
              Math.floor((0.3 + Utils.hash(main.seed + slot * 5.3) * 0.45) * (BOLT_POINTS - 1))
            ];
          const ang = Utils.hash(main.seed + slot * 9.1) * Math.PI * 2;
          const reach = 0.12 + Utils.hash(main.seed + slot * 2.9) * 0.14;
          branch.ax = from.x;
          branch.ay = from.y;
          branch.bx = from.x + Math.cos(ang) * reach;
          branch.by = from.y + Math.sin(ang) * reach;
          branch.seed = main.seed + slot * 31;
          branch.width = 0.5;
          branch.strength = Utils.hash(main.seed + slot * 17.3) > 0.35 ? 0.55 : 0;
          boltTrace(points, slot * BOLT_POINTS, branch, 0.7);
        }
      }
      const flicker = 0.7 + 0.3 * Math.sin(now * 37) * Math.sin(now * 53 + 1.3);
      main.power = state.hold * flicker;
      for (const slot of BOLT_BRANCHES)
        runs[slot].power = runs[slot].strength * state.hold * flicker;
    } else {
      main.power = 0;
      for (const slot of BOLT_BRANCHES) runs[slot].power = 0;
    }
    ghost.power *= Math.exp(-step * BOLT_GHOST_FADE);

    if (press.run.at !== state.tap) {
      state.tap = press.run.at;
      const index = reducedMotion ? -1 : boltFree(runs);
      if (index >= 0) {
        const burst = runs[index];
        const ang = Utils.hash(now * 5.3) * Math.PI * 2;
        burst.ax = press.run.x;
        burst.ay = press.run.y;
        burst.bx = press.run.x + Math.cos(ang) * BOLT_BURST_REACH;
        burst.by = press.run.y + Math.sin(ang) * BOLT_BURST_REACH;
        burst.seed = now * 11.3;
        boltLaunch(runs, points, index, {
          life: BOLT_BURST_LIFE,
          strength: 1,
          width: 0.7,
          amp: 0.8,
        });
      }
    }

    if (press.run.surge !== state.surge) {
      state.surge = press.run.surge;
      if (!reducedMotion) {
        state.storm = BOLT_STORM_COUNT;
        state.stormAt = now;
      }
    }
    if (state.storm > 0 && now >= state.stormAt) {
      const index = boltFree(runs);
      if (index >= 0) {
        const bolt = runs[index];
        const ang = Utils.hash(now * 3.1 + state.storm) * Math.PI * 2;
        const reach = 0.45 + Utils.hash(now * 2.3 + state.storm) * 0.4;
        bolt.ax = origin.x;
        bolt.ay = origin.y;
        bolt.bx = origin.x + Math.cos(ang) * reach;
        bolt.by = origin.y + Math.sin(ang) * reach * 0.7;
        bolt.seed = now * 17.9 + state.storm;
        boltLaunch(runs, points, index, {
          life: BOLT_STORM_LIFE,
          strength: 1.2,
          width: 1,
          amp: 0.55,
        });
        state.storm -= 1;
        state.stormAt = now + BOLT_STORM_GAP;
      }
    }

    for (let i = BOLT_FREE_FROM; i < runs.length; i++) {
      const bolt = runs[i];
      if (bolt.life < 0) continue;
      bolt.life += step;
      if (bolt.life > bolt.max) {
        bolt.life = -1;
        bolt.power = 0;
        continue;
      }
      bolt.refresh -= step;
      if (bolt.refresh <= 0) {
        bolt.refresh = BOLT_REFRESH;
        bolt.seed += 7.7;
        boltTrace(points, i * BOLT_POINTS, bolt, 0.8);
      }
      const k = bolt.life / bolt.max;
      bolt.power = bolt.strength * Math.pow(1 - k, 1.6) * (0.75 + 0.25 * Math.sin(now * 61));
    }

    for (let i = 0; i < runs.length; i++) {
      powers[i].set(runs[i].power, runs[i].width, i === 0 ? 1 : 0, 0);
    }
  });

  return null;
}
