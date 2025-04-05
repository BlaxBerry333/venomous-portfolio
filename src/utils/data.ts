import profileData from "@/data/profile.json";
import skillsData from "@/data/skills.json";

// Common translations
import enCommon from "@/data/i18n/en/common.json";
import jaCommon from "@/data/i18n/ja/common.json";
import zhCommon from "@/data/i18n/zh/common.json";

// Works translations
import enWorks from "@/data/i18n/en/works.json";
import jaWorks from "@/data/i18n/ja/works.json";
import zhWorks from "@/data/i18n/zh/works.json";

// Profile translations
import enProfile from "@/data/i18n/en/profile.json";
import jaProfile from "@/data/i18n/ja/profile.json";
import zhProfile from "@/data/i18n/zh/profile.json";

import type { ProfileLocalized, SkillCategoryLocalized, SkillItem, WorkLocalized } from "@/types";
import type { Locale } from "./i18n";

/** Raw work data from i18n JSON (without skills, which is now in skills.json) */
type WorkRawDataWithoutSkills = Omit<WorkLocalized, "id" | "skills">;

// Translation files mapping
const translations = {
  ja: {
    common: jaCommon,
    works: jaWorks,
    profile: jaProfile,
  },
  en: {
    common: enCommon,
    works: enWorks,
    profile: enProfile,
  },
  zh: {
    common: zhCommon,
    works: zhWorks,
    profile: zhProfile,
  },
};

// ============================================
// Works Data (read directly from i18n files)
// ============================================

/** Work skills mapping from skills.json */
const workSkillsMap = skillsData.works as Record<string, string[]>;

/**
 * Get all works with localized content
 * Data is read from i18n works.json files, skills merged from skills.json
 */
export function getAllWorks(locale: Locale): WorkLocalized[] {
  const t = translations[locale];
  const worksMap = t.works as Record<string, WorkRawDataWithoutSkills>;

  return Object.entries(worksMap)
    .map(
      ([id, work]): WorkLocalized => ({
        id,
        ...work,
        skills: workSkillsMap[id] ?? [],
      }),
    )
    .sort((a, b) => {
      // Company first, then by date descending
      if (a.type !== b.type) return a.type === "company" ? -1 : 1;
      return new Date(b.date.start).getTime() - new Date(a.date.start).getTime();
    });
}

/**
 * Get featured works (for homepage)
 */
export function getFeaturedWorks(locale: Locale): WorkLocalized[] {
  return getAllWorks(locale).filter((work) => work.featured);
}

/**
 * Get company works only (for timeline/experience section)
 */
export function getCompanyWorks(locale: Locale): WorkLocalized[] {
  return getAllWorks(locale).filter((work) => work.type === "company");
}

/**
 * Get single work by ID
 */
export function getWorkById(id: string, locale: Locale): WorkLocalized | undefined {
  const t = translations[locale];
  const worksMap = t.works as Record<string, WorkRawDataWithoutSkills>;
  const work = worksMap[id];

  if (!work) return undefined;

  return {
    id,
    ...work,
    skills: workSkillsMap[id] ?? [],
  };
}

/**
 * Get all work IDs (for getStaticPaths)
 * Uses Japanese works as source of truth for IDs
 */
export function getAllWorkIds(): string[] {
  const worksMap = translations.ja.works as Record<string, WorkRawDataWithoutSkills>;
  return Object.keys(worksMap);
}

// ============================================
// Skills Data (metadata + i18n merged)
// ============================================

/**
 * Get skill categories with localized labels
 */
export function getSkillCategories(locale: Locale): SkillCategoryLocalized[] {
  const t = translations[locale];
  const categoryLabels = t.common.skillCategories as Record<string, string>;

  return (skillsData.categories as SkillCategoryLocalized[]).map((cat) => ({
    id: cat.id,
    label: categoryLabels[cat.id] ?? cat.id,
    skills: cat.skills,
  }));
}

/**
 * Get single skill item info
 */
export function getSkillItem(id: string): SkillItem | undefined {
  return (skillsData.items as Record<string, SkillItem>)[id];
}

/**
 * Get all skill items
 */
export function getAllSkillItems(): Record<string, SkillItem> {
  return skillsData.items as Record<string, SkillItem>;
}

/**
 * Get skill category for a given skill ID
 */
export function getSkillCategory(skillId: string): string | undefined {
  for (const category of skillsData.categories) {
    if (category.skills.includes(skillId)) {
      return category.id;
    }
  }
  return undefined;
}

/**
 * Group skill IDs by their categories
 * Returns skills organized by category with localized labels
 */
export function groupSkillsByCategory(
  skillIds: string[],
  locale: Locale,
): { categoryId: string; label: string; skills: string[] }[] {
  const t = translations[locale];
  const categoryLabels = t.common.skillCategories as Record<string, string>;

  // Group skills by category
  const grouped: Record<string, string[]> = {};
  for (const skillId of skillIds) {
    const categoryId = getSkillCategory(skillId);
    if (categoryId) {
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(skillId);
    }
  }

  // Convert to array with labels, maintaining category order
  const categoryOrder = skillsData.categories.map((c) => c.id);
  return categoryOrder
    .filter((catId) => grouped[catId]?.length > 0)
    .map((catId) => ({
      categoryId: catId,
      label: categoryLabels[catId] ?? catId,
      skills: grouped[catId],
    }));
}

// ============================================
// Profile Data (metadata + i18n merged)
// ============================================

/**
 * Get profile with localized content
 */
export function getProfile(locale: Locale): ProfileLocalized {
  const profile = profileData as {
    name: string;
    avatar: string;
    social: { github: string };
  };
  const t = translations[locale];
  const content = t.profile as Record<string, unknown>;

  return {
    // Metadata from profile.json
    name: profile.name,
    avatar: profile.avatar,
    social: profile.social,
    // i18n content from profile translations
    title: (content?.basic as Record<string, string>)?.title ?? "",
    description: (content?.description as string[]) ?? [],
  };
}

// ============================================
// Utility Functions
// ============================================

/**
 * Format date range for display
 */
export function formatDateRange(
  date: { start: string; end: string | null },
  locale: Locale,
): string {
  const t = translations[locale];
  const presentText = (t.common.common as Record<string, string>).present ?? "Present";

  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split("-");
    return `${year}.${month}`;
  };

  const start = formatDate(date.start);
  const end = date.end ? formatDate(date.end) : presentText;

  return `${start} ～ ${end}`;
}
