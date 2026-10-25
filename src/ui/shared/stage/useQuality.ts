import { useState } from "react";

export interface Quality {
  mobile: boolean;
  reducedMotion: boolean;
}

function readQuality(): Quality {
  return {
    mobile: window.matchMedia("(max-width: 768px), (pointer: coarse)").matches,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
}

export function useQuality(): Quality {
  const [quality] = useState(readQuality);
  return quality;
}
