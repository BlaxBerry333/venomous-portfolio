import type * as Theme from "@/ui/themes";
import type * as Data from "./data";
import type { UI } from "./locales/zh/ui";

export type UiTexts = typeof UI;

export type WorkLinkId = keyof UiTexts["work"]["links"];

export interface WorkEntry {
  title: string;
  text: string;
}

export interface WorkText {
  subtitle: string;
  period: string;
  role?: string;
  summary?: string;
  contributionSummary?: string;
  contributions?: readonly WorkEntry[];
  images?: Readonly<Record<string, string>>;
}

export type WorkTexts = Record<Data.WorkId, WorkText>;

export type JourneyTexts = {
  [Entry in Data.JourneyEntry as Entry["id"]]: {
    company: string;
    lang?: string;
    roles: Record<Entry["years"][number], string>;
  };
};

export interface ProfileTexts {
  hints: Record<Theme.VariantId, string>;
  about: string;
  journey: JourneyTexts;
  closing: string;
  contacts: Record<Data.ContactId, string>;
}

export interface Messages {
  UI: UiTexts;
  PROFILE: ProfileTexts;
  WORKS: WorkTexts;
}
