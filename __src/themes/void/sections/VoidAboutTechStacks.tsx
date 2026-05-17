import SitePageSection from "@/components/react/layout/SitePageSection";
import { useSkillCategories } from "@/data/skills.hooks";
import type { Locale } from "@/types";
import { useReducedMotion } from "framer-motion";
import { VoidUI } from "../components";
import { VoidStratum } from "./VoidSkillTokens";

// Void About.TechStacks — 4 层 stratum 定性技能图谱（无百分比）

export default function VoidAboutTechStacks({ locale }: { locale: Locale }) {
  const skillCategories = useSkillCategories(locale);
  const reduced = useReducedMotion();

  return (
    <SitePageSection
      style={{
        paddingTop: "clamp(48px, 10vh, 120px)",
        paddingBottom: "clamp(80px, 14vh, 180px)",
      }}
    >
      <VoidUI.Title2 text="My Tech Stacks" style={{ marginBottom: 56 }} />

      {/* 4 strata — token 区给定 minHeight，PC 端高度一致 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(40px, 6vh, 72px)",
          maxWidth: 1200,
        }}
      >
        {skillCategories.map((cat) => (
          <VoidStratum
            key={cat.label}
            label={cat.label}
            skills={cat.skills}
            levels={cat.levels}
            reduced={!!reduced}
            tokenAreaMinHeight={180}
          />
        ))}
      </div>
    </SitePageSection>
  );
}
