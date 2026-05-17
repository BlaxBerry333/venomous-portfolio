/**
 * Prototype-compatible bridge for prototype components.
 * Surfaces the same exports as prototype's `data/works.ts`, sourced from
 * `data/works.json` and locale-resolved via React context.
 * React-aware hook 在 `./works.hooks.tsx`（拆分原因：避免 .ts 模块经 vite SSR
 * externalize 后与 .tsx 模块拿到不同 react 实例，触发 "Invalid hook call"）。
 */
import type {
  BusinessValueItem,
  ChallengeItem,
  Locale,
  Localized,
  WorkData,
  WorksJSON,
} from "@/types";
import { DEFAULT_LOCALE, pickLocale } from "@/utils/i18n";
import worksJson from "./works.json";

export type DemoType = "live" | "iframe" | "screenshot" | "nda";
export type WorkCategory = "company" | "personal";

/** Prototype-shape Work (single locale resolved). */
export interface Work {
  id: string;
  title: string;
  subtitle: string;
  category: WorkCategory;
  demoType: DemoType;
  cover: string;
  techStack: string[];
  myRole: string;
  contributions: string[];
  challenges: ChallengeItem[];
  businessValue: BusinessValueItem[];
  ndaKeywords?: string[];
  liveUrl?: string;
  iframeUrl?: string;
  screenshots?: string[];
}

const data = worksJson as unknown as WorksJSON;

function resolveWork(w: WorkData, locale: Locale): Work {
  return {
    id: w.id,
    title: pickLocale(w.title, locale),
    subtitle: pickLocale(w.subtitle, locale),
    category: w.type,
    demoType: w.demoType,
    cover: w.cover,
    techStack: w.techStack,
    myRole: pickLocale(w.myRole, locale),
    contributions: pickLocale<string[]>(w.contributions as Localized<string[]>, locale),
    challenges: pickLocale<ChallengeItem[]>(w.challenges as Localized<ChallengeItem[]>, locale),
    businessValue: pickLocale<BusinessValueItem[]>(
      w.businessValue as Localized<BusinessValueItem[]>,
      locale,
    ),
    ndaKeywords: w.ndaKeywords,
    liveUrl: w.liveUrl,
    iframeUrl: w.iframeUrl,
    screenshots: w.screenshots,
  };
}

export function pickWorks(locale: Locale): Work[] {
  return data.items.map((w) => resolveWork(w, locale));
}

/** Default export resolves to ja locale; for SSR-time and non-locale-aware imports. */
export const works: Work[] = pickWorks(DEFAULT_LOCALE);

export const featuredWorkIds: string[] = data.items.map((w) => w.id);
export const pcFeaturedWorkIds: string[] = data.pcFeatured;
export const mobileFeaturedWorkIds: string[] = data.mobileFeatured;
