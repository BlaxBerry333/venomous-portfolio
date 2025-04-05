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

export type Locale = "ja" | "en" | "zh";
export type Namespace = "common" | "works" | "profile";
export const DEFAULT_LOCALE: Locale = "ja";
export const LOCALES: Locale[] = ["ja", "en", "zh"];
export const NON_DEFAULT_LOCALES: Locale[] = ["en", "zh"];

// Namespace-based translations
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
} as const;

/**
 * Parse locale from URL pathname (handles BASE_URL prefix)
 * @example "/venomous-portfolio/en/works" -> "en"
 * @example "/venomous-portfolio/ja/works" -> "ja"
 * @example "/en/works" -> "en"
 * @example "/works" -> "ja" (default)
 */
export function getLocaleFromPath(pathname: string): Locale {
  // Remove base URL prefix if present
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathWithoutBase = pathname.replace(new RegExp(`^${base}`), "");
  const match = pathWithoutBase.match(/^\/(ja|en|zh)(?:\/|$)/);
  return match ? (match[1] as Locale) : DEFAULT_LOCALE;
}

/**
 * Get UI translation text from common namespace
 * @param key Dot-separated path, e.g. "hero.cta.works"
 * @param locale Language code
 */
export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  const keys = key.split(".");
  let result: unknown = translations[locale].common;

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      // Fallback to Japanese
      result = translations.ja.common;
      for (const fallbackKey of keys) {
        if (result && typeof result === "object" && fallbackKey in result) {
          result = (result as Record<string, unknown>)[fallbackKey];
        } else {
          return key; // Return key if not found
        }
      }
      break;
    }
  }

  return typeof result === "string" ? result : key;
}

/**
 * Get translation from a specific namespace
 * @param namespace The namespace (common, works, profile)
 * @param key Dot-separated path within the namespace
 * @param locale Language code
 */
export function tNs<T = unknown>(
  namespace: Namespace,
  key: string,
  locale: Locale = DEFAULT_LOCALE,
): T {
  const keys = key.split(".");
  let result: unknown = translations[locale][namespace];

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      // Fallback to Japanese
      result = translations.ja[namespace];
      for (const fallbackKey of keys) {
        if (result && typeof result === "object" && fallbackKey in result) {
          result = (result as Record<string, unknown>)[fallbackKey];
        } else {
          return key as T; // Return key if not found
        }
      }
      break;
    }
  }

  return result as T;
}

/**
 * Get work translation by work ID
 * @param workId The work ID (e.g., "geniee-cdp")
 * @param locale Language code
 */
export function getWorkTranslation(workId: string, locale: Locale = DEFAULT_LOCALE) {
  return tNs<Record<string, unknown>>("works", workId, locale);
}

/**
 * Get all works translations for a locale
 */
export function getAllWorksTranslations(locale: Locale = DEFAULT_LOCALE) {
  return translations[locale].works;
}

/**
 * Get profile translation
 * @param locale Language code
 */
export function getProfileTranslation(locale: Locale = DEFAULT_LOCALE) {
  return translations[locale].profile;
}

/**
 * Get URL path prefix for locale
 * @example "ja" -> "/ja"
 * @example "en" -> "/en"
 */
export function getLocalePath(locale: Locale): string {
  return `/${locale}`;
}

/**
 * Generate getStaticPaths for [lang] dynamic routes
 * Used in src/pages/[lang]/*.astro
 * Returns all locales including default (ja)
 */
export function getLocaleStaticPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}

/**
 * Generate full URL with locale and base path
 * @example getLocalizedUrl("/works", "en") -> "/venomous-portfolio/en/works"
 * @example getLocalizedUrl("/works", "ja") -> "/venomous-portfolio/ja/works"
 */
export function getLocalizedUrl(path: string, locale: Locale): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, ""); // Remove trailing slash
  const prefix = getLocalePath(locale);
  return `${base}${prefix}${path}`;
}

/**
 * Get common translations object for a locale
 * @deprecated Use tNs("common", key, locale) instead for specific keys
 */
export function getTranslations(locale: Locale) {
  return translations[locale].common;
}

/**
 * Get locale display name
 */
export function getLocaleDisplayName(locale: Locale): string {
  const names: Record<Locale, string> = {
    ja: "日本語",
    en: "English",
    zh: "中文",
  };
  return names[locale];
}

/**
 * Generate getStaticPaths for [lang]/works/[id] dynamic routes
 * Combines all locales with all work IDs
 */
export function getLocaleWorkStaticPaths(workIds: string[]) {
  return LOCALES.flatMap((lang) => workIds.map((id) => ({ params: { lang, id } })));
}
