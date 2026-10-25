import * as Common from "@/ui/themes/dmc/__common__";

interface Sword {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  delay: number;
  travel: number;
  until: number;
  age: number;
  alive: boolean;
}

const SWORD_MAX = 9;
const SWORD_COUNT = 3;
const SWORD_SHAPE = [
  [0, 0.3],
  [0.09, 0.3],
  [0.1, 1.9],
  [0.13, 1.9],
  [0.14, 1],
  [0.4, 0.82],
  [0.65, 0.6],
  [0.85, 0.34],
  [0.95, 0.12],
  [1, 0],
];
const SWORD_POINTS = SWORD_SHAPE.length;
const SWORD_LENGTH = 1.7;
const SWORD_WIDTH = 0.06;
const SWORD_STEP = 0.05;
const SWORD_FADE_IN = 0.04;
const SWORD_FADE_OUT = 0.15;
const SWORD_FLASH = 0.05;

export function createSwords() {
  return {
    swords: Array.from({ length: SWORD_MAX }, () => ({
      sx: 0,
      sy: 0,
      ex: 0,
      ey: 0,
      delay: 0,
      travel: 0.15,
      until: 0,
      age: 0,
      alive: false,
    })) as Sword[],
    cursor: 0,
    drawn: false,
    ribbon: Common.createRibbonGeometry(SWORD_POINTS, SWORD_MAX * 2),
  };
}

type Swords = ReturnType<typeof createSwords>;

export function swordsSpawn(
  pack: Swords,
  x: number,
  y: number,
  until: number,
  halfW: number,
  halfH: number,
) {
  const far = Math.hypot(halfW, halfH) * 1.15;
  let a = Math.random() * Math.PI * 2;
  for (let i = 0; i < SWORD_COUNT; i++) {
    a += 1.2 + Math.random() * 1.4;
    const reach = 0.15 + Math.random() * 0.35;
    const tilt = a + (Math.random() - 0.5) * 0.5;
    const sword = pack.swords[pack.cursor];
    pack.cursor = (pack.cursor + 1) % SWORD_MAX;
    Object.assign(sword, {
      sx: x + Math.cos(a) * far,
      sy: y + Math.sin(a) * far,
      ex: x + Math.cos(tilt) * reach,
      ey: y + Math.sin(tilt) * reach,
      delay: i * SWORD_STEP + Math.random() * 0.02,
      travel: 0.13 + Math.random() * 0.05,
      until,
      age: 0,
      alive: true,
    });
  }
}

export function swordsClear(pack: Swords) {
  pack.swords.forEach((sword) => (sword.alive = false));
}

export function swordsDraw(pack: Swords, dt: number, minHalf: number) {
  if (!pack.drawn && !pack.swords.some((sword) => sword.alive)) return;
  const { positions, ages } = pack.ribbon;
  let any = false;
  const write = (
    k: number,
    tx: number,
    ty: number,
    ux: number,
    uy: number,
    w: number,
    glow: number,
  ) => {
    for (let i = 0; i < SWORD_POINTS; i++) {
      const [t, profile] = SWORD_SHAPE[i];
      const back = SWORD_LENGTH * (1 - t);
      const cx = tx - ux * back;
      const cy = ty - uy * back;
      const width = Math.max(w * profile, minHalf);
      const v = (k * SWORD_POINTS + i) * 2;
      const age = Common.strokeAge(glow, w * profile, width);
      positions.setXYZ(v, cx - uy * width, cy + ux * width, 0);
      positions.setXYZ(v + 1, cx + uy * width, cy - ux * width, 0);
      ages.setX(v, age);
      ages.setX(v + 1, age);
    }
  };
  pack.swords.forEach((sword, s) => {
    if (sword.alive) sword.age += dt;
    const local = sword.age - sword.delay;
    const after = local - sword.travel;
    const hold = sword.until - sword.delay - sword.travel;
    if (sword.alive && after > hold + SWORD_FADE_OUT) sword.alive = false;
    if (!sword.alive || local < 0) {
      write(s * 2, 0, 0, 1, 0, 0, 0);
      write(s * 2 + 1, 0, 0, 1, 0, 0, 0);
      return;
    }
    any = true;
    const dx = sword.ex - sword.sx;
    const dy = sword.ey - sword.sy;
    const len = Math.hypot(dx, dy) || 1;
    const k = Math.min(local / sword.travel, 1);
    const tx = sword.sx + dx * k * k;
    const ty = sword.sy + dy * k * k;
    let alpha = Math.min(local / SWORD_FADE_IN, 1);
    if (after > hold) alpha *= Math.max(1 - (after - hold) / SWORD_FADE_OUT, 0);
    const flash = after >= 0 && after < SWORD_FLASH ? 1 : 0.8;
    write(s * 2, tx, ty, dx / len, dy / len, SWORD_WIDTH, flash * alpha);
    write(s * 2 + 1, tx, ty, dx / len, dy / len, SWORD_WIDTH * 2.2, 0.45 * alpha);
  });
  positions.needsUpdate = true;
  ages.needsUpdate = true;
  pack.drawn = any;
}
