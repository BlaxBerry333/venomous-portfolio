import type * as Stage from "@/ui/shared/stage";
import { MathUtils } from "three";
import { CAMERA_Z } from "./strokes";

const POINTER_DRAG_MIN = 0.6;
const POINTER_SAMPLE_MIN = 0.008;
const POINTER_SAMPLE_STALE = 0.1;
const POINTER_HALF_HEIGHT = Math.tan(MathUtils.degToRad(50 / 2)) * CAMERA_Z;

export interface PointerTracker {
  halfW: number;
  halfH: number;
  pxPerUnit: number;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  speed: number;
  hasLast: boolean;
  burst: number;
  sample: { x: number; y: number; t: number; fresh: boolean };
  drag: { held: boolean; x: number; y: number; reach: number };
}

export function createPointerTracker(): PointerTracker {
  return {
    halfW: 1,
    halfH: POINTER_HALF_HEIGHT,
    pxPerUnit: 1,
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    speed: 0,
    hasLast: false,
    burst: 0,
    sample: { x: 0, y: 0, t: 0, fresh: false },
    drag: { held: false, x: 0, y: 0, reach: 0 },
  };
}

export function pixelsPerUnit(height: number): number {
  return height / (2 * POINTER_HALF_HEIGHT);
}

export function trackPointer(
  tracker: PointerTracker,
  target: Stage.InputRef["target"],
  width: number,
  height: number,
  dt: number,
) {
  tracker.halfW = POINTER_HALF_HEIGHT * (width / height);
  tracker.pxPerUnit = pixelsPerUnit(height);
  const x = target.pointerX * tracker.halfW;
  const y = target.pointerY * tracker.halfH;
  if (!target.pointerActive) tracker.hasLast = false;
  let speed = 0;
  if (tracker.hasLast) {
    const dist = Math.hypot(x - tracker.x, y - tracker.y);
    speed = dist > tracker.halfW * 2 ? 0 : Math.max((dist / dt) * tracker.pxPerUnit, tracker.burst);
  }
  tracker.burst = 0;
  tracker.prevX = tracker.hasLast ? tracker.x : x;
  tracker.prevY = tracker.hasLast ? tracker.y : y;
  tracker.x = x;
  tracker.y = y;
  tracker.speed = speed;
  tracker.hasLast = true;
}

export function pointerToScene(tracker: PointerTracker, event: PointerEvent) {
  return {
    x: ((event.clientX / window.innerWidth) * 2 - 1) * tracker.halfW,
    y: (1 - (event.clientY / window.innerHeight) * 2) * tracker.halfH,
  };
}

export function pointerPress(tracker: PointerTracker, x: number, y: number) {
  Object.assign(tracker.drag, { held: true, x, y, reach: 0 });
}

function pointerSample(tracker: PointerTracker, event: PointerEvent) {
  const { sample } = tracker;
  const t = event.timeStamp / 1000;
  const elapsed = t - sample.t;
  if (sample.fresh && elapsed < POINTER_SAMPLE_MIN) return;
  if (sample.fresh && elapsed < POINTER_SAMPLE_STALE) {
    const speed = Math.hypot(event.clientX - sample.x, event.clientY - sample.y) / elapsed;
    tracker.burst = Math.max(tracker.burst, speed);
  }
  Object.assign(sample, { x: event.clientX, y: event.clientY, t, fresh: true });
}

function pointerReach(tracker: PointerTracker, event: PointerEvent) {
  const { drag } = tracker;
  const { x, y } = pointerToScene(tracker, event);
  drag.reach = Math.max(drag.reach, Math.hypot(x - drag.x, y - drag.y));
}

export function pointerRelease(
  tracker: PointerTracker,
  event: PointerEvent,
): "click" | "drag" | null {
  const { drag } = tracker;
  if (!drag.held) return null;
  pointerReach(tracker, event);
  drag.held = false;
  return drag.reach >= POINTER_DRAG_MIN ? "drag" : "click";
}

export function listenPointer(
  tracker: PointerTracker,
  handlers: { down: (event: PointerEvent) => void; up: (event: PointerEvent) => void },
) {
  const cancel = () => {
    tracker.drag.held = false;
    tracker.sample.fresh = false;
  };
  const move = (event: PointerEvent) => {
    if (tracker.drag.held) pointerReach(tracker, event);
    const samples = event.getCoalescedEvents?.() ?? [];
    for (const sample of samples.length > 0 ? samples : [event]) pointerSample(tracker, sample);
  };
  window.addEventListener("pointerdown", handlers.down, { passive: true });
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointerup", handlers.up, { passive: true });
  window.addEventListener("pointercancel", cancel, { passive: true });
  window.addEventListener("blur", cancel);
  document.documentElement.addEventListener("pointerleave", cancel);
  return () => {
    window.removeEventListener("pointerdown", handlers.down);
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", handlers.up);
    window.removeEventListener("pointercancel", cancel);
    window.removeEventListener("blur", cancel);
    document.documentElement.removeEventListener("pointerleave", cancel);
  };
}
