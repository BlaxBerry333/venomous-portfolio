export type Locale = "ja" | "en" | "zh";

export type Theme = "void" | "manga" | "zenless";

export type Localized<T> = { ja: T; en: T; zh: T };
export type LocalizedString = Localized<string>;
export type LocalizedStringArray = Localized<string[]>;

export type DemoType = "live" | "iframe" | "screenshot" | "nda";
export type WorkCategory = "company" | "personal";
export type SkillLevel = "primary" | "daily" | "familiar";
export type SkillCategoryId = "frontend" | "backend" | "graphics" | "infra";

export interface ChallengeItem {
  problem: string;
  solution: string;
}

export interface BusinessValueItem {
  label: string;
  value: number;
  suffix: string;
}

export interface WorkData {
  id: string;
  type: WorkCategory;
  demoType: DemoType;
  cover: string;
  date: { start: string; end: string | null };
  techStack: string[];
  liveUrl?: string;
  iframeUrl?: string;
  ndaKeywords?: string[];
  screenshots?: string[];
  featured: boolean;
  links: { homepage?: string; github?: string; demo?: string };
  // Localized
  title: LocalizedString;
  subtitle: LocalizedString;
  myRole: LocalizedString;
  contributions: LocalizedStringArray;
  challenges: Localized<ChallengeItem[]>;
  businessValue: Localized<BusinessValueItem[]>;
}

export interface WorksJSON {
  items: WorkData[];
  pcFeatured: string[];
  mobileFeatured: string[];
}

export interface SkillsJSON {
  categories: Array<{
    id: SkillCategoryId;
    label: LocalizedString;
    caption: LocalizedString;
    skills: string[];
    levels: Record<string, SkillLevel>;
  }>;
  items: Record<string, { label: string; icon: string }>;
}

export interface ProfileJSON {
  name: string;
  avatar: string;
  careerStartYear: number;
  social: { github: string; linkedin?: string; twitter?: string };
  title: LocalizedString;
  description: LocalizedStringArray;
  cta: {
    primary: { label: LocalizedString; href: string };
    secondary: Array<{ label: LocalizedString; href: string }>;
  };
}

export interface UIJSON {
  manifesto: LocalizedStringArray;
  cta: { themeHint: LocalizedString; headingLines: LocalizedStringArray };
  heroSubtitle: LocalizedString;
  detail: {
    sections: LocalizedStringArray;
    nda: { redacted: LocalizedString };
  };
  manga: { onomatopoeia: string[] };
  aboutBio: LocalizedStringArray;
  nav: {
    home: LocalizedString;
    works: LocalizedString;
    about: LocalizedString;
    codex: LocalizedString;
    resume: LocalizedString;
    backToShowcase: LocalizedString;
  };
}
