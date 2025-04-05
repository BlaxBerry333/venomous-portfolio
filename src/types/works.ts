/** Work metadata (without id, used for raw JSON data) */
export interface WorkMetaBase {
  type: "company" | "personal";
  date: { start: string; end: string | null };
  image: string;
  links: {
    homepage?: string;
    github?: string;
    demo?: string;
  };
  featured: boolean;
}

/** Work metadata with skills (for final merged data) */
export interface WorkMetaWithSkills extends WorkMetaBase {
  skills: string[];
}

/** Work metadata with id (used after processing) */
export interface WorkMeta extends WorkMetaWithSkills {
  id: string;
}

/** Achievement detail item */
export interface AchievementDetail {
  title: string;
  /** Overview + results summary */
  description: string;
  /** Key technical highlights (optional) */
  highlights?: string[];
}

/** Learning detail item */
export interface LearningDetail {
  title: string;
  description: string;
}

/** Localized content fields for work items */
export interface WorkLocalizedContent {
  title: string;
  /** Short tagline for WorkCard display */
  subtitle: string;
  /** Product introduction, shown in detail page subtitle position */
  description: string;
  role: string;
  /** Company name, displayed in Timeline only (About page) */
  company?: string;
  /** Department name, displayed in Timeline only (About page) */
  department?: string;
  /** My role & contributions in this project */
  overview?: string | string[];
  achievements?: AchievementDetail[] | string[];
  achievements_summary?: string;
  learnings?: LearningDetail[] | string[];
}

/** Raw work data as stored in i18n JSON (metadata + content, without id) */
export type WorkRawData = WorkMetaBase & WorkLocalizedContent;

/**
 * Work with localized content (final type with id)
 *
 * Field usage:
 * - title: Project name, displayed everywhere
 * - subtitle: Short tagline, displayed on WorkCard only (not on detail page)
 * - description: Product introduction, displayed as subtitle position on detail page
 * - overview: What I did in this project (my role & contributions), string or string[] type
 */
export type WorkLocalized = WorkMeta & WorkLocalizedContent;
