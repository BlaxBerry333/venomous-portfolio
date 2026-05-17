import SitePageSection from "@/components/react/layout/SitePageSection";
import { LEVEL_META, type SkillCategory, type SkillLevel } from "@/data/skills";
import { useSkillCategories } from "@/data/skills.hooks";
import type { Locale, Theme } from "@/types";
import { getLocalizedUrl } from "@/utils/i18n";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { QuoteColor } from "../components";
import { MangaUI } from "../components";
import "./MangaHomeTechStacks.scss";

// hydration 安全的窄屏检测：SSR 和 CSR 首帧均返回 false，mount 后读真实值
function useIsMobile(): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setMatch(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatch(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return match;
}

// Manga Tech：角色卡 4 联画 — 4 个分类 → 4 种 Quote 颜色
const QUOTE_COLOR_CYCLE: QuoteColor[] = ["white", "yellow", "red", "black"];
// 旋转角度收敛但保留错位感
const QUOTE_ROTATE_CYCLE: number[] = [-1.2, 0.8, -0.6, 1.4];
// 水平错位：每张卡相对容器中心做 translateX（不再用 flex justify 把右半屏空出来）
// 单位 px；正向右、负向左
const QUOTE_OFFSET_X_CYCLE: number[] = [-40, 60, -20, 80];
// 章号大写汉字数字（label 用）
const KANJI_NUM = ["壹", "貳", "參", "肆"];

type LeveledSkill = { name: string; level: SkillLevel };
function getLeveledSkills(cat: SkillCategory): LeveledSkill[] {
  return cat.skills.filter((s) => s in cat.levels).map((s) => ({ name: s, level: cat.levels[s] }));
}

// Quote 颜色 → Tag 颜色三档（避免同色叠加）
function tagColorsFor(quoteColor: QuoteColor): {
  primary: "red" | "yellow" | "black" | "white";
  daily: "red" | "yellow" | "black" | "white";
  familiar: "red" | "yellow" | "black" | "white";
} {
  switch (quoteColor) {
    case "white":
      return { primary: "red", daily: "black", familiar: "white" };
    case "yellow":
      return { primary: "red", daily: "black", familiar: "white" };
    case "red":
      return { primary: "black", daily: "white", familiar: "white" };
    case "black":
      return { primary: "yellow", daily: "red", familiar: "white" };
  }
}

const TAG_SIZE: Record<SkillLevel, "xs" | "sm" | "md"> = {
  primary: "md",
  daily: "sm",
  familiar: "xs",
};

interface MangaHomeTechStacksProps {
  locale: Locale;
  theme: Theme;
}

export default function MangaHomeTechStacks({ locale, theme }: MangaHomeTechStacksProps) {
  const skillCategories = useSkillCategories(locale);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const aboutUrl = getLocalizedUrl("/about", locale, theme);
  return (
    <SitePageSection
      style={{
        minHeight: "80vh",
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-3xl)",
        background: "linear-gradient(180deg, var(--theme-bg) 0%, #EAE3D6 100%)",
      }}
    >
      <MangaUI.Title1 eyebrow="卷二" animate="spring" style={{ marginBottom: "var(--space-2xl)" }}>
        TECH STACKS
      </MangaUI.Title1>

      {/* ============================================================ */}
      {/* 角色卡 4 联画（基于 MangaUI.Quote）                            */}
      {/*   单列纵向：每张卡左/右/居中错位 + 不同旋转 + 不同宽度         */}
      {/*   label = 壹/貳/參/肆；分类名走 Title3                         */}
      {/*   内容：单段密集 Tag — 按熟练度自然分级（primary md / daily sm */}
      {/*   / familiar xs），靠 Tag 体积+颜色区分等级                    */}
      {/* ============================================================ */}
      <div className="portfolio__manga-home-tech-stacks__stack">
        {skillCategories.map((cat, ci) => {
          const color = QUOTE_COLOR_CYCLE[ci % QUOTE_COLOR_CYCLE.length];
          const rotate = QUOTE_ROTATE_CYCLE[ci % QUOTE_ROTATE_CYCLE.length];
          const offsetX = isMobile ? 0 : QUOTE_OFFSET_X_CYCLE[ci % QUOTE_OFFSET_X_CYCLE.length];
          const items = getLeveledSkills(cat);
          const tagColors = tagColorsFor(color);
          // primary 排前
          const sorted = [...items].sort(
            (a, b) => LEVEL_META[b.level].weight - LEVEL_META[a.level].weight,
          );
          return (
            <motion.div
              key={cat.label}
              className="portfolio__manga-home-tech-stacks__row"
              initial={
                reduced ? { opacity: 0 } : { opacity: 0, x: offsetX, y: -28, rotate: rotate + 4 }
              }
              whileInView={reduced ? { opacity: 1 } : { opacity: 1, x: offsetX, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: reduced ? 0.3 : 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: reduced ? 0 : ci * 0.12,
              }}
            >
              <MangaUI.Quote
                color={color}
                label={KANJI_NUM[ci]}
                rotate={rotate}
                maxWidth="100%"
                minHeight={200}
                padding={28}
              >
                <MangaUI.Title3
                  size={22}
                  style={{ marginBottom: 20 }}
                  dividerColor={color === "black" ? "var(--theme-accent)" : undefined}
                >
                  {cat.label}
                </MangaUI.Title3>
                <div className="portfolio__manga-home-tech-stacks__tags">
                  {sorted.map((s) => (
                    <MangaUI.Tag key={s.name} color={tagColors[s.level]} size={TAG_SIZE[s.level]}>
                      {s.name}
                    </MangaUI.Tag>
                  ))}
                </div>
                {/* 右下角"还有更多"角注 — 暗示展示的不是全部（原型阶段写死假数字） */}
                <span aria-hidden className="portfolio__manga-home-tech-stacks__quad-more">
                  +12 MORE
                </span>
              </MangaUI.Quote>
            </motion.div>
          );
        })}
      </div>

      {/* 跳转 About 按钮 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "var(--space-2xl)",
        }}
      >
        <a href={aboutUrl} style={{ textDecoration: "none", color: "inherit" }}>
          <MangaUI.Button color="black" size="md" restRotate={-1.5}>
            ABOUT ME →
          </MangaUI.Button>
        </a>
      </div>
    </SitePageSection>
  );
}
