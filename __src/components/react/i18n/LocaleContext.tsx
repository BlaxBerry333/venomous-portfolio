import type { Locale } from "@/types";
import { DEFAULT_LOCALE } from "@/utils/i18n";
import { createContext, useContext, type ReactNode } from "react";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

interface ProviderProps {
  locale: Locale;
  children: ReactNode;
}

export function LocaleProvider({ locale, children }: ProviderProps) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}
