import type { Locale } from "../config";
import { MESSAGES } from "../locales";

interface JourneyText {
  company: string;
  lang?: string;
  roles: Readonly<Record<string, string>>;
}

export const CLAIM = "CHEN’S\nPORTFOLIO";

export const CLOSING_QUOTE =
  "In the grim darkness of the far future, there is only war.\nLet's rock!";

export const JOURNEY = [
  { id: "geniee", years: ["2026", "2025", "2023"] },
  { id: "skyfall", years: ["2023"] },
  { id: "fni", years: ["2019"] },
  { id: "freelance", years: ["2018"] },
] as const;

export type JourneyEntry = (typeof JOURNEY)[number];

export const CONTACTS = [{ id: "github", href: import.meta.env.PUBLIC_GITHUB_URL }] as const;

export type ContactId = (typeof CONTACTS)[number]["id"];

export function localizedJourney(locale: Locale) {
  const texts: Readonly<Record<string, JourneyText>> = MESSAGES[locale].PROFILE.journey;
  return JOURNEY.map((entry) => {
    const text = texts[entry.id];
    return {
      company: text.company,
      lang: text.lang,
      roles: entry.years.map((year) => ({ year, text: text.roles[year] })),
    };
  });
}

export function localizedContacts(locale: Locale) {
  const texts = MESSAGES[locale].PROFILE.contacts;
  return CONTACTS.map((contact) => ({ href: contact.href, text: texts[contact.id] }));
}
