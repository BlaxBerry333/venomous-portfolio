import { useEffect, useMemo, useState, type RefObject } from "react";

export interface StyleRank {
  letter: string;
  name: string;
}

export const STYLE_RANKS: readonly StyleRank[] = [
  { letter: "D", name: "DISMAL" },
  { letter: "C", name: "CRAZY" },
  { letter: "B", name: "BADASS" },
  { letter: "A", name: "APOCALYPTIC!" },
  { letter: "S", name: "SAVAGE!" },
  { letter: "SS", name: "SICK SKILLS!!" },
  { letter: "SSS", name: "SMOKIN' SEXY STYLE!!" },
];

export const STYLE_CLICK_POINTS = 16;
export const STYLE_FINISHER_POINTS = 200;
export const STYLE_FINISHER_CLICKS = 5;
const STYLE_COMBO_WINDOW = 0.6;
const STYLE_MOVE_MIN_SPEED = 0.5;
const STYLE_MOVE_POINTS_PER_SPEED = 20;
const STYLE_MOVE_PUNCH_SPEED = 2.5;
const STYLE_PUNCH_GAP_MS = 70;
const STYLE_CLICK_SLOP = 0.064;
const STYLE_IDLE_DELAY = 0.45;
const STYLE_DRAIN_BASE = 18;
const STYLE_DRAIN_PER_RANK = 5;
const STYLE_RANK_UP_CARRY = 8;
const STYLE_RANK_DOWN_GAUGE = 65;

function stylePunchKeyframes(scale: number, rotate: number): Keyframe[] {
  return [
    { transform: "scale(1) rotate(0deg)" },
    { transform: `scale(${scale}) rotate(${rotate}deg)`, offset: 0.3 },
    { transform: "scale(1) rotate(0deg)" },
  ];
}

const STYLE_PUNCH_KEYFRAMES = stylePunchKeyframes(1.16, -2.5);
const STYLE_NAME_PUNCH_KEYFRAMES = stylePunchKeyframes(1.05, -1);
const STYLE_PUNCH_TIMING: KeyframeAnimationOptions = {
  duration: 170,
  easing: "cubic-bezier(0.2, 0.9, 0.3, 1)",
};

export interface StyleState {
  rank: number;
  change: number;
  direction: 1 | -1;
  visible: boolean;
  frozen: boolean;
}

export interface StyleSignal {
  frozen: boolean;
  points: number;
  heat: number;
}

interface StyleCombo {
  clicks: number;
  lastClickAt: number;
}

export function styleComboHit(combo: StyleCombo, now: number): number {
  combo.clicks = now - combo.lastClickAt < STYLE_COMBO_WINDOW ? combo.clicks + 1 : 1;
  combo.lastClickAt = now;
  const hit = combo.clicks;
  if (hit >= STYLE_FINISHER_CLICKS) {
    combo.clicks = 0;
    combo.lastClickAt = -10;
  }
  return hit;
}

interface StyleRefs {
  meter: RefObject<HTMLElement>;
  letter: RefObject<HTMLElement>;
  name: RefObject<HTMLElement>;
}

export function useStyle(refs: StyleRefs, reducedMotion: boolean, signal?: StyleSignal) {
  const [style, setStyle] = useState<StyleState>({
    rank: 0,
    change: 0,
    direction: 1,
    visible: false,
    frozen: false,
  });
  const model = useMemo(
    () => ({
      gauge: 0,
      rank: 0,
      idle: 0,
      lastX: NaN,
      lastY: NaN,
      lastMove: 0,
      pending: 0,
      lastPunch: 0,
      pressX: NaN,
      pressY: NaN,
      shownLevel: "",
      shownVisible: false,
      shownFrozen: false,
    }),
    [],
  );

  useEffect(() => {
    const diag = () => Math.hypot(window.innerWidth, window.innerHeight);
    const punch = () => {
      const letter = refs.letter.current;
      const now = performance.now();
      if (reducedMotion || !letter || now - model.lastPunch < STYLE_PUNCH_GAP_MS) return;
      model.lastPunch = now;
      letter.animate(STYLE_PUNCH_KEYFRAMES, STYLE_PUNCH_TIMING);
      refs.name.current?.animate(STYLE_NAME_PUNCH_KEYFRAMES, STYLE_PUNCH_TIMING);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const now = performance.now();
      if (!Number.isNaN(model.lastX)) {
        const dt = Math.max((now - model.lastMove) / 1000, 0.004);
        const dist = Math.hypot(event.clientX - model.lastX, event.clientY - model.lastY) / diag();
        const speed = signal?.frozen ? 0 : dist / dt;
        if (speed > STYLE_MOVE_MIN_SPEED) {
          model.pending += (speed - STYLE_MOVE_MIN_SPEED) * STYLE_MOVE_POINTS_PER_SPEED * dt;
        }
        if (speed > STYLE_MOVE_PUNCH_SPEED) punch();
      }
      model.lastX = event.clientX;
      model.lastY = event.clientY;
      model.lastMove = now;
    };
    const onDown = (event: PointerEvent) => {
      if (signal || event.button !== 0) return;
      model.pressX = event.clientX;
      model.pressY = event.clientY;
    };
    const onUp = (event: PointerEvent) => {
      if (Number.isNaN(model.pressX)) return;
      const reach = Math.hypot(event.clientX - model.pressX, event.clientY - model.pressY);
      model.pressX = NaN;
      if (reach >= STYLE_CLICK_SLOP * window.innerHeight) return;
      model.pending += STYLE_CLICK_POINTS;
      punch();
    };
    const onLeave = () => {
      model.lastX = NaN;
      model.pressX = NaN;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onLeave, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = window.requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const frozen = signal?.frozen ?? false;
      if (frozen !== model.shownFrozen) {
        model.shownFrozen = frozen;
        setStyle((prev) => ({ ...prev, frozen }));
      }
      if (frozen) return;
      if (signal && signal.points > 0) {
        model.pending += signal.points;
        signal.points = 0;
        punch();
      }
      if (model.pending > 0) {
        model.gauge += model.pending;
        model.pending = 0;
        model.idle = 0;
      } else {
        model.idle += dt;
      }
      if (model.idle > STYLE_IDLE_DELAY) {
        model.gauge -= (STYLE_DRAIN_BASE + model.rank * STYLE_DRAIN_PER_RANK) * dt;
      }
      let direction: 1 | -1 | 0 = 0;
      while (model.gauge >= 100 && model.rank < STYLE_RANKS.length - 1) {
        model.rank += 1;
        model.gauge = model.gauge - 100 + STYLE_RANK_UP_CARRY;
        direction = 1;
      }
      if (model.gauge >= 100) model.gauge = 100;
      if (model.gauge <= 0) {
        if (model.rank > 0) {
          model.rank -= 1;
          model.gauge = STYLE_RANK_DOWN_GAUGE;
          direction = -1;
        } else {
          model.gauge = 0;
        }
      }
      if (signal) {
        signal.heat = Math.min((model.rank + model.gauge / 100) / (STYLE_RANKS.length - 1), 1);
      }
      const visible = model.rank > 0 || model.gauge > 0;
      if (direction !== 0 || visible !== model.shownVisible) {
        model.shownVisible = visible;
        const next = direction;
        setStyle((prev) => ({
          ...prev,
          rank: model.rank,
          change: next === 0 ? prev.change : prev.change + 1,
          direction: next === 0 ? prev.direction : next,
          visible,
        }));
      }
      const meter = refs.meter.current;
      const level = (model.gauge / 100).toFixed(3);
      if (meter && level !== model.shownLevel) {
        model.shownLevel = level;
        meter.style.setProperty("--dmc-style-level", level);
      }
    };
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onLeave);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [refs, model, reducedMotion, signal]);

  return style;
}
