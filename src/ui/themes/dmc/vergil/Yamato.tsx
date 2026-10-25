import type * as Stage from "@/ui/shared/stage";
import * as Common from "@/ui/themes/dmc/__common__";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, Vector2, type Mesh } from "three";
import { createGlass, GLASS_PIECE_MAX, glassSplit } from "./glass";
import { createSwords, swordsClear, swordsDraw, swordsSpawn } from "./swords";

const YAMATO_FLICK_START_PX = 900;
const YAMATO_FLICK_KEEP_PX = 120;
const YAMATO_FLICK_KEEP_RATIO = 0.3;
const YAMATO_FLICK_STOP = 0.06;
const YAMATO_FLICK_MIN_PX = 16;
const YAMATO_SLASH_MIN_LENGTH = 4;
const YAMATO_FLICK_OVERSHOOT = 0.15;
const YAMATO_SLASH_MAX = 6;
const YAMATO_SLASH_HOLD = 0.06;
const YAMATO_SLASH_FADE = 0.2;
const YAMATO_SLASH_HOLD_PER_UNIT = 0.008;
const YAMATO_SLASH_FADE_PER_UNIT = 0.022;
const YAMATO_CUT_MAX = 3;
const YAMATO_CUT_TIERS = {
  base: { n: 3, r: 1 },
  raised: { n: 6, r: 2.2 },
};
type YamatoCutTier = (typeof YAMATO_CUT_TIERS)["base"];
const YAMATO_CUT_LINES_MAX = YAMATO_CUT_TIERS.raised.n;
const YAMATO_CUT_DELAY = 0.22;
const YAMATO_CUT_STEP = 0.035;
const YAMATO_TIER_UP_CLICKS = 3;
const YAMATO_END_LINES = { normal: 9, devil: 15 };
const YAMATO_END_NEAR_LINES = { normal: 4, devil: 6 };
const YAMATO_END_FREEZE_IN = 0.05;
const YAMATO_END_LINE_START = 0.15;
const YAMATO_END_LINE_STEP = 0.022;
const YAMATO_END_FLASH = 0.05;
const YAMATO_END_SHATTER_AT = 0.62;
const YAMATO_END_PIECE_LIFE = 0.7;
const YAMATO_END_PIECE_DELAY = 0.12;
const YAMATO_END_GRAVITY = 9;
const YAMATO_CUT_ABERRATION = 0.009;
const YAMATO_END_FREEZE_ABERRATION = 0.008;
const YAMATO_END_SHATTER_ABERRATION = { normal: 0.014, devil: 0.02 };
const YAMATO_END_SHATTER_SHAKE = { normal: 0.2, devil: 0.28 };
const YAMATO_POWER = {
  normal: { width: 0.8, slash: 0.8, reach: 1, hold: 0.7, aberration: 1, halo: 0 },
  devil: { width: 1.35, slash: 1, reach: 1.3, hold: 0.95, aberration: 1.6, halo: 1 },
};
type YamatoForm = keyof typeof YAMATO_POWER;
type YamatoPower = (typeof YAMATO_POWER)[YamatoForm];
const YAMATO_LINE_POINTS = 6;
const YAMATO_LINE_TAPER = Array.from({ length: YAMATO_LINE_POINTS }, (_, i) => {
  const t = i / (YAMATO_LINE_POINTS - 1);
  return 0.2 + 0.8 * Math.sqrt(Math.sin(Math.PI * t) + 0.02);
});
const YAMATO_SLASH_INDEX = YAMATO_CUT_MAX * YAMATO_CUT_LINES_MAX;
const YAMATO_END_INDEX = YAMATO_SLASH_INDEX + YAMATO_SLASH_MAX;
const YAMATO_HALO_INDEX = YAMATO_END_INDEX + YAMATO_END_LINES.devil;
const YAMATO_LINE_MAX = YAMATO_HALO_INDEX + YAMATO_SLASH_MAX;

interface YamatoCut {
  x: number;
  y: number;
  r: number;
  n: number;
  power: YamatoPower;
  age: number;
  alive: boolean;
  shattered: boolean;
  angles: Float32Array;
  offsets: Float32Array;
  ends: Float32Array;
}

interface YamatoPiece {
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  spin: number;
  delay: number;
  start: number;
  count: number;
}

interface YamatoEnd {
  phase: "idle" | "pending" | "frozen" | "shattered";
  age: number;
  x: number;
  y: number;
  form: YamatoForm;
  lines: Float32Array;
  weights: Float32Array;
  pieces: YamatoPiece[];
  pieceCount: number;
  buffer: Vector2;
}

function yamatoLayoutGlass(
  glass: ReturnType<typeof createGlass>,
  end: YamatoEnd,
  polys: number[][],
  halfW: number,
  halfH: number,
  burst: boolean,
) {
  const diag = Math.hypot(halfW, halfH) * 2;
  let v = 0;
  polys.forEach((poly, k) => {
    const n = poly.length / 2;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < n; i++) {
      cx += poly[i * 2] / n;
      cy += poly[i * 2 + 1] / n;
    }
    const start = v;
    const shade = burst ? 0.88 + Math.random() * 0.24 : 1;
    for (let i = 1; i < n - 1; i++) {
      for (const idx of [0, i, i + 1]) {
        const x = poly[idx * 2];
        const y = poly[idx * 2 + 1];
        glass.base[v * 2] = x - cx;
        glass.base[v * 2 + 1] = y - cy;
        glass.uvs.setXY(v, x / (2 * halfW) + 0.5, y / (2 * halfH) + 0.5);
        glass.shades.setX(v, shade);
        v++;
      }
    }
    const ox = cx - end.x;
    const oy = cy - end.y;
    const dist = Math.hypot(ox, oy) || 1;
    const push = burst ? 0.4 + Math.random() * 0.9 : 0;
    Object.assign(end.pieces[k], {
      cx,
      cy,
      vx: (ox / dist) * push,
      vy: burst ? (oy / dist) * push + Math.random() * 0.6 : 0,
      spin: burst ? (Math.random() - 0.5) * 2.4 : 0,
      delay: burst ? (dist / diag) * YAMATO_END_PIECE_DELAY : 0,
      start,
      count: v - start,
    });
  });
  glass.uvs.needsUpdate = true;
  glass.shades.needsUpdate = true;
  end.pieceCount = polys.length;
}

function yamatoForm(devil: boolean): YamatoForm {
  return devil ? "devil" : "normal";
}

function yamatoCutShatterAt(cut: YamatoCut): number {
  return YAMATO_CUT_DELAY + cut.n * YAMATO_CUT_STEP + 0.08;
}

export function Yamato({
  input,
  reducedMotion,
  colors,
  styleSignal,
  impact,
  heat,
  phantomColors,
}: {
  input: Stage.InputRef;
  reducedMotion: boolean;
  colors: Common.StrokeColors;
  styleSignal: Common.StyleSignal;
  impact: Common.ImpactSignal;
  heat: Common.Heat;
  phantomColors: Common.StrokeColors;
}) {
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const dpr = useThree((state) => state.viewport.dpr);
  const state = useMemo(
    () => ({
      cuts: Array.from({ length: YAMATO_CUT_MAX }, () => ({
        x: 0,
        y: 0,
        r: 1,
        n: 0,
        power: YAMATO_POWER.normal,
        age: 0,
        alive: false,
        shattered: false,
        angles: new Float32Array(YAMATO_CUT_LINES_MAX),
        offsets: new Float32Array(YAMATO_CUT_LINES_MAX),
        ends: new Float32Array(YAMATO_CUT_LINES_MAX * 2),
      })) as YamatoCut[],
      cutCursor: 0,
      clicks: 0,
      lastClickAt: -10,
      flick: { active: false, sx: 0, sy: 0, ex: 0, ey: 0, peak: 0, slow: 0 },
      slashes: Array.from({ length: YAMATO_SLASH_MAX }, () => ({
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        hold: YAMATO_SLASH_HOLD,
        fade: YAMATO_SLASH_FADE,
        power: YAMATO_POWER.normal,
        age: 0,
        alive: false,
      })),
      slashCursor: 0,
      end: {
        phase: "idle",
        age: 0,
        x: 0,
        y: 0,
        form: "normal",
        lines: new Float32Array(YAMATO_END_LINES.devil * 4),
        weights: new Float32Array(YAMATO_END_LINES.devil),
        pieces: Array.from({ length: GLASS_PIECE_MAX }, () => ({
          cx: 0,
          cy: 0,
          vx: 0,
          vy: 0,
          spin: 0,
          delay: 0,
          start: 0,
          count: 0,
        })) as YamatoPiece[],
        pieceCount: 0,
        buffer: new Vector2(),
      } as YamatoEnd,
      pointer: Common.createPointerTracker(),
      clock: 0,
      heat: 0,
      devil: false,
      drawn: false,
    }),
    [],
  );

  const lines = useMemo(() => Common.createRibbonGeometry(YAMATO_LINE_POINTS, YAMATO_LINE_MAX), []);
  const stroke = useMemo(() => Common.createStrokeMaterial(colors), []);
  const glass = useMemo(() => createGlass(), []);
  const glassMesh = useRef<Mesh>(null);
  const linesMesh = useRef<Mesh>(null);
  const phantoms = useMemo(() => createSwords(), []);
  const phantomStroke = useMemo(() => Common.createStrokeMaterial(phantomColors), []);
  const phantomsMesh = useRef<Mesh>(null);
  useEffect(() => {
    stroke.uniforms.uAccent.value = colors.accent;
    stroke.uniforms.uHot.value = colors.hot;
    phantomStroke.uniforms.uAccent.value = phantomColors.accent;
    phantomStroke.uniforms.uHot.value = phantomColors.hot;
  }, [colors, stroke, phantomColors, phantomStroke]);

  useEffect(
    () => () => {
      lines.geometry.dispose();
      phantoms.ribbon.geometry.dispose();
      phantomStroke.dispose();
      stroke.dispose();
      glass.geometry.dispose();
      glass.material.dispose();
      glass.target.dispose();
    },
    [lines, stroke, glass],
  );

  useEffect(() => {
    if (reducedMotion) return;
    const spawnCut = (x: number, y: number, tier: YamatoCutTier) => {
      const cut = state.cuts[state.cutCursor];
      state.cutCursor = (state.cutCursor + 1) % YAMATO_CUT_MAX;
      cut.x = x;
      cut.y = y;
      cut.r = tier.r;
      cut.n = tier.n;
      cut.power = YAMATO_POWER[yamatoForm(state.devil)];
      cut.age = 0;
      cut.alive = true;
      cut.shattered = false;
      const base = Math.random() * Math.PI;
      for (let j = 0; j < cut.n; j++) {
        cut.angles[j] = base + (j / cut.n) * Math.PI + (Math.random() - 0.5) * 0.5;
        cut.offsets[j] = (Math.random() - 0.5) * cut.r * 1.1;
        cut.ends[j * 2] = 0.5 + Math.random() * 0.75;
        cut.ends[j * 2 + 1] = 0.5 + Math.random() * 0.75;
      }
      if (state.devil) {
        const { halfW, halfH } = state.pointer;
        swordsSpawn(phantoms, x, y, yamatoCutShatterAt(cut), halfW, halfH);
      }
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || state.end.phase !== "idle") return;
      const { x, y } = Common.pointerToScene(state.pointer, event);
      Common.pointerPress(state.pointer, x, y);
    };
    const onClick = (x: number, y: number) => {
      const hit = Common.styleComboHit(state, state.clock);
      if (hit >= Common.STYLE_FINISHER_CLICKS) {
        state.end.phase = "pending";
        state.end.form = yamatoForm(state.devil);
        state.end.x = x;
        state.end.y = y;
        return;
      }
      spawnCut(
        x,
        y,
        hit >= YAMATO_TIER_UP_CLICKS ? YAMATO_CUT_TIERS.raised : YAMATO_CUT_TIERS.base,
      );
    };
    const onUp = (event: PointerEvent) => {
      const gesture = Common.pointerRelease(state.pointer, event);
      if (gesture === "click") onClick(state.pointer.drag.x, state.pointer.drag.y);
      if (gesture !== "drag") return;
      const { x, y } = Common.pointerToScene(state.pointer, event);
      spawnCut(x, y, YAMATO_CUT_TIERS.raised);
    };
    return Common.listenPointer(state.pointer, { down: onDown, up: onUp });
  }, [reducedMotion, state, phantoms]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    state.clock += dt;
    Common.trackPointer(state.pointer, input.target, size.width, size.height, dt);
    const { halfW, halfH, pxPerUnit, x: px, y: py, prevX, prevY, speed } = state.pointer;
    const live = input.target.pointerActive && !reducedMotion;
    Common.heatTrack(heat, state, styleSignal.heat, impact, dt);

    const flick = state.flick;
    const emitSlash = (x2: number, y2: number) => {
      flick.active = false;
      const dx = x2 - flick.sx;
      const dy = y2 - flick.sy;
      const len = Math.hypot(dx, dy);
      if (len * pxPerUnit < YAMATO_FLICK_MIN_PX) return;
      const slash = state.slashes[state.slashCursor];
      state.slashCursor = (state.slashCursor + 1) % YAMATO_SLASH_MAX;
      const half = Math.max(len * (0.5 + YAMATO_FLICK_OVERSHOOT), YAMATO_SLASH_MIN_LENGTH / 2);
      const mx = (flick.sx + x2) / 2;
      const my = (flick.sy + y2) / 2;
      const ux = dx / len;
      const uy = dy / len;
      slash.x1 = mx - ux * half;
      slash.y1 = my - uy * half;
      slash.x2 = mx + ux * half;
      slash.y2 = my + uy * half;
      slash.hold = YAMATO_SLASH_HOLD + half * 2 * YAMATO_SLASH_HOLD_PER_UNIT;
      slash.fade = YAMATO_SLASH_FADE + half * 2 * YAMATO_SLASH_FADE_PER_UNIT;
      slash.power = YAMATO_POWER[yamatoForm(state.devil)];
      slash.age = 0;
      slash.alive = true;
    };
    if (flick.active) {
      const keep = Math.max(YAMATO_FLICK_KEEP_PX, flick.peak * YAMATO_FLICK_KEEP_RATIO);
      if (!live) {
        emitSlash(flick.ex, flick.ey);
      } else if (speed < keep) {
        flick.slow += dt;
        if (flick.slow > YAMATO_FLICK_STOP) emitSlash(flick.ex, flick.ey);
      } else {
        flick.slow = 0;
        flick.peak = Math.max(flick.peak, speed);
        flick.ex = px;
        flick.ey = py;
      }
    }
    if (!flick.active && live && state.end.phase === "idle" && speed > YAMATO_FLICK_START_PX) {
      flick.active = true;
      flick.sx = prevX;
      flick.sy = prevY;
      flick.ex = px;
      flick.ey = py;
      flick.peak = speed;
      flick.slow = 0;
    }

    const end = state.end;
    if (end.phase === "pending") {
      gl.getDrawingBufferSize(end.buffer);
      if (glass.target.width !== end.buffer.x || glass.target.height !== end.buffer.y) {
        glass.target.setSize(end.buffer.x, end.buffer.y);
      }
      const previous = gl.getRenderTarget();
      const overlays = [glassMesh.current, linesMesh.current, phantomsMesh.current];
      overlays.forEach((mesh) => mesh && (mesh.visible = false));
      gl.setRenderTarget(glass.target);
      gl.render(scene, camera);
      gl.setRenderTarget(previous);
      overlays.forEach((mesh) => mesh && (mesh.visible = true));
      state.slashes.forEach((slash) => (slash.alive = false));
      state.cuts.forEach((cut) => (cut.alive = false));
      swordsClear(phantoms);
      flick.active = false;
      for (let j = 0; j < YAMATO_END_LINES[end.form]; j++) {
        const a = Math.random() * Math.PI;
        const near = j < YAMATO_END_NEAR_LINES[end.form];
        end.lines[j * 4] = near
          ? end.x + (Math.random() - 0.5) * 0.8
          : (Math.random() - 0.5) * 1.6 * halfW;
        end.lines[j * 4 + 1] = near
          ? end.y + (Math.random() - 0.5) * 0.8
          : (Math.random() - 0.5) * 1.6 * halfH;
        end.lines[j * 4 + 2] = Math.cos(a);
        end.lines[j * 4 + 3] = Math.sin(a);
        end.weights[j] = near ? 0.8 + Math.random() * 0.2 : 0.45 + Math.random() * 0.35;
      }
      yamatoLayoutGlass(glass, end, glassSplit(end.lines, 0, halfW, halfH), halfW, halfH, false);
      end.age = 0;
      end.phase = "frozen";
      styleSignal.frozen = true;
      impact.glitch = 1;
      impact.aberration = Math.max(impact.aberration, YAMATO_END_FREEZE_ABERRATION);
    }
    if (end.phase !== "idle") {
      end.age += dt;
      if (end.phase === "frozen" && end.age >= YAMATO_END_SHATTER_AT) {
        yamatoLayoutGlass(
          glass,
          end,
          glassSplit(end.lines, YAMATO_END_LINES[end.form], halfW, halfH),
          halfW,
          halfH,
          true,
        );
        end.phase = "shattered";
        styleSignal.frozen = false;
        styleSignal.points += Common.STYLE_FINISHER_POINTS;
        impact.shake = Math.max(impact.shake, YAMATO_END_SHATTER_SHAKE[end.form]);
        impact.aberration = Math.max(impact.aberration, YAMATO_END_SHATTER_ABERRATION[end.form]);
      }
      const since = end.age - YAMATO_END_SHATTER_AT;
      if (end.phase === "shattered" && since > YAMATO_END_PIECE_DELAY + YAMATO_END_PIECE_LIFE) {
        end.phase = "idle";
        end.pieceCount = 0;
        glass.target.setSize(1, 1);
      }
      glass.material.uniforms.uFreeze.value = Math.min(end.age / YAMATO_END_FREEZE_IN, 1);
      let drawEnd = 0;
      for (let k = 0; k < end.pieceCount; k++) {
        const piece = end.pieces[k];
        const t = end.phase === "shattered" ? Math.max(since - piece.delay, 0) : 0;
        const life = Math.min(t / YAMATO_END_PIECE_LIFE, 1);
        const alpha = 1 - MathUtils.smoothstep(life, 0.3, 1);
        const scale = 1 - 0.08 * life;
        const rot = piece.spin * t;
        const cos = Math.cos(rot) * scale;
        const sin = Math.sin(rot) * scale;
        const tx = piece.cx + piece.vx * t;
        const ty = piece.cy + piece.vy * t - 0.5 * YAMATO_END_GRAVITY * t * t;
        for (let v = piece.start; v < piece.start + piece.count; v++) {
          const bx = glass.base[v * 2];
          const by = glass.base[v * 2 + 1];
          glass.positions.setXYZ(v, tx + bx * cos - by * sin, ty + bx * sin + by * cos, 0);
          glass.alphas.setX(v, alpha);
        }
        drawEnd = piece.start + piece.count;
      }
      glass.geometry.setDrawRange(0, drawEnd);
      glass.positions.needsUpdate = true;
      glass.alphas.needsUpdate = true;
    }

    const minHalf = Common.strokeMinHalf(pxPerUnit, dpr);
    swordsDraw(phantoms, dt, minHalf);

    const active =
      end.phase !== "idle" ||
      state.slashes.some((slash) => slash.alive) ||
      state.cuts.some((cut) => cut.alive);
    if (!active && !state.drawn) return;
    state.drawn = active;

    const writeLine = (
      k: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      width: number,
      intensity: number,
    ) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      for (let i = 0; i < YAMATO_LINE_POINTS; i++) {
        const t = i / (YAMATO_LINE_POINTS - 1);
        const taper = width * YAMATO_LINE_TAPER[i];
        const half = Math.max(taper, minHalf);
        const nx = (-dy / len) * half;
        const ny = (dx / len) * half;
        const cx = x1 + dx * t;
        const cy = y1 + dy * t;
        const v = (k * YAMATO_LINE_POINTS + i) * 2;
        const age = Common.strokeAge(intensity, taper, half);
        lines.positions.setXYZ(v, cx + nx, cy + ny, 0);
        lines.positions.setXYZ(v + 1, cx - nx, cy - ny, 0);
        lines.ages.setX(v, age);
        lines.ages.setX(v + 1, age);
      }
    };

    const reach = Math.hypot(halfW, halfH) * 1.2;
    const endPower = YAMATO_POWER[end.form];
    const endLines = YAMATO_END_LINES[end.form];
    for (let j = 0; j < YAMATO_END_LINES.devil; j++) {
      const k = YAMATO_END_INDEX + j;
      const la = end.age - (YAMATO_END_LINE_START + j * YAMATO_END_LINE_STEP);
      const broke = end.age - YAMATO_END_SHATTER_AT;
      if (end.phase === "idle" || j >= endLines || la < 0 || broke > YAMATO_END_FLASH) {
        writeLine(k, 0, 0, 0, 0, 0, 0);
        continue;
      }
      const w = end.weights[j];
      const flash = la < YAMATO_END_FLASH || broke >= 0;
      const intensity = flash ? w : 0.7 * w;
      const width = (flash ? 0.045 : 0.026) * w * endPower.width;
      const px = end.lines[j * 4];
      const py = end.lines[j * 4 + 1];
      const dx = end.lines[j * 4 + 2] * reach;
      const dy = end.lines[j * 4 + 3] * reach;
      writeLine(k, px - dx, py - dy, px + dx, py + dy, width, intensity);
    }

    state.slashes.forEach((slash, i) => {
      const k = YAMATO_SLASH_INDEX + i;
      const h = YAMATO_HALO_INDEX + i;
      if (slash.alive) {
        slash.age += dt;
        if (slash.age > slash.hold + slash.fade) slash.alive = false;
      }
      if (!slash.alive) {
        writeLine(k, 0, 0, 0, 0, 0, 0);
        writeLine(h, 0, 0, 0, 0, 0, 0);
        return;
      }
      const fade =
        slash.age < slash.hold ? 1 : Math.pow(1 - (slash.age - slash.hold) / slash.fade, 1.5);
      const { power } = slash;
      const width = (0.02 + 0.03 * fade) * power.slash;
      writeLine(k, slash.x1, slash.y1, slash.x2, slash.y2, width, fade);
      writeLine(
        h,
        slash.x1,
        slash.y1,
        slash.x2,
        slash.y2,
        width * 1.8 * power.halo,
        0.6 * fade * power.halo,
      );
    });

    state.cuts.forEach((cut, c) => {
      if (cut.alive) cut.age += dt;
      const shatterAt = yamatoCutShatterAt(cut);
      if (cut.alive && cut.age >= shatterAt && !cut.shattered) {
        cut.shattered = true;
        styleSignal.points += Common.STYLE_CLICK_POINTS;
        const weight = 0.5 + (0.5 * cut.r) / YAMATO_CUT_TIERS.raised.r;
        impact.aberration = Math.max(
          impact.aberration,
          YAMATO_CUT_ABERRATION * weight * cut.power.aberration,
        );
      }
      if (cut.alive && cut.age > shatterAt + 0.3) cut.alive = false;
      for (let j = 0; j < YAMATO_CUT_LINES_MAX; j++) {
        const k = c * YAMATO_CUT_LINES_MAX + j;
        if (!cut.alive || j >= cut.n) {
          writeLine(k, 0, 0, 0, 0, 0, 0);
          continue;
        }
        const la = cut.age - (YAMATO_CUT_DELAY + j * YAMATO_CUT_STEP);
        const { power } = cut;
        let intensity = 0;
        let width = 0.028 * power.width;
        if (la >= 0) {
          if (la < 0.05) {
            intensity = 1;
            width = 0.04 * power.width;
          } else if (cut.age < shatterAt) {
            intensity = power.hold;
          } else {
            intensity = Math.max(0, power.hold * (1 - (cut.age - shatterAt) / 0.25));
          }
        }
        const a = cut.angles[j];
        const off = cut.offsets[j];
        const half = Math.sqrt(Math.max(cut.r * cut.r - off * off, 0.04));
        const mx = cut.x - Math.sin(a) * off;
        const my = cut.y + Math.cos(a) * off;
        const e1 = half * cut.ends[j * 2] * power.reach;
        const e2 = half * cut.ends[j * 2 + 1] * power.reach;
        writeLine(
          k,
          mx - Math.cos(a) * e1,
          my - Math.sin(a) * e1,
          mx + Math.cos(a) * e2,
          my + Math.sin(a) * e2,
          width,
          intensity,
        );
      }
    });
    lines.positions.needsUpdate = true;
    lines.ages.needsUpdate = true;
  });

  return (
    <>
      <mesh
        ref={glassMesh}
        geometry={glass.geometry}
        material={glass.material}
        frustumCulled={false}
        renderOrder={1}
      />
      <mesh
        ref={linesMesh}
        geometry={lines.geometry}
        material={stroke}
        frustumCulled={false}
        renderOrder={5}
      />
      <mesh
        ref={phantomsMesh}
        geometry={phantoms.ribbon.geometry}
        material={phantomStroke}
        frustumCulled={false}
        renderOrder={5}
      />
    </>
  );
}
