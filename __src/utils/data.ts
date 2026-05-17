import profileJson from "@/data/profile.json";
import skillsJson from "@/data/skills.json";
import uiJson from "@/data/ui.json";
import worksJson from "@/data/works.json";
import type { Locale, ProfileJSON, SkillsJSON, UIJSON, WorkData, WorksJSON } from "@/types";
import { pickLocale } from "./i18n";

const works = worksJson as unknown as WorksJSON;
const skills = skillsJson as unknown as SkillsJSON;
const profile = profileJson as unknown as ProfileJSON;
export const ui = uiJson as unknown as UIJSON;
export { profile, skills };

/** 从 profile.careerStartYear 推导当前是从业第几年（含起始年）。 */
export function getCareerYears(): number {
  return new Date().getFullYear() - profile.careerStartYear + 1;
}

export function getAllWorks(): WorkData[] {
  // Sort: company first, then by start date desc
  return [...works.items].sort((a, b) => {
    if (a.type !== b.type) return a.type === "company" ? -1 : 1;
    return new Date(b.date.start).getTime() - new Date(a.date.start).getTime();
  });
}

export function getAllWorkIds(): string[] {
  return works.items.map((w) => w.id);
}

export function getWorkById(id: string): WorkData | undefined {
  return works.items.find((w) => w.id === id);
}

export function getFeaturedWorks(): WorkData[] {
  return works.items.filter((w) => w.featured);
}

export function getPcFeaturedWorks(): WorkData[] {
  return works.pcFeatured
    .map((id) => works.items.find((w) => w.id === id))
    .filter((w): w is WorkData => Boolean(w));
}

export function getMobileFeaturedWorks(): WorkData[] {
  return works.mobileFeatured
    .map((id) => works.items.find((w) => w.id === id))
    .filter((w): w is WorkData => Boolean(w));
}

export function getSkillCategoryOf(skillId: string): string | undefined {
  return skills.categories.find((c) => c.skills.includes(skillId))?.id;
}

/**
 * Group skill IDs by their categories. Caller picks locale via labels.
 */
export function groupSkillsByCategory(skillIds: string[]): Array<{
  categoryId: string;
  skills: string[];
}> {
  const grouped = new Map<string, string[]>();
  for (const skillId of skillIds) {
    const cat = getSkillCategoryOf(skillId);
    if (!cat) continue;
    const list = grouped.get(cat) ?? [];
    list.push(skillId);
    grouped.set(cat, list);
  }
  // Preserve category order from skills.json
  return skills.categories
    .filter((c) => grouped.has(c.id))
    .map((c) => ({ categoryId: c.id, skills: grouped.get(c.id) ?? [] }));
}

export function formatDateRange(
  date: { start: string; end: string | null },
  locale: Locale,
): string {
  const presentText = pickLocale({ ja: "現在", en: "Present", zh: "至今" }, locale);
  const fmt = (s: string) => {
    const [y, m] = s.split("-");
    return `${y}.${m}`;
  };
  const start = fmt(date.start);
  const end = date.end ? fmt(date.end) : presentText;
  return `${start} ～ ${end}`;
}
