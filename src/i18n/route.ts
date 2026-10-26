import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

const ROUTE_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function route(locale: Locale, ...segments: string[]): string {
  return `${ROUTE_BASE}/${[locale, ...segments].join("/")}/`;
}

function routeLocale(value: string | undefined): value is Locale {
  return (LOCALES as readonly string[]).includes(value ?? "");
}

export function legacyTarget(pathname: string, works: readonly string[]): string {
  const path = pathname.startsWith(ROUTE_BASE) ? pathname.slice(ROUTE_BASE.length) : pathname;
  const [locale, ...rest] = path.split("/").filter(Boolean);
  if (!routeLocale(locale)) return route(DEFAULT_LOCALE);
  const id = rest[rest.length - 1];
  const work = (rest.includes("works") || rest.includes("work")) && works.includes(id);
  return work ? route(locale, "work", id) : route(locale);
}
