import PORTFOLIO_DANTE from "@/assets/works/venomous-portfolio/dante.webp";
import PORTFOLIO_SLAANESH from "@/assets/works/venomous-portfolio/slaanesh.webp";
import PORTFOLIO_TZEENTCH from "@/assets/works/venomous-portfolio/tzeentch.webp";
import PORTFOLIO_VERGIL from "@/assets/works/venomous-portfolio/vergil.webp";
import type * as UI from "@/ui/shared/kit";
import type { Locale } from "../config";
import { MESSAGES } from "../locales";
import type { WorkEntry, WorkLinkId } from "../types";

interface WorkSource {
  id: string;
  title: string;
  personal?: boolean;
  years?: string;
  arts: readonly (keyof typeof UI.Art)[];
  images?: Readonly<Record<string, ImageMetadata>>;
  stack?: readonly string[];
  links?: readonly { id: WorkLinkId; href: string }[];
  related?: readonly string[];
}

export interface Work {
  id: WorkId;
  title: string;
  subtitle: string;
  period: string;
  personal?: boolean;
  years?: string;
  arts: readonly (keyof typeof UI.Art)[];
  images?: readonly { src: ImageMetadata; alt: string }[];
  stack?: readonly string[];
  role?: string;
  links?: readonly { href: string; text: string }[];
  summary?: string;
  contributionSummary?: string;
  contributions?: readonly WorkEntry[];
  related?: readonly string[];
}

export const WORKS = [
  {
    id: "geniee-x",
    title: "GENIEE-X",
    arts: ["Platform", "DesignSystem"],
    related: ["geniee-cdp", "geniee-chat"],
  },
  {
    id: "geniee-cdp",
    title: "GENIEE CDP",
    arts: ["Gateway", "Charts"],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "tRPC",
      "Casbin",
      "MUI",
      "Go",
      "Python",
      "GCP",
      "BigQuery",
      "AWS S3",
      "GTM",
      "GA4",
    ],
    links: [
      {
        id: "product",
        href: "https://cx.geniee.co.jp/product/cdp/",
      },
    ],
    related: ["geniee-chat", "geniee-x"],
  },
  {
    id: "geniee-chat",
    title: "GENIEE CHAT",
    arts: ["Workflow", "Migration"],
    stack: [
      "React",
      "TypeScript",
      "React Flow",
      "Vite",
      "Vitest",
      "Zod",
      "MUI",
      "Node.js",
      "Python",
      "Django",
      "Go",
      "Protocol Buffers",
    ],
    links: [
      {
        id: "product",
        href: "https://cx.geniee.co.jp/product/chat/",
      },
    ],
    related: ["geniee-cdp", "geniee-x"],
  },
  {
    id: "skyfall-skyflag",
    title: "SKYFLAG",
    arts: ["Ads"],
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Vitest",
      "Refine",
      "TanStack Query",
      "Ant Design",
      "Storybook",
      "Docusaurus",
    ],
  },
  {
    id: "fni-saga-sunrise-park",
    title: "SAGA Sunrise Park",
    arts: ["Booking"],
    stack: [
      "React",
      "TypeScript",
      "Gatsby.js",
      "Ant Design",
      "Sass",
      "GraphQL",
      "Django",
      "Docker",
      "Docusaurus",
    ],
  },
  {
    id: "venomous-portfolio",
    title: "THIS SITE",
    personal: true,
    arts: [],
    images: {
      tzeentch: PORTFOLIO_TZEENTCH,
      slaanesh: PORTFOLIO_SLAANESH,
      dante: PORTFOLIO_DANTE,
      vergil: PORTFOLIO_VERGIL,
    },
    stack: [
      "Astro",
      "React",
      "TypeScript",
      "Three.js",
      "React Three Fiber",
      "GLSL",
      "postprocessing",
      "Sass",
    ],
  },
] as const satisfies readonly WorkSource[];

export type WorkId = (typeof WORKS)[number]["id"];

const WORK_SOURCES: readonly (WorkSource & { id: WorkId })[] = WORKS;

export function localizedWorks(locale: Locale): readonly Work[] {
  const messages = MESSAGES[locale];
  return WORK_SOURCES.map((work) => {
    const text = messages.WORKS[work.id];
    return {
      id: work.id,
      title: work.title,
      subtitle: text.subtitle,
      period: text.period,
      personal: work.personal,
      years: work.years,
      arts: work.arts,
      images:
        work.images &&
        Object.entries(work.images).map(([key, src]) => ({ src, alt: text.images?.[key] ?? "" })),
      stack: work.stack,
      role: text.role,
      links: work.links?.map((link) => ({
        href: link.href,
        text: messages.UI.work.links[link.id],
      })),
      summary: text.summary,
      contributionSummary: text.contributionSummary,
      contributions: text.contributions,
      related: work.related,
    };
  });
}
