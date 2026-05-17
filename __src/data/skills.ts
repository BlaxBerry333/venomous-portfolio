/**
 * Prototype-compatible bridge for prototype components.
 * Mirrors prototype's `data/skills.ts` shape: `skillCategories` + `LEVEL_META`.
 * React-aware hook 在 `./skills.hooks.tsx`（拆分原因：避免 .ts 模块经 vite SSR
 * externalize 后与 .tsx 模块拿到不同 react 实例，触发 "Invalid hook call"）。
 */
import type { Locale, SkillsJSON } from "@/types";
import { DEFAULT_LOCALE, pickLocale } from "@/utils/i18n";
import skillsJson from "./skills.json";

export type SkillLevel = "primary" | "daily" | "familiar";

export interface SkillCategory {
  label: string;
  caption: string;
  skills: string[];
  levels: Record<string, SkillLevel>;
}

const data = skillsJson as unknown as SkillsJSON;

export function pickSkillCategories(locale: Locale): SkillCategory[] {
  return data.categories.map((c) => ({
    label: pickLocale(c.label, locale),
    caption: pickLocale(c.caption, locale),
    skills: c.skills,
    levels: c.levels,
  }));
}

export const skillCategories: SkillCategory[] = pickSkillCategories(DEFAULT_LOCALE);

export const LEVEL_META: Record<SkillLevel, { label: string; weight: number }> = {
  primary: { label: "PRIMARY", weight: 3 },
  daily: { label: "DAILY", weight: 2 },
  familiar: { label: "FAMILIAR", weight: 1 },
};
