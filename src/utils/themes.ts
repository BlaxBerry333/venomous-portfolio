export const THEME_IDS = ["nebula"] as const;

export type Theme = (typeof THEME_IDS)[number];

export const DEFAULT_THEME: Theme = "nebula";

export function isTheme(v: unknown): v is Theme {
  return typeof v === "string" && (THEME_IDS as readonly string[]).includes(v);
}
