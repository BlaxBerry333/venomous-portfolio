import type * as Stage from "@/ui/shared/stage";
import * as Common from "@/ui/themes/dmc/__common__";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { BufferAttribute, BufferGeometry, DynamicDrawUsage, MathUtils } from "three";

const REBELLION_POINTS = 24;
const REBELLION_ARC_MAX = 8;
const REBELLION_ARC_LAYERS = 4;
const REBELLION_THRUST_MAX = 22;
const REBELLION_SWING_MAX = 3;
const REBELLION_THRUST_INDEX = REBELLION_ARC_MAX * REBELLION_ARC_LAYERS;
const REBELLION_SWING_INDEX = REBELLION_THRUST_INDEX + REBELLION_THRUST_MAX;
const REBELLION_STRIP_MAX = REBELLION_SWING_INDEX + REBELLION_SWING_MAX;
const REBELLION_BOLT_MAX = 28;
const REBELLION_BOLT_POINTS = 20;
const REBELLION_COMBO = [
  {
    angle: 0.12,
    curve: 0.5,
    length: 5.4,
    width: 0.42,
    sparks: 14,
    shake: 0.015,
    aberration: 0.0027,
    hit: 0.5,
  },
  {
    angle: Math.PI - 0.3,
    curve: -0.6,
    length: 5.8,
    width: 0.46,
    sparks: 16,
    shake: 0.025,
    aberration: 0.0033,
    hit: 0.5,
  },
  {
    angle: -Math.PI / 2 + 0.15,
    curve: 0.85,
    length: 6.6,
    width: 0.62,
    sparks: 28,
    shake: 0.08,
    aberration: 0.006,
    hit: 1,
  },
  {
    angle: Math.PI / 2 - 0.2,
    curve: -0.75,
    length: 5.2,
    width: 0.5,
    sparks: 22,
    shake: 0.04,
    aberration: 0.0042,
    hit: 1,
  },
];
const REBELLION_ARC_SWEEP = 0.06;
const REBELLION_ARC_LIFE = 0.34;
const REBELLION_DRIVE_SPEED = 13;
const REBELLION_DRIVE_LIFE = 0.75;
const REBELLION_DRIVE_ECHO_LAG = 0.035;
const REBELLION_THRUST_EXTEND = 0.06;
const REBELLION_MILLION = {
  normal: {
    count: 10,
    spread: 0.6,
    side: 2.6,
    length: 7,
    width: 0.62,
    shake: 0.18,
    aberration: 0.012,
    bolts: 4,
    reach: 3.2,
    surge: 0,
  },
  devil: {
    count: 20,
    spread: 0.9,
    side: 3.4,
    length: 7,
    width: 0.75,
    shake: 0.27,
    aberration: 0.018,
    bolts: 7,
    reach: 4.2,
    surge: Common.HEAT_SURGE_PEAK,
  },
};
const REBELLION_STAB_TIME = 0.544;
const REBELLION_STAB_LIFE = 0.26;
const REBELLION_STAB_REACH = 1.3;
const REBELLION_FINALE_AT = REBELLION_STAB_TIME + 0.08;
const REBELLION_FINALE_LIFE = 0.5;
const REBELLION_LOCK = REBELLION_FINALE_AT + 0.25;
const REBELLION_FINALE_POINTS = Common.STYLE_FINISHER_POINTS / 2;
const REBELLION_SWING_START_PX = 1100;
const REBELLION_SWING_KEEP_PX = 650;
const REBELLION_SWING_LIFE = 0.22;
const REBELLION_SWING_WIDTH = 0.3;
const REBELLION_WIDTH_SCALE = { normal: 0.75, devil: 1.15 };
const REBELLION_SWING_STEP = 0.2;
const REBELLION_SPARK_MAX = 420;
const REBELLION_SPARK_LIFE = 0.6;
const REBELLION_BOLT_LIFE = 0.2;
const REBELLION_BOLT_FLICKER = 0.045;
const REBELLION_CRACKLE_LIFE = 0.16;

type RebellionMove = (typeof REBELLION_COMBO)[number];

interface RebellionArc {
  x: number;
  y: number;
  ux: number;
  uy: number;
  vx: number;
  vy: number;
  length: number;
  curve: number;
  width: number;
  life: number;
  echoes: number;
  age: number;
  alive: boolean;
}

interface RebellionThrust {
  x: number;
  y: number;
  ux: number;
  uy: number;
  length: number;
  width: number;
  life: number;
  age: number;
  sparks: number;
  shake: number;
  bolts: number;
  reach: number;
  aberration: number;
  surge: number;
  points: number;
  fired: boolean;
  alive: boolean;
}

interface RebellionSwing {
  xs: Float32Array;
  ys: Float32Array;
  ts: Float32Array;
  count: number;
}

interface RebellionBolt {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  life: number;
  age: number;
  flicker: number;
  glow: number;
  pts: Float32Array;
  alive: boolean;
}

function rebellionArcPoint(arc: RebellionArc, t: number, cx: number, cy: number) {
  const along = (t - 0.5) * arc.length;
  const bend = arc.curve * (1 - (2 * t - 1) ** 2);
  return {
    x: cx + arc.ux * along - arc.uy * bend,
    y: cy + arc.uy * along + arc.ux * bend,
  };
}

function rebellionBoltShape(bolt: RebellionBolt) {
  const dx = bolt.x2 - bolt.x1;
  const dy = bolt.y2 - bolt.y1;
  const len = Math.hypot(dx, dy) || 1;
  for (let i = 0; i < REBELLION_BOLT_POINTS; i++) {
    const t = i / (REBELLION_BOLT_POINTS - 1);
    const envelope = Math.sin(Math.PI * t);
    const off = ((Math.random() - 0.5) * 0.12 + (Math.random() - 0.5) * 0.05) * len * envelope;
    bolt.pts[i * 2] = bolt.x1 + dx * t - (dy / len) * off;
    bolt.pts[i * 2 + 1] = bolt.y1 + dy * t + (dx / len) * off;
  }
  bolt.glow = 0.8 + Math.random() * 0.2;
}

export function Rebellion({
  input,
  reducedMotion,
  colors,
  styleSignal,
  impact,
  heat,
}: {
  input: Stage.InputRef;
  reducedMotion: boolean;
  colors: Common.StrokeColors;
  styleSignal: Common.StyleSignal;
  impact: Common.ImpactSignal;
  heat: Common.Heat;
}) {
  const size = useThree((state) => state.size);
  const state = useMemo(
    () => ({
      arcs: Array.from({ length: REBELLION_ARC_MAX }, () => ({
        x: 0,
        y: 0,
        ux: 1,
        uy: 0,
        vx: 0,
        vy: 0,
        length: 0,
        curve: 0,
        width: 0,
        life: 1,
        echoes: 0,
        age: 0,
        alive: false,
      })) as RebellionArc[],
      arcCursor: 0,
      thrusts: Array.from({ length: REBELLION_THRUST_MAX }, () => ({
        x: 0,
        y: 0,
        ux: 1,
        uy: 0,
        length: 0,
        width: 0,
        life: 1,
        age: 0,
        sparks: 0,
        shake: 0,
        bolts: 0,
        reach: 0,
        aberration: 0,
        surge: 0,
        points: 0,
        fired: true,
        alive: false,
      })) as RebellionThrust[],
      thrustCursor: 0,
      swings: Array.from({ length: REBELLION_SWING_MAX }, () => ({
        xs: new Float32Array(REBELLION_POINTS),
        ys: new Float32Array(REBELLION_POINTS),
        ts: new Float32Array(REBELLION_POINTS),
        count: 0,
      })) as RebellionSwing[],
      swingCursor: 0,
      swingActive: -1,
      bolts: Array.from({ length: REBELLION_BOLT_MAX }, () => ({
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        width: 0,
        life: 1,
        age: 0,
        flicker: 0,
        glow: 0,
        pts: new Float32Array(REBELLION_BOLT_POINTS * 2),
        alive: false,
      })) as RebellionBolt[],
      boltCursor: 0,
      sparkPos: new Float32Array(REBELLION_SPARK_MAX * 3),
      sparkVel: new Float32Array(REBELLION_SPARK_MAX * 3),
      sparkLife: new Float32Array(REBELLION_SPARK_MAX),
      sparkCursor: 0,
      sparksLive: false,
      xs: new Float32Array(REBELLION_POINTS),
      ys: new Float32Array(REBELLION_POINTS),
      ws: new Float32Array(REBELLION_POINTS),
      as: new Float32Array(REBELLION_POINTS),
      heat: 0,
      devil: false,
      clicks: 0,
      lastClickAt: -10,
      lockUntil: 0,
      pointer: Common.createPointerTracker(),
      clock: 0,
      drawn: false,
    }),
    [],
  );

  const strokes = useMemo(
    () => Common.createRibbonGeometry(REBELLION_POINTS, REBELLION_STRIP_MAX),
    [],
  );
  const boltStrokes = useMemo(
    () => Common.createRibbonGeometry(REBELLION_BOLT_POINTS, REBELLION_BOLT_MAX),
    [],
  );
  const stroke = useMemo(() => Common.createStrokeMaterial(colors), []);
  const sparks = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = new BufferAttribute(state.sparkPos, 3);
    const lives = new BufferAttribute(state.sparkLife, 1);
    positions.setUsage(DynamicDrawUsage);
    lives.setUsage(DynamicDrawUsage);
    geometry.setAttribute("position", positions);
    geometry.setAttribute("aLife", lives);
    return { geometry, material: Common.createSparkMaterial(colors), positions, lives };
  }, [state]);

  useEffect(() => {
    stroke.uniforms.uAccent.value = colors.accent;
    stroke.uniforms.uHot.value = colors.hot;
    sparks.material.uniforms.uAccent.value = colors.accent;
    sparks.material.uniforms.uHot.value = colors.hot;
  }, [colors, stroke, sparks]);

  useEffect(
    () => () => {
      strokes.geometry.dispose();
      boltStrokes.geometry.dispose();
      stroke.dispose();
      sparks.geometry.dispose();
      sparks.material.dispose();
    },
    [strokes, boltStrokes, stroke, sparks],
  );

  const actions = useMemo(() => {
    const sparkBurst = (
      x: number,
      y: number,
      count: number,
      ux: number,
      uy: number,
      speed: number,
      spread: number,
    ) => {
      const total = Math.round(count * (1 + state.heat));
      for (let i = 0; i < total; i++) {
        const c = state.sparkCursor;
        state.sparkCursor = (c + 1) % REBELLION_SPARK_MAX;
        const kick = (Math.random() - 0.5) * spread;
        const push = speed * (0.4 + Math.random() * 0.8);
        state.sparkPos[c * 3] = x;
        state.sparkPos[c * 3 + 1] = y;
        state.sparkVel[c * 3] = ux * push - uy * kick;
        state.sparkVel[c * 3 + 1] = uy * push + ux * kick + 1;
        state.sparkLife[c] = 1;
      }
      state.sparksLive = true;
    };
    const bolt = (x1: number, y1: number, x2: number, y2: number, width: number, life: number) => {
      const b = state.bolts[state.boltCursor];
      state.boltCursor = (state.boltCursor + 1) % REBELLION_BOLT_MAX;
      Object.assign(b, { x1, y1, x2, y2, width, life, age: 0, flicker: 0, alive: true });
      rebellionBoltShape(b);
    };
    const crackle = (x: number, y: number, count: number) => {
      if (!state.devil) return;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const len = 1.2 + Math.random() * 1.2;
        bolt(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len, 0.035, REBELLION_CRACKLE_LIFE);
      }
    };
    const bladeBolts = (arc: RebellionArc, cx: number, cy: number) => {
      if (!state.devil) return;
      const side = Math.sign(arc.curve) || 1;
      const nx = -arc.uy * side;
      const ny = arc.ux * side;
      const lift = arc.width * 0.9;
      for (let k = 0; k < 3; k++) {
        const p1 = rebellionArcPoint(arc, k / 3, cx, cy);
        const p2 = rebellionArcPoint(arc, (k + 1) / 3 + 0.05, cx, cy);
        const o1 = lift * (0.6 + Math.random() * 0.8);
        const o2 = lift * (0.6 + Math.random() * 0.8);
        bolt(
          p1.x + nx * o1,
          p1.y + ny * o1,
          p2.x + nx * o2,
          p2.y + ny * o2,
          0.06,
          REBELLION_BOLT_LIFE,
        );
      }
      for (let k = 0; k < 2; k++) {
        const p = rebellionArcPoint(arc, 0.2 + Math.random() * 0.6, cx, cy);
        const a = Math.atan2(ny, nx) + (Math.random() - 0.5) * 1.2;
        const len = 0.8 + Math.random() * 0.6;
        bolt(p.x, p.y, p.x + Math.cos(a) * len, p.y + Math.sin(a) * len, 0.04, REBELLION_BOLT_LIFE);
      }
    };
    const thrustBolts = (
      x: number,
      y: number,
      ux: number,
      uy: number,
      count: number,
      reach: number,
    ) => {
      if (!state.devil) return;
      for (let i = 0; i < count; i++) {
        const a = Math.atan2(uy, ux) + (Math.random() - 0.5) * 0.8;
        const len = reach * (0.7 + Math.random() * 0.6);
        bolt(
          x,
          y,
          x + Math.cos(a) * len,
          y + Math.sin(a) * len,
          0.03 + 0.012 * reach,
          REBELLION_BOLT_LIFE,
        );
      }
    };
    const widthScale = () =>
      state.devil ? REBELLION_WIDTH_SCALE.devil : REBELLION_WIDTH_SCALE.normal;
    return { sparkBurst, bolt, crackle, bladeBolts, thrustBolts, widthScale };
  }, [state]);

  useEffect(() => {
    if (reducedMotion) return;
    const { sparkBurst, crackle, bladeBolts, widthScale } = actions;
    const spawnArc = (props: Omit<RebellionArc, "age" | "alive">) => {
      const arc = state.arcs[state.arcCursor];
      state.arcCursor = (state.arcCursor + 1) % REBELLION_ARC_MAX;
      Object.assign(arc, props, { age: 0, alive: true });
      return arc;
    };
    const spawnCombo = (x: number, y: number, move: RebellionMove) => {
      const angle = move.angle + (Math.random() - 0.5) * 0.3;
      const arc = spawnArc({
        x,
        y,
        ux: Math.cos(angle),
        uy: Math.sin(angle),
        vx: 0,
        vy: 0,
        length: move.length,
        curve: move.curve,
        width: move.width * widthScale(),
        life: REBELLION_ARC_LIFE,
        echoes: 0,
      });
      for (let i = 0; i < move.sparks; i++) {
        const p = rebellionArcPoint(arc, Math.random(), x, y);
        sparkBurst(p.x, p.y, 1, arc.ux, arc.uy, 3, 3);
      }
      const hit = rebellionArcPoint(arc, move.hit, x, y);
      bladeBolts(arc, x, y);
      crackle(hit.x, hit.y, 2);
      impact.shake = Math.max(impact.shake, move.shake);
      impact.aberration = Math.max(impact.aberration, move.aberration);
      styleSignal.points += Common.STYLE_CLICK_POINTS;
    };
    const spawnThrust = (props: Omit<RebellionThrust, "fired" | "alive">) => {
      const thrust = state.thrusts[state.thrustCursor];
      state.thrustCursor = (state.thrustCursor + 1) % REBELLION_THRUST_MAX;
      Object.assign(thrust, props, { fired: false, alive: true });
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || state.clock < state.lockUntil) return;
      const { x, y } = Common.pointerToScene(state.pointer, event);
      Common.pointerPress(state.pointer, x, y);
    };
    const onClick = (x: number, y: number) => {
      const hit = Common.styleComboHit(state, state.clock);
      if (hit >= Common.STYLE_FINISHER_CLICKS) {
        state.lockUntil = state.clock + REBELLION_LOCK;
        const angle = (Math.random() < 0.5 ? 0 : Math.PI) + (Math.random() - 0.5) * 0.24;
        const ux = Math.cos(angle);
        const uy = Math.sin(angle);
        const form = REBELLION_MILLION[state.devil ? "devil" : "normal"];
        for (let s = 0; s < form.count; s++) {
          const jitter = angle + (Math.random() - 0.5) * form.spread;
          const side = (Math.random() - 0.5) * form.side;
          const back = 0.3 + Math.random() * 0.9;
          spawnThrust({
            x: x - ux * back - uy * side,
            y: y - uy * back + ux * side,
            ux: Math.cos(jitter),
            uy: Math.sin(jitter),
            length: 2 + Math.random() * 1.4,
            width: (0.2 + Math.random() * 0.12) * widthScale(),
            life: REBELLION_STAB_LIFE,
            age: (-s * REBELLION_STAB_TIME) / form.count,
            sparks: 3,
            shake: 0.015,
            bolts: s % 4 === 3 ? 1 : 0,
            reach: REBELLION_STAB_REACH,
            aberration: 0,
            surge: 0,
            points: 0,
          });
        }
        spawnThrust({
          x: x - ux * 1.2,
          y: y - uy * 1.2,
          ux,
          uy,
          length: form.length,
          width: form.width * widthScale(),
          life: REBELLION_FINALE_LIFE,
          age: -REBELLION_FINALE_AT,
          sparks: 50,
          shake: form.shake,
          bolts: form.bolts,
          reach: form.reach,
          aberration: form.aberration,
          surge: form.surge,
          points: REBELLION_FINALE_POINTS,
        });
        return;
      }
      spawnCombo(x, y, REBELLION_COMBO[(hit - 1) % REBELLION_COMBO.length]);
    };
    const onUp = (event: PointerEvent) => {
      const gesture = Common.pointerRelease(state.pointer, event);
      if (gesture === "click") onClick(state.pointer.drag.x, state.pointer.drag.y);
      if (gesture !== "drag") return;
      const { x, y } = Common.pointerToScene(state.pointer, event);
      const dx = x - state.pointer.drag.x;
      const dy = y - state.pointer.drag.y;
      const dist = Math.hypot(dx, dy) || 1;
      const fx = dx / dist;
      const fy = dy / dist;
      spawnArc({
        x,
        y,
        ux: -fy,
        uy: fx,
        vx: fx * REBELLION_DRIVE_SPEED,
        vy: fy * REBELLION_DRIVE_SPEED,
        length: 3.6,
        curve: -1.1,
        width: 0.55 * widthScale(),
        life: REBELLION_DRIVE_LIFE,
        echoes: 2,
      });
      sparkBurst(x, y, 16, fx, fy, 5, 4);
      impact.shake = Math.max(impact.shake, 0.05);
      styleSignal.points += Common.STYLE_CLICK_POINTS;
    };
    return Common.listenPointer(state.pointer, { down: onDown, up: onUp });
  }, [reducedMotion, state, actions, styleSignal, impact]);

  useFrame((frame, delta) => {
    const dt = Math.min(delta, 0.05);
    state.clock += dt;
    Common.trackPointer(state.pointer, input.target, size.width, size.height, dt);
    const { x: px, y: py, prevX, prevY, speed } = state.pointer;
    const live = input.target.pointerActive && !reducedMotion;
    const { sparkBurst, bolt, crackle, thrustBolts, widthScale } = actions;

    Common.heatTrack(heat, state, styleSignal.heat, impact, dt);

    const swinging =
      live && speed > (state.swingActive >= 0 ? REBELLION_SWING_KEEP_PX : REBELLION_SWING_START_PX);
    const pushSwing = (swing: RebellionSwing, x: number, y: number, t: number) => {
      if (swing.count === REBELLION_POINTS) {
        swing.xs.copyWithin(0, 1);
        swing.ys.copyWithin(0, 1);
        swing.ts.copyWithin(0, 1);
        swing.count -= 1;
      }
      swing.xs[swing.count] = x;
      swing.ys[swing.count] = y;
      swing.ts[swing.count] = t;
      swing.count += 1;
    };
    if (swinging) {
      if (state.swingActive < 0) {
        state.swingActive = state.swingCursor;
        state.swingCursor = (state.swingCursor + 1) % REBELLION_SWING_MAX;
        state.swings[state.swingActive].count = 0;
        pushSwing(state.swings[state.swingActive], prevX, prevY, state.clock - dt);
      }
      const swing = state.swings[state.swingActive];
      const lx = swing.xs[swing.count - 1];
      const ly = swing.ys[swing.count - 1];
      const gap = Math.hypot(px - lx, py - ly);
      const steps = Math.max(1, Math.ceil(gap / REBELLION_SWING_STEP));
      for (let s = 1; s <= steps; s++) {
        const f = s / steps;
        pushSwing(swing, lx + (px - lx) * f, ly + (py - ly) * f, state.clock - dt * (1 - f));
      }
      sparkBurst(px, py, 1, (px - lx) / (gap || 1), (py - ly) / (gap || 1), 4, 2);
    } else {
      state.swingActive = -1;
    }
    state.swings.forEach((swing) => {
      let drop = 0;
      while (drop < swing.count && state.clock - swing.ts[drop] > REBELLION_SWING_LIFE) drop++;
      if (drop === 0) return;
      swing.xs.copyWithin(0, drop, swing.count);
      swing.ys.copyWithin(0, drop, swing.count);
      swing.ts.copyWithin(0, drop, swing.count);
      swing.count -= drop;
    });

    state.thrusts.forEach((thrust) => {
      if (!thrust.alive) return;
      thrust.age += dt;
      if (!thrust.fired && thrust.age >= REBELLION_THRUST_EXTEND) {
        thrust.fired = true;
        const tipX = thrust.x + thrust.ux * thrust.length;
        const tipY = thrust.y + thrust.uy * thrust.length;
        sparkBurst(tipX, tipY, thrust.sparks, thrust.ux, thrust.uy, 6, 5);
        thrustBolts(tipX, tipY, thrust.ux, thrust.uy, thrust.bolts, thrust.reach);
        impact.aberration = Math.max(impact.aberration, thrust.aberration);
        heat.uSurge.value = Math.max(heat.uSurge.value, thrust.surge);
        if (thrust.points > 0) crackle(tipX, tipY, 4);
        impact.shake = Math.max(impact.shake, thrust.shake);
        styleSignal.points += thrust.points;
      }
      if (thrust.age > thrust.life) thrust.alive = false;
    });
    state.arcs.forEach((arc) => {
      if (!arc.alive) return;
      arc.age += dt;
      if (arc.echoes > 0 && Math.random() < 0.6) {
        const p = rebellionArcPoint(
          arc,
          Math.random(),
          arc.x + arc.vx * arc.age,
          arc.y + arc.vy * arc.age,
        );
        if (state.devil && Math.random() < 0.6) {
          const back = Math.atan2(-arc.vy, -arc.vx) + (Math.random() - 0.5) * 1.6;
          const len = 0.8 + Math.random() * 0.6;
          bolt(p.x, p.y, p.x + Math.cos(back) * len, p.y + Math.sin(back) * len, 0.04, 0.12);
        }
        sparkBurst(
          p.x,
          p.y,
          1,
          -arc.vx / REBELLION_DRIVE_SPEED,
          -arc.vy / REBELLION_DRIVE_SPEED,
          2,
          2,
        );
      }
      if (arc.age > arc.life) arc.alive = false;
    });
    state.bolts.forEach((b) => {
      if (!b.alive) return;
      b.age += dt;
      b.flicker += dt;
      if (b.flicker >= REBELLION_BOLT_FLICKER) {
        b.flicker = 0;
        rebellionBoltShape(b);
      }
      if (b.age > b.life) b.alive = false;
    });

    if (state.sparksLive) {
      let any = false;
      for (let i = 0; i < REBELLION_SPARK_MAX; i++) {
        if (state.sparkLife[i] <= 0) continue;
        any = true;
        state.sparkLife[i] -= dt / REBELLION_SPARK_LIFE;
        state.sparkVel[i * 3 + 1] -= 9 * dt;
        state.sparkVel[i * 3] *= 1 - 1.5 * dt;
        state.sparkPos[i * 3] += state.sparkVel[i * 3] * dt;
        state.sparkPos[i * 3 + 1] += state.sparkVel[i * 3 + 1] * dt;
      }
      sparks.positions.needsUpdate = true;
      sparks.lives.needsUpdate = true;
      sparks.material.uniforms.uPixelRatio.value = frame.gl.getPixelRatio();
      state.sparksLive = any;
    }

    const active =
      state.arcs.some((arc) => arc.alive) ||
      state.thrusts.some((thrust) => thrust.alive) ||
      state.swings.some((swing) => swing.count > 0) ||
      state.bolts.some((b) => b.alive);
    if (!active && !state.drawn) return;
    state.drawn = active;

    const { xs, ys, ws, as } = state;
    const writeStrip = (ribbon: typeof strokes, points: number, k: number, n: number) => {
      for (let i = 0; i < points; i++) {
        const v = (k * points + i) * 2;
        if (n < 2) {
          ribbon.positions.setXYZ(v, 0, 0, 0);
          ribbon.positions.setXYZ(v + 1, 0, 0, 0);
          continue;
        }
        const j = Math.min(i, n - 1);
        const a = Math.max(j - 1, 0);
        const b = Math.min(j + 1, n - 1);
        const tx = xs[b] - xs[a];
        const ty = ys[b] - ys[a];
        const len = Math.hypot(tx, ty) || 1;
        const w = i < n ? ws[j] : 0;
        const ox = (-ty / len) * w;
        const oy = (tx / len) * w;
        ribbon.positions.setXYZ(v, xs[j] + ox, ys[j] + oy, 0);
        ribbon.positions.setXYZ(v + 1, xs[j] - ox, ys[j] - oy, 0);
        ribbon.ages.setX(v, as[j]);
        ribbon.ages.setX(v + 1, as[j]);
      }
    };

    state.arcs.forEach((arc, a) => {
      const base = a * REBELLION_ARC_LAYERS;
      if (!arc.alive) {
        for (let layer = 0; layer < REBELLION_ARC_LAYERS; layer++) {
          writeStrip(strokes, REBELLION_POINTS, base + layer, 0);
        }
        return;
      }
      const life = arc.age / arc.life;
      const moving = arc.echoes > 0;
      const sweep = moving ? 1 : Math.min(arc.age / REBELLION_ARC_SWEEP, 1);
      const fade = moving ? 1 - MathUtils.smoothstep(life, 0.6, 1) : Math.sqrt(1 - life);
      const side = Math.sign(arc.curve) || 1;
      const nx = -arc.uy * side;
      const ny = arc.ux * side;
      for (let layer = 0; layer < REBELLION_ARC_LAYERS; layer++) {
        const echo = layer >= 2 ? layer - 1 : 0;
        if (echo > arc.echoes) {
          writeStrip(strokes, REBELLION_POINTS, base + layer, 0);
          continue;
        }
        const t0 = Math.max(arc.age - echo * REBELLION_DRIVE_ECHO_LAG, 0);
        const cx = arc.x + arc.vx * t0;
        const cy = arc.y + arc.vy * t0;
        for (let i = 0; i < REBELLION_POINTS; i++) {
          const t = i / (REBELLION_POINTS - 1);
          const p = rebellionArcPoint(arc, Math.min(t, sweep), cx, cy);
          const body = t <= sweep ? arc.width * Math.pow(Math.sin(Math.PI * t), 0.6) * fade : 0;
          if (layer === 1) {
            xs[i] = p.x + nx * body * 0.6;
            ys[i] = p.y + ny * body * 0.6;
            ws[i] = body * 0.22;
            as[i] = life * 0.6;
          } else {
            xs[i] = p.x;
            ys[i] = p.y;
            ws[i] = body * 1.2 * (1 - echo * 0.25);
            as[i] = Math.min(0.12 + 0.45 * life + (1 - t) * 0.3 + echo * 0.2, 0.98);
          }
        }
        writeStrip(strokes, REBELLION_POINTS, base + layer, REBELLION_POINTS);
      }
    });

    state.thrusts.forEach((thrust, k) => {
      const strip = REBELLION_THRUST_INDEX + k;
      if (!thrust.alive || thrust.age < 0) {
        writeStrip(strokes, REBELLION_POINTS, strip, 0);
        return;
      }
      const reach = Math.min(thrust.age / REBELLION_THRUST_EXTEND, 1);
      const fade =
        thrust.age < REBELLION_THRUST_EXTEND
          ? 1
          : Math.max(
              0,
              1 - (thrust.age - REBELLION_THRUST_EXTEND) / (thrust.life - REBELLION_THRUST_EXTEND),
            );
      for (let i = 0; i < REBELLION_POINTS; i++) {
        const t = i / (REBELLION_POINTS - 1);
        const along = thrust.length * reach * t;
        xs[i] = thrust.x + thrust.ux * along;
        ys[i] = thrust.y + thrust.uy * along;
        ws[i] = thrust.width * 1.35 * Math.pow(t, 0.8) * (1 - Math.pow(t, 10)) * fade;
        as[i] = 1 - fade;
      }
      writeStrip(strokes, REBELLION_POINTS, strip, REBELLION_POINTS);
    });

    state.swings.forEach((swing, k) => {
      const n = swing.count;
      for (let i = 0; i < n; i++) {
        const age = Math.min((state.clock - swing.ts[i]) / REBELLION_SWING_LIFE, 1);
        xs[i] = swing.xs[i];
        ys[i] = swing.ys[i];
        ws[i] =
          REBELLION_SWING_WIDTH *
          widthScale() *
          Math.pow(Math.sin((Math.PI * i) / Math.max(n - 1, 1)), 0.7) *
          (1 - age);
        as[i] = age;
      }
      writeStrip(strokes, REBELLION_POINTS, REBELLION_SWING_INDEX + k, n);
    });

    state.bolts.forEach((b, k) => {
      if (!b.alive) {
        writeStrip(boltStrokes, REBELLION_BOLT_POINTS, k, 0);
        return;
      }
      const fade = 1 - b.age / b.life;
      for (let i = 0; i < REBELLION_BOLT_POINTS; i++) {
        const t = i / (REBELLION_BOLT_POINTS - 1);
        xs[i] = b.pts[i * 2];
        ys[i] = b.pts[i * 2 + 1];
        ws[i] = b.width * (0.5 + 0.5 * Math.sin(Math.PI * t)) * fade;
        as[i] = 1 - b.glow * fade;
      }
      writeStrip(boltStrokes, REBELLION_BOLT_POINTS, k, REBELLION_BOLT_POINTS);
    });

    strokes.positions.needsUpdate = true;
    strokes.ages.needsUpdate = true;
    boltStrokes.positions.needsUpdate = true;
    boltStrokes.ages.needsUpdate = true;
  });

  return (
    <>
      <mesh
        geometry={boltStrokes.geometry}
        material={stroke}
        frustumCulled={false}
        renderOrder={4}
      />
      <mesh geometry={strokes.geometry} material={stroke} frustumCulled={false} renderOrder={5} />
      <points
        geometry={sparks.geometry}
        material={sparks.material}
        frustumCulled={false}
        renderOrder={6}
      />
    </>
  );
}
