import type { Locale } from "@/types";
import { useMemo } from "react";
import { pickSkillCategories, type SkillCategory } from "./skills";

export function useSkillCategories(locale: Locale): SkillCategory[] {
  return useMemo(() => pickSkillCategories(locale), [locale]);
}
