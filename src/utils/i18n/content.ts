import metaRaw from "@/i18n/meta.json";
import pageAboutRaw from "@/i18n/page-about.json";
import pageHomeRaw from "@/i18n/page-home.json";
import pageWorkDetailRaw from "@/i18n/page-work-detail.json";
import pageWorksRaw from "@/i18n/page-works.json";
import skillsRaw from "@/i18n/skills.json";
import themesRaw from "@/i18n/themes.json";
import timelineRaw from "@/i18n/timeline.json";
import worksRaw from "@/i18n/works.json";
import type { Theme } from "../themes";
import { pickLocale, type Locale, type LocalizedString } from "./core";

// ==================================================
// meta（meta.json，tab title 与跨页面共用的零散文案）
// ==================================================
export type PageKey = "home" | "works" | "about" | "designSystem" | "notFound";

interface MetaRaw {
  shared: {
    all: LocalizedString;
  };
  home: { title: LocalizedString };
  works: { title: LocalizedString };
  about: { title: LocalizedString };
  designSystem: { title: LocalizedString };
  notFound: {
    title: LocalizedString;
    heading: LocalizedString;
    description: LocalizedString;
    returnHomeText: LocalizedString;
  };
}

const meta = metaRaw as MetaRaw;

export function getPageTitle(locale: Locale, page: PageKey): string {
  return pickLocale(meta[page].title, locale);
}

/** 跨页面共用的「全部」文案（如作品筛选的 all 选项） */
export function getSharedAllText(locale: Locale): string {
  return pickLocale(meta.shared.all, locale);
}

export type NotFoundMeta = MetaRaw["notFound"];

export function loadNotFoundMeta(): NotFoundMeta {
  return meta.notFound;
}

// ==================================================
// skills（skills.json，全局技能池）
//   area   — 技能领域，自带多语言名字，按 id 索引
//   level  — 熟练等级，自带多语言名字，按 id 索引
//   skills — 技能本体，按 id 索引，引用 area / level 的 id
// ==================================================
export type SkillAreaId = keyof typeof skillsRaw.area;
export type SkillLevel = keyof typeof skillsRaw.level;

interface SkillsRaw {
  area: Record<SkillAreaId, LocalizedString>;
  level: Record<SkillLevel, LocalizedString>;
  skills: Record<string, { label: string; area: SkillAreaId; level: SkillLevel }>;
}

const skillsData = skillsRaw as SkillsRaw;

/** 单个技能，level / area 已展开为当前语言的展示文案 */
export interface Skill {
  id: string;
  label: string;
  area: SkillAreaId;
  areaName: string;
  level: SkillLevel;
  levelName: string;
}

/** 一个领域 + 其名下的技能集合 */
export interface SkillArea {
  id: SkillAreaId;
  name: string;
  skills: Skill[];
}

/** 展示侧默认剔除的技能 id（已退出主流 / 不需要在首页显示）*/
export const EXCLUDED_SKILL_IDS = new Set<Skill["id"]>([
  "art-template",
  "ant-design",
  "casbin",
  "docusaurus",
  "framer-motion",
  "gatsby",
  "jest",
  "jquery",
  "less",
  "playwright",
  "python-drf",
  "react-three-fiber",
  "refine",
  "shell",
  "tailwind-css",
  "webpack",
]);

export function getSkillById(id: string, locale: Locale): Skill {
  const raw = skillsData.skills[id];
  if (!raw) {
    throw new Error(`Unknown skill id: "${id}" — check src/i18n/skills.json`);
  }
  return {
    id,
    label: raw.label,
    area: raw.area,
    areaName: pickLocale(skillsData.area[raw.area], locale),
    level: raw.level,
    levelName: pickLocale(skillsData.level[raw.level], locale),
  };
}

export function getSkillsByIds(ids: string[], locale: Locale): Skill[] {
  return ids.flatMap((id) => {
    if (!skillsData.skills[id]) {
      console.warn(`[i18n] skill id "${id}" not found in skills.json`);
      return [];
    }
    return [getSkillById(id, locale)];
  });
}

/** 取某个领域 + 其名下全部技能（保持 skills.json 中的声明顺序） */
export function getSkillArea(areaId: string, locale: Locale): SkillArea {
  const areaName = skillsData.area[areaId as SkillAreaId];
  if (!areaName) {
    throw new Error(`Unknown skill area id: "${areaId}" — check src/i18n/skills.json`);
  }
  const skills = Object.keys(skillsData.skills)
    .filter((id) => skillsData.skills[id].area === areaId)
    .map((id) => getSkillById(id, locale));
  return { id: areaId as SkillAreaId, name: pickLocale(areaName, locale), skills };
}

/** 取全部领域 + 各自名下技能（保持 skills.json 中 area 的声明顺序） */
export function getAllSkillAreas(locale: Locale): SkillArea[] {
  return Object.keys(skillsData.area).map((id) => getSkillArea(id, locale));
}

// ==================================================
// works（works.json，全局作品池）
//   area  — 作品类别（职业 / 个人），自带多语言名字，按 id 索引
//   works — 作品本体，按 id 索引，引用 area 的 id；
//           职业 / 个人各有专属字段块（professional / personal），按 area 二选一
// ==================================================
export type WorkAreaId = keyof typeof worksRaw.area;

/** 外链：url + 三语 label，label 由作品自身声明（不再走全局 type 枚举） */
export interface WorkLink {
  url: string;
  /** 按钮文案（已展开为当前语言） */
  label: string;
  /** 链接已失效（产品下线 / 域名废弃等），渲染为不可点击 */
  disabled?: boolean;
}

interface WorkLinkRaw {
  url: string;
  label: LocalizedString;
  disabled?: boolean;
}

/** 职业作品专属字段（area === "professional"），各字段已展开为当前语言 */
export interface WorkProfessional {
  /** 担当角色 */
  role: string;
  /** 成果与对团队 / 产品的贡献，逐条罗列 */
  achievements: string[];
  /** 绩效评估 */
  performance: string;
}

/** 个人作品专属字段（area === "personal"），各字段已展开为当前语言 */
export interface WorkPersonal {
  /** 学会 / 经历 / 成长了什么，逐条罗列 */
  learnings: string[];
}

interface WorkProfessionalRaw {
  role: LocalizedString;
  achievements: LocalizedString[];
  performance: LocalizedString;
}

interface WorkPersonalRaw {
  learnings: LocalizedString[];
}

/**
 * 卡片预览图样式编码（白名单）。
 * 主题用它决定卡片缩略图怎么画（nebula 走 WorkPreviewMock 的 dashboard / editor / ...）。
 * 字段中性，新主题可基于同一组 code 实现自己的渲染。
 */
export type WorkPreviewCode =
  | "analytics"
  | "editor"
  | "terminal"
  | "workflow"
  | "blocks"
  | "widgets"
  | "chat"
  | "diff"
  | "gallery"
  | "campus";

const WORK_PREVIEW_CODES: readonly WorkPreviewCode[] = [
  "analytics",
  "editor",
  "terminal",
  "workflow",
  "blocks",
  "widgets",
  "chat",
  "diff",
  "gallery",
  "campus",
];

function parsePreviewCode(v: unknown): WorkPreviewCode | undefined {
  return typeof v === "string" && (WORK_PREVIEW_CODES as readonly string[]).includes(v)
    ? (v as WorkPreviewCode)
    : undefined;
}

interface WorkRaw {
  area: WorkAreaId;
  /** 作品周期，自带多语言（如「2024.04 – 2025.03」） */
  period: LocalizedString;
  title: LocalizedString;
  /** 作品简要说明，2-3 句；详情页 Overview section 中展示 */
  description: LocalizedString;
  /** 产品背景 / 课题 / 立项原因；详情页 Overview 中接在 description 之后 */
  background: LocalizedString;
  /**
   * 技术栈：引用 skills.json 的 skill id，按 id 索引到全局技能池。
   * 展示侧按 skill.area 自动分组，故此处只需扁平数组、顺序无关。
   */
  skills?: string[];
  /** 外部链接，可空 */
  links?: WorkLinkRaw[];
  /** 职业作品专属块；area === "professional" 时存在 */
  professional?: WorkProfessionalRaw;
  /** 个人作品专属块；area === "personal" 时存在 */
  personal?: WorkPersonalRaw;
  /**
   * 卡片预览图样式编码；未指定则按 id hash 自动分配。
   * raw 层留 string（json 不强校验）；getWorkById 会 parse 到 WorkPreviewCode。
   */
  previewCode?: string;
}

interface WorksRaw {
  area: Record<WorkAreaId, LocalizedString>;
  works: Record<string, WorkRaw>;
}

const worksData = worksRaw as WorksRaw;

/** 单个作品的通用字段，area / 技术栈均已展开为当前语言的展示数据 */
interface WorkBase {
  id: string;
  areaName: string;
  /** 作品周期展示字符串 */
  period: string;
  title: string;
  description: string;
  /** 产品背景 / 课题 / 立项原因；详情页 Overview 中接在 description 之后 */
  background: string;
  /**
   * 技术栈：扁平 Skill[]，已由 works.json 的 skill id 展开为当前语言。
   * 展示侧按 skill.area 自动分组（见 SkillHiveCellCards），故此处不再保留人工分组。
   */
  skills: Skill[];
  /** 外部链接；无则为空数组 */
  links: WorkLink[];
  /**
   * 卡片预览图样式编码（白名单 WorkPreviewCode）。
   * 未指定时由各主题按 id hash 自动选择；指定时优先采用。
   */
  previewCode?: WorkPreviewCode;
}

/**
 * 单个作品。area 是可辨识联合的判别字段：
 *   area === "professional" → 带 professional 块
 *   area === "personal"     → 带 personal 块
 * 详情页据此类型安全地分支渲染。
 */
export type Work =
  | (WorkBase & { area: "professional"; professional: WorkProfessional })
  | (WorkBase & { area: "personal"; personal: WorkPersonal });

/** 一个作品类别（职业 / 个人） */
export interface WorkArea {
  id: WorkAreaId;
  name: string;
}

export function getAllWorkIds(): string[] {
  return Object.keys(worksData.works);
}

export function getWorkById(id: string, locale: Locale): Work | undefined {
  const raw = worksData.works[id];
  if (!raw) return undefined;

  const base: WorkBase = {
    id,
    areaName: pickLocale(worksData.area[raw.area], locale),
    period: pickLocale(raw.period, locale),
    title: pickLocale(raw.title, locale),
    description: pickLocale(raw.description, locale),
    background: pickLocale(raw.background, locale),
    skills: getSkillsByIds(raw.skills ?? [], locale),
    links: (raw.links ?? []).map((l) => ({
      url: l.url,
      label: pickLocale(l.label, locale),
      disabled: l.disabled,
    })),
    previewCode: parsePreviewCode(raw.previewCode),
  };

  if (raw.area === "professional") {
    const p = raw.professional;
    if (!p) {
      throw new Error(`Work "${id}" is professional but missing "professional" block`);
    }
    return {
      ...base,
      area: "professional",
      professional: {
        role: pickLocale(p.role, locale),
        achievements: p.achievements.map((a) => pickLocale(a, locale)),
        performance: pickLocale(p.performance, locale),
      },
    };
  }

  const p = raw.personal;
  if (!p) {
    throw new Error(`Work "${id}" is personal but missing "personal" block`);
  }
  return {
    ...base,
    area: "personal",
    personal: {
      learnings: p.learnings.map((l) => pickLocale(l, locale)),
    },
  };
}

/**
 * 解析 period 字符串首段 "YYYY.MM" 为可比较的数字，用作排序键。
 * 计算方式：`YYYY * 100 + MM`；首段无法匹配时回退 0。
 *
 * 三语 period 均以 "YYYY.MM" 起始（分隔符不同但数字格式一致），
 * 因此同一正则在 zh / ja / en 下都可用。
 */
function parsePeriodStart(period: string): number {
  const m = period.match(/(\d{4})\.(\d{1,2})/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 100 + parseInt(m[2], 10);
}

/**
 * 取全部作品。按 period 起始时间倒序（最近的在前）。
 * 全站作品顺序的单一来源：首页 Featured、作品列表页、筛选结果都用这个顺序。
 */
export function getAllWorks(locale: Locale): Work[] {
  return getAllWorkIds()
    .map((id) => getWorkById(id, locale)!)
    .sort((a, b) => parsePeriodStart(b.period) - parsePeriodStart(a.period));
}

/**
 * 取首页 Featured Projects 要展示的作品：
 *   professional 类别按 period 倒序的前 N 个（默认 3）。
 *   不再依赖 works.json 中的 featured 字段，单一来源就是 period 与 area。
 */
export function getFeaturedWorks(locale: Locale, n: number = 3): Work[] {
  return getAllWorks(locale)
    .filter((w) => w.area === "professional")
    .slice(0, n);
}

/** 取全部作品类别（保持 works.json 中 area 的声明顺序） */
export function getAllWorkAreas(locale: Locale): WorkArea[] {
  return (Object.keys(worksData.area) as WorkAreaId[]).map((id) => ({
    id,
    name: pickLocale(worksData.area[id], locale),
  }));
}

// ==================================================
// timeline（timeline.json，经历列表）
//   title — 段落标题，自带多语言
//   items — 经历条目，按声明顺序（一般倒序排列：最近的在前）
//
// 字段说明：
//   period      — 期间，多语言
//   company     — 公司名，多语言
//   department  — 所在部门，多语言；可选（未确定时可省略）
//   role        — 职位，多语言
//   workIds     — 参与项目，引用 works.json 的作品 id；
//                 此处只存 id，展开时从 works 池取 title 拼接
// ==================================================
interface TimelineItemRaw {
  id: string;
  period: LocalizedString;
  company: LocalizedString;
  department?: LocalizedString;
  role: LocalizedString;
  workIds?: string[];
}

interface TimelineRaw {
  title: LocalizedString;
  items: TimelineItemRaw[];
}

const timelineData = timelineRaw as TimelineRaw;

/** 单个参与项目，title 已从 works.json 展开为当前语言 */
export interface TimelineProduct {
  /** works.json 中的作品 id，用于详情页跳转 */
  workId: string;
  /** 取自对应作品的 title */
  title: string;
}

/** 单条经历，各字段已展开为当前语言 */
export interface TimelineItem {
  id: string;
  period: string;
  company: string;
  department?: string;
  role: string;
  products: TimelineProduct[];
}

/** 经历段落：标题 + 条目列表 */
export interface Timeline {
  title: string;
  items: TimelineItem[];
}

export function loadTimeline(locale: Locale): Timeline {
  return {
    title: pickLocale(timelineData.title, locale),
    items: timelineData.items.map((it) => ({
      id: it.id,
      period: pickLocale(it.period, locale),
      company: pickLocale(it.company, locale),
      department: it.department ? pickLocale(it.department, locale) : undefined,
      role: pickLocale(it.role, locale),
      products: (it.workIds ?? []).map((workId) => {
        const work = getWorkById(workId, locale);
        if (!work) {
          throw new Error(
            `Timeline item "${it.id}" references unknown workId "${workId}" — check src/i18n/works.json`,
          );
        }
        return { workId, title: work.title };
      }),
    })),
  };
}

// ==================================================
// home page（page-home.json，按字段挂多语言）
// ==================================================
interface HomePageContentRaw {
  sectionHero: {
    title: LocalizedString;
    scrollHint: LocalizedString;
  };
  sectionTopDescription: {
    /** 多段文本，每段是若干行；按段独立渲染为一个 text-block Section */
    paragraphs: Record<Locale, string[][]>;
    viewAboutMeText: LocalizedString;
  };
  sectionFeaturedProjects: {
    title: LocalizedString;
    description: LocalizedString;
    viewAllText: LocalizedString;
  };
  sectionExpertise: {
    title: LocalizedString;
    description: LocalizedString;
  };
  sectionBottomDescription: {
    descriptions: Record<Locale, string[]>;
    viewResumeText: LocalizedString;
    viewDesignText: LocalizedString;
  };
}

export interface HomePageContent {
  sectionHero: {
    title: string;
    scrollHint: string;
  };
  sectionTopDescription: {
    /** 多段文本，每段是若干行；按段独立渲染为一个 text-block Section */
    paragraphs: string[][];
    viewAboutMeText: string;
  };
  sectionFeaturedProjects: {
    title: string;
    description: string;
    viewAllText: string;
  };
  sectionExpertise: {
    title: string;
    description: string;
  };
  // 全局技能池（来自 skills.json，非 page-home.json）—— 故提到顶层，不嵌在 sectionExpertise 文案块下
  skillAreas: SkillArea[];
  sectionBottomDescription: {
    descriptions: string[];
    viewResumeText: string;
    viewDesignText: string;
  };
}

export function loadHomePageContent(locale: Locale): HomePageContent {
  const raw = pageHomeRaw as HomePageContentRaw;
  return {
    sectionHero: {
      title: pickLocale(raw.sectionHero.title, locale),
      scrollHint: pickLocale(raw.sectionHero.scrollHint, locale),
    },
    sectionTopDescription: {
      paragraphs: pickLocale(raw.sectionTopDescription.paragraphs, locale),
      viewAboutMeText: pickLocale(raw.sectionTopDescription.viewAboutMeText, locale),
    },
    sectionFeaturedProjects: {
      title: pickLocale(raw.sectionFeaturedProjects.title, locale),
      description: pickLocale(raw.sectionFeaturedProjects.description, locale),
      viewAllText: pickLocale(raw.sectionFeaturedProjects.viewAllText, locale),
    },
    sectionExpertise: {
      title: pickLocale(raw.sectionExpertise.title, locale),
      description: pickLocale(raw.sectionExpertise.description, locale),
    },
    skillAreas: getAllSkillAreas(locale),
    sectionBottomDescription: {
      descriptions: pickLocale(raw.sectionBottomDescription.descriptions, locale),
      viewResumeText: pickLocale(raw.sectionBottomDescription.viewResumeText, locale),
      viewDesignText: pickLocale(raw.sectionBottomDescription.viewDesignText, locale),
    },
  };
}

// ==================================================
// about page（page-about.json，按字段挂多语言）
// ==================================================
interface AboutPageContentRaw {
  sectionIntroduction: {
    title: LocalizedString;
    /** 自述文本：每语言一段段落数组，逐段独立渲染为 <p> */
    description: Record<Locale, string[]>;
    viewWorksText: LocalizedString;
    viewResumeText: LocalizedString;
    /** 名 + 地点 + 领域，introduction 区蜂巢签名块 */
    signature: {
      name: LocalizedString;
      place: LocalizedString;
      /** 领域标签数组（如 前端/后端/设计），渲染为小六边形群 */
      areas: LocalizedString[];
    };
  };
  sectionTimeline: {
    viewHomeText: LocalizedString;
  };
}

export interface AboutSignature {
  name: string;
  place: string;
  areas: string[];
}

export interface AboutPageContent {
  sectionIntroduction: {
    title: string;
    /** 自述文本：当前语言的段落数组 */
    description: string[];
    viewWorksText: string;
    viewResumeText: string;
    signature: AboutSignature;
  };
  sectionTimeline: {
    viewHomeText: string;
  };
  timeline: Timeline;
}

export function loadAboutPageContent(locale: Locale): AboutPageContent {
  const raw = pageAboutRaw as AboutPageContentRaw;
  return {
    sectionIntroduction: {
      title: pickLocale(raw.sectionIntroduction.title, locale),
      description: pickLocale(raw.sectionIntroduction.description, locale),
      viewWorksText: pickLocale(raw.sectionIntroduction.viewWorksText, locale),
      viewResumeText: pickLocale(raw.sectionIntroduction.viewResumeText, locale),
      signature: {
        name: pickLocale(raw.sectionIntroduction.signature.name, locale),
        place: pickLocale(raw.sectionIntroduction.signature.place, locale),
        areas: raw.sectionIntroduction.signature.areas.map((a) => pickLocale(a, locale)),
      },
    },
    sectionTimeline: {
      viewHomeText: pickLocale(raw.sectionTimeline.viewHomeText, locale),
    },
    timeline: loadTimeline(locale),
  };
}

// ==================================================
// works page（page-works.json：列表页文案 / page-work-detail.json：详情页文案）
//   作品列表 / 筛选项均从 works.json 推导，本节只存页面静态文案
// ==================================================
/** 作品筛选项 id：all（跨页面共用文案）+ works.json 中的各 area */
export type WorkFilter = "all" | WorkAreaId;

/**
 * 详情页各 section 静态文案 —— 按 section 分组组织：
 *   sectionOverview         空对象占位（title 由 work.title 动态来）
 *   sectionBackgroundSkills 背景 + 技术栈合并块
 *   sectionMyInvolvement    我的参与与产出（professional / personal 共用，下属 heading 按 area 取舍）
 */
interface WorkDetailRaw {
  sectionOverview: Record<string, never>;
  sectionBackgroundSkills: { title: LocalizedString };
  sectionMyInvolvement: {
    title: LocalizedString;
    headingRole: LocalizedString;
    headingAchievements: LocalizedString;
    headingPerformance: LocalizedString;
    headingLearnings: LocalizedString;
    viewAllWorksText: LocalizedString;
  };
}

interface WorksPageContentRaw {
  sectionIntroduction: {
    title: LocalizedString;
    description: LocalizedString;
    viewHomeText: LocalizedString;
  };
}

export interface WorksPageContent {
  sectionIntroduction: { title: string; description: string; viewHomeText: string };
  /** 筛选项：第一项恒为 all，其余为 works.json 中的 area，按声明顺序 */
  filters: { id: WorkFilter; name: string }[];
  works: Work[];
}

/** 详情页静态文案，各字段已展开为当前语言；与 WorkDetailRaw 同形（按 section 分组） */
export interface WorkDetailPageContent {
  sectionOverview: Record<string, never>;
  sectionBackgroundSkills: { title: string };
  sectionMyInvolvement: {
    title: string;
    headingRole: string;
    headingAchievements: string;
    headingPerformance: string;
    headingLearnings: string;
    viewAllWorksText: string;
  };
}

export function loadWorksPageContent(locale: Locale): WorksPageContent {
  const raw = pageWorksRaw as WorksPageContentRaw;
  return {
    sectionIntroduction: {
      title: pickLocale(raw.sectionIntroduction.title, locale),
      description: pickLocale(raw.sectionIntroduction.description, locale),
      viewHomeText: pickLocale(raw.sectionIntroduction.viewHomeText, locale),
    },
    filters: [
      { id: "all", name: getSharedAllText(locale) },
      ...getAllWorkAreas(locale).map((a) => ({ id: a.id, name: a.name })),
    ],
    works: getAllWorks(locale),
  };
}

/** 取作品详情页的静态文案：按 section 分组组织，逐字段展开为当前语言 */
export function loadWorkDetailPageContent(locale: Locale): WorkDetailPageContent {
  const raw = pageWorkDetailRaw as WorkDetailRaw;
  return {
    sectionOverview: {},
    sectionBackgroundSkills: {
      title: pickLocale(raw.sectionBackgroundSkills.title, locale),
    },
    sectionMyInvolvement: {
      title: pickLocale(raw.sectionMyInvolvement.title, locale),
      headingRole: pickLocale(raw.sectionMyInvolvement.headingRole, locale),
      headingAchievements: pickLocale(raw.sectionMyInvolvement.headingAchievements, locale),
      headingPerformance: pickLocale(raw.sectionMyInvolvement.headingPerformance, locale),
      headingLearnings: pickLocale(raw.sectionMyInvolvement.headingLearnings, locale),
      viewAllWorksText: pickLocale(raw.sectionMyInvolvement.viewAllWorksText, locale),
    },
  };
}

// ==================================================
// themes（themes.json，主题动机文案 —— design system 页用）
//   titles  — 段落标题，多语言（如 motivation）
//   themes  — 各主题专属文案，按 Theme id 索引，再按段落 key 索引
// ==================================================
interface ThemesRaw {
  titles: {
    motivation: LocalizedString;
  };
  themes: Record<
    Theme,
    {
      motivation: LocalizedString;
    }
  >;
}

const themesData = themesRaw as ThemesRaw;

/** 主题动机文案（design system 页 Hero 区使用），已展开为当前语言 */
export interface ThemeContent {
  motivationTitle: string;
  motivation: string;
}

export function loadThemeContent(theme: Theme, locale: Locale): ThemeContent {
  const t = themesData.themes[theme];
  if (!t) {
    throw new Error(`Unknown theme: "${theme}" — check src/i18n/themes.json`);
  }
  return {
    motivationTitle: pickLocale(themesData.titles.motivation, locale),
    motivation: pickLocale(t.motivation, locale),
  };
}
