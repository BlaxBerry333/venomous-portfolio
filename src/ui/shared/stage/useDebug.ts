import { createContext, useContext, type ReactNode } from "react";

export interface DebugOptions {
  forcedTier: number | null;
  probe: ReactNode;
}

export const DebugContext = createContext<DebugOptions>({
  forcedTier: null,
  probe: null,
});

export function useDebug(): DebugOptions {
  return useContext(DebugContext);
}
