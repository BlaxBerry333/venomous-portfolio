import type { Locale, Localized, Theme } from "@/types";

export const DEFAULT_LOCALE: Locale = "ja";
export const LOCALES: Locale[] = ["ja", "en", "zh"];
export const NON_DEFAULT_LOCALES: Locale[] = ["en", "zh"];

export const DEFAULT_THEME: Theme = "void";
export const THEMES: Theme[] = ["void", "manga", "zenless"];

const LOCALE_DISPLAY: Record<Locale, string> = {
  ja: "日本語",
  en: "English",
  zh: "中文",
};

export function isLocale(v: unknown): v is Locale {
  return v === "ja" || v === "en" || v === "zh";
}

export function isTheme(v: unknown): v is Theme {
  return v === "void" || v === "manga" || v === "zenless";
}

export function getLocaleFromPath(pathname: string): Locale {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathWithoutBase = pathname.replace(new RegExp(`^${base}`), "");
  const match = pathWithoutBase.match(/^\/(ja|en|zh)(?:\/|$)/);
  return match ? (match[1] as Locale) : DEFAULT_LOCALE;
}

export function getThemeFromPath(pathname: string): Theme | null {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathWithoutBase = pathname.replace(new RegExp(`^${base}`), "");
  const match = pathWithoutBase.match(/^\/(?:ja|en|zh)\/(void|manga|zenless)(?:\/|$)/);
  return match ? (match[1] as Theme) : null;
}

/**
 * Resolve a `Localized<T>` value to the given locale, falling back to ja.
 * Accepts plain T as a shortcut (returns it unchanged).
 */
export function pickLocale<T>(value: Localized<T> | T, locale: Locale): T {
  if (
    value &&
    typeof value === "object" &&
    "ja" in (value as Record<string, unknown>) &&
    "en" in (value as Record<string, unknown>) &&
    "zh" in (value as Record<string, unknown>)
  ) {
    const v = value as Localized<T>;
    return v[locale] ?? v[DEFAULT_LOCALE];
  }
  return value as T;
}

export function getLocaleStaticPaths() {
  return LOCALES.map((lang) => ({ params: { lang } }));
}

export function getLocaleThemeStaticPaths() {
  return LOCALES.flatMap((lang) => THEMES.map((theme) => ({ params: { lang, theme } })));
}

export function getLocaleWorkStaticPaths(workIds: string[]) {
  return LOCALES.flatMap((lang) => workIds.map((id) => ({ params: { lang, id } })));
}

export function getLocaleThemeWorkStaticPaths(workIds: string[]) {
  return LOCALES.flatMap((lang) =>
    THEMES.flatMap((theme) => workIds.map((id) => ({ params: { lang, theme, id } }))),
  );
}

export function getLocalePath(locale: Locale): string {
  return `/${locale}`;
}

export function getLocalizedUrl(path: string, locale: Locale, theme?: Theme): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const prefix = getLocalePath(locale);
  const themeSeg = theme ? `/${theme}` : "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${prefix}${themeSeg}${normalizedPath}`;
}

export function getLocaleDisplayName(locale: Locale): string {
  return LOCALE_DISPLAY[locale];
}
