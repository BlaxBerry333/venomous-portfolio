import SitePageSection from "@/components/react/layout/SitePageSection";
import { useSkillCategories } from "@/data/skills.hooks";
import type { Locale, Theme } from "@/types";
import { getLocalizedUrl } from "@/utils/i18n";
import { useReducedMotion } from "framer-motion";
import { VoidUI } from "../components";
import VoidSkillStar from "./VoidSkillStar";

// Void Tech (Home overview)：技能星图概览
// 不展开等级条 / 不带分类切换；详情页（About §02 Constellation）展示满级矩阵
// hover 卫星节点/标签/连接线 → 该路径高亮 + 节点放大 + 高速彗星粒子；星簇整体加 3D tilt 跟随光标

interface VoidHomeTechStacksProps {
  locale: Locale;
  theme: Theme;
}

export default function VoidHomeTechStacks({ locale, theme }: VoidHomeTechStacksProps) {
  const skillCategories = useSkillCategories(locale);
  const reduced = useReducedMotion();
  const aboutUrl = getLocalizedUrl("/about", locale, theme);

  return (
    <SitePageSection
      style={{
        minHeight: "80vh",
        paddingTop: "clamp(48px, 8vw, 96px)",
        paddingBottom: "clamp(48px, 8vw, 96px)",
        background:
          "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(107,216,230,0.04) 0%, transparent 65%)",
        overflow: "hidden",
      }}
    >
      <VoidUI.Title2 text="Tech" accent=".Stacks" style={{ marginBottom: "var(--space-2xl)" }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "clamp(32px, 5vw, 80px)",
          justifyItems: "center",
        }}
      >
        {skillCategories.map((cat, ci) => (
          <VoidSkillStar
            key={cat.label}
            label={cat.label}
            skills={cat.skills}
            delay={ci * 0.08}
            reduced={!!reduced}
          />
        ))}
      </div>

      {/* 跳转 About 按钮 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "var(--space-2xl)",
        }}
      >
        <VoidUI.Button variant="contained" href={aboutUrl}>
          ABOUT ME →
        </VoidUI.Button>
      </div>
    </SitePageSection>
  );
}
