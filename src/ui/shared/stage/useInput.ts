import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { MathUtils } from "three";

export interface Input {
  scroll: number;
  pointerX: number;
  pointerY: number;
  pointerActive: boolean;
}

export interface InputRef {
  current: Input;
  target: Input;
}

function readScrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
}

export function useInput(): InputRef {
  const input = useMemo<InputRef>(
    () => ({
      current: { scroll: 0, pointerX: 0, pointerY: 0, pointerActive: false },
      target: { scroll: 0, pointerX: 0, pointerY: 0, pointerActive: false },
    }),
    [],
  );

  useEffect(() => {
    const target = input.target;
    const onScroll = () => {
      target.scroll = readScrollProgress();
    };
    const onPointer = (event: PointerEvent) => {
      target.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      target.pointerY = 1 - (event.clientY / window.innerHeight) * 2;
      target.pointerActive = true;
    };
    const onLeave = () => {
      target.pointerActive = false;
    };
    onScroll();
    input.current.scroll = target.scroll;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [input]);

  return input;
}

export function InputDriver({ input, reducedMotion }: { input: InputRef; reducedMotion: boolean }) {
  useFrame((_, delta) => {
    const step = Math.min(delta, 0.1);
    const c = input.current;
    const t = input.target;
    c.pointerActive = t.pointerActive;
    if (reducedMotion) {
      c.scroll = t.scroll;
      c.pointerX = 0;
      c.pointerY = 0;
      return;
    }
    c.scroll = MathUtils.damp(c.scroll, t.scroll, 2.6, step);
    c.pointerX = MathUtils.damp(c.pointerX, t.pointerX, 3.6, step);
    c.pointerY = MathUtils.damp(c.pointerY, t.pointerY, 3.6, step);
  });

  return null;
}
