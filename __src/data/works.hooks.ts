import type { Locale } from "@/types";
import { useMemo } from "react";
import { pickWorks, type Work } from "./works";

export function useWorks(locale: Locale): Work[] {
  return useMemo(() => pickWorks(locale), [locale]);
}
