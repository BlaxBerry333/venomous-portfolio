import { useThree } from "@react-three/fiber";
import type { EffectComposer } from "postprocessing";
import { useEffect, useRef, type RefObject } from "react";

export function useComposerSize(): RefObject<EffectComposer> {
  const composer = useRef<EffectComposer>(null);
  const dpr = useThree((state) => state.viewport.dpr);
  const size = useThree((state) => state.size);

  useEffect(() => {
    composer.current?.setSize(size.width, size.height);
  }, [dpr, size]);

  return composer;
}
