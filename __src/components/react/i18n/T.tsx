import type { Locale, Localized } from "@/types";
import { pickLocale } from "@/utils/i18n";
import type { ReactNode } from "react";
import { useLocale } from "./LocaleContext";

interface Props<T> {
  value: Localized<T> | T;
  /** Optional explicit locale; falls back to context. Useful for static MDX render where Context is unavailable. */
  locale?: Locale;
  /** Render fn for non-string values (e.g. arrays). */
  render?: (resolved: T) => ReactNode;
}

export function T<T = string>({ value, locale, render }: Props<T>) {
  const ctxLocale = useLocale();
  const resolved = pickLocale(value, locale ?? ctxLocale);
  if (render) return <>{render(resolved as T)}</>;
  return <>{resolved as ReactNode}</>;
}
