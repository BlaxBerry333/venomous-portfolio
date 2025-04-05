export type Locale = "ja" | "en" | "zh";

/** Profile metadata stored in profile.json */
export interface ProfileMeta {
  name: string;
  avatar: string;
  social: {
    github: string;
    linkedin?: string;
    twitter?: string;
  };
}

/** Profile with localized content (merged from profile.json + i18n) */
export interface ProfileLocalized {
  name: string;
  avatar: string;
  social: {
    github: string;
    linkedin?: string;
    twitter?: string;
  };
  title: string;
  description: string[];
}
