import type { Locale } from "./config";

export function route(locale: Locale, ...segments: string[]): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${[locale, ...segments].join("/")}/`;
}
