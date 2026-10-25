import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { MathUtils, Vector3 } from "three";

const PRESS_MERGE_GAP = 0.35;
const PRESS_MERGE_RADIUS = 0.15;
const PRESS_HOLD_DELAY = 0.15;
const PRESS_SURGE_COUNT = 5;
const PRESS_SURGE_COOLDOWN = 1;

interface PressUniforms {
  uPress: { value: Vector3 };
  uSpark: { value: Vector3 };
  uCharge: { value: Vector3 };
}

interface PressState {
  held: boolean;
  tap: boolean;
  snap: boolean;
  x: number;
  y: number;
}

interface PressRun {
  at: number;
  x: number;
  y: number;
  combo: number;
  cooldown: number;
  hold: number;
  quick: boolean;
  surge: number;
}

export interface PressRef {
  flash: number;
  uniforms: PressUniforms;
  state: PressState;
  run: PressRun;
}

export const GLSL_PRESS = `
uniform vec3 uPress;
uniform vec3 uSpark;
uniform vec3 uCharge;

vec2 warhammerPressDisturb(vec2 p, float k) {
  p = warhammerRippleBend(p, k);
  vec2 cd = p - uCharge.xy;
  p = uCharge.xy + warhammerRotate(cd, uCharge.z * (0.6 + 0.3 * sin(uTime * 3.0)) * k * exp(-dot(cd, cd) * 30.0));
  vec2 vd = p - uPress.xy;
  return uPress.xy + warhammerRotate(vd, uPress.z * 1.8 * k * exp(-dot(vd, vd) * 14.0));
}

float warhammerPressPart(vec2 p) {
  vec2 vd = p - uPress.xy;
  float part = uPress.z * exp(-dot(vd, vd) * 10.0);
  vec2 cd = p - uCharge.xy;
  return part + uCharge.z * 0.35 * exp(-dot(cd, cd) * 25.0) + warhammerRipplePart(p);
}

float warhammerPressFlash(vec2 p) {
  vec2 kd = p - uSpark.xy;
  return uSpark.z * exp(-dot(kd, kd) * 9.0) + warhammerRippleFlash(p);
}
`;

export function usePress(flash: number): PressRef {
  const press = useMemo<PressRef>(
    () => ({
      flash,
      uniforms: {
        uPress: { value: new Vector3() },
        uSpark: { value: new Vector3() },
        uCharge: { value: new Vector3() },
      },
      state: { held: false, tap: false, snap: false, x: 0, y: 0 },
      run: {
        at: -Infinity,
        x: 0,
        y: 0,
        combo: 0,
        cooldown: 0,
        hold: 0,
        quick: false,
        surge: -Infinity,
      },
    }),
    [flash],
  );

  useEffect(() => {
    const state = press.state;
    const toScene = (event: PointerEvent) => {
      const aspect = window.innerWidth / window.innerHeight;
      state.x = (event.clientX / window.innerWidth - 0.5) * aspect;
      state.y = 0.5 - event.clientY / window.innerHeight;
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      toScene(event);
      state.held = true;
      state.tap = true;
      state.snap = true;
    };
    const onMove = (event: PointerEvent) => {
      if (state.held) toScene(event);
    };
    const onUp = () => {
      state.held = false;
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onUp);
    window.addEventListener("blur", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.documentElement.removeEventListener("pointerleave", onUp);
      window.removeEventListener("blur", onUp);
    };
  }, [press]);

  return press;
}

function pressTap(press: PressRef, now: number): void {
  const { flash, uniforms, state, run } = press;
  const spark = uniforms.uSpark.value;
  const quick =
    now - run.at < PRESS_MERGE_GAP &&
    Math.hypot(state.x - run.x, state.y - run.y) < PRESS_MERGE_RADIUS;
  run.at = now;
  run.x = state.x;
  run.y = state.y;
  run.quick = quick;
  if (quick) spark.set(state.x, state.y, Math.min(spark.z + 0.5, 0.8));
  else if (flash > 0) spark.set(state.x, state.y, flash);
  if (quick) {
    if (run.cooldown <= 0) run.combo += 1;
  } else {
    run.combo = run.cooldown > 0 ? 0 : 1;
  }
  if (run.combo >= PRESS_SURGE_COUNT) {
    run.surge = now;
    run.combo = 0;
    run.cooldown = PRESS_SURGE_COOLDOWN;
  }
}

export function PressDriver({ press, reducedMotion }: { press: PressRef; reducedMotion: boolean }) {
  useFrame((frame, delta) => {
    const step = Math.min(delta, 0.1);
    const now = frame.clock.elapsedTime;
    const { uniforms, state, run } = press;
    const v = uniforms.uPress.value;
    const spark = uniforms.uSpark.value;
    const charge = uniforms.uCharge.value;
    if (state.tap) {
      state.tap = false;
      pressTap(press, now);
    }
    run.cooldown = Math.max(run.cooldown - step, 0);
    if (now - run.at > PRESS_MERGE_GAP) run.combo = 0;
    spark.z *= Math.exp(-step * 5);
    const charged = reducedMotion || run.combo < 2 ? 0 : run.combo / PRESS_SURGE_COUNT;
    charge.x = MathUtils.damp(charge.x, run.x, 12, step);
    charge.y = MathUtils.damp(charge.y, run.y, 12, step);
    charge.z = MathUtils.damp(charge.z, charged, charged > charge.z ? 6 : 3, step);
    if (state.snap) {
      state.snap = false;
      if (v.z < 0.02) {
        v.x = state.x;
        v.y = state.y;
      }
    }
    run.hold = state.held ? run.hold + step : 0;
    const strength = run.hold > PRESS_HOLD_DELAY && !reducedMotion ? 1 : 0;
    v.z = MathUtils.damp(v.z, strength, strength > 0 ? 1.6 : 2.4, step);
    if (state.held) {
      v.x = MathUtils.damp(v.x, state.x, 8, step);
      v.y = MathUtils.damp(v.y, state.y, 8, step);
    }
  });

  return null;
}
