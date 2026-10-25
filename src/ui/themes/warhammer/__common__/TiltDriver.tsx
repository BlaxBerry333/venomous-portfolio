import type * as Stage from "@/ui/shared/stage";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";

const TILT_STEP = 0.004;

const TILT_TARGETS = ".ui-button, .ui-panel, .ui-tags__item, .ui-card";

export function TiltDriver({ input }: { input: Stage.InputRef }) {
  const last = useMemo(() => ({ x: Infinity, y: Infinity }), []);

  useEffect(
    () => () => {
      document.querySelectorAll<HTMLElement>(TILT_TARGETS).forEach((element) => {
        element.style.removeProperty("--warhammer-tilt-x");
        element.style.removeProperty("--warhammer-tilt-y");
      });
    },
    [],
  );

  useFrame(() => {
    const { pointerX, pointerY } = input.current;
    if (Math.abs(pointerX - last.x) < TILT_STEP && Math.abs(pointerY - last.y) < TILT_STEP) return;
    last.x = pointerX;
    last.y = pointerY;
    const x = pointerX.toFixed(3);
    const y = pointerY.toFixed(3);
    document.querySelectorAll<HTMLElement>(TILT_TARGETS).forEach((element) => {
      element.style.setProperty("--warhammer-tilt-x", x);
      element.style.setProperty("--warhammer-tilt-y", y);
    });
  });

  return null;
}
