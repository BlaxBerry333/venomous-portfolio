export const LOCALES = {
  ja: {
    label: "日本語",
    shortLabel: "日",
    htmlLang: "ja",
    urlSeg: "ja",
  },
  zh: {
    label: "中文",
    shortLabel: "中",
    htmlLang: "zh-CN",
    urlSeg: "zh",
  },
  en: {
    label: "English",
    shortLabel: "EN",
    htmlLang: "en",
    urlSeg: "en",
  },
} as const;

export type Locale = keyof typeof LOCALES;

export type Localized<T> = Record<Locale, T>;
export type LocalizedString = Localized<string>;

export const DEFAULT_LOCALE: Locale = "ja";

export const LOCALE_IDS = Object.keys(LOCALES) as Locale[];

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && v in LOCALES;
}

export function pickLocale<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value[DEFAULT_LOCALE];
}
