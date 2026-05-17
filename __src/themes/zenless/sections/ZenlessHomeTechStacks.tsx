import SitePageSection from "@/components/react/layout/SitePageSection";
import { LEVEL_META, type SkillLevel } from "@/data/skills";
import { useSkillCategories } from "@/data/skills.hooks";
import type { Locale, Theme } from "@/types";
import { getLocalizedUrl } from "@/utils/i18n";
import { useState } from "react";
import { ZenlessUI, type ZenlessCardColor } from "../components";
// Zenless Tech：角色技能等级面板
// 顶部：选择 category（tabs，类似游戏的 attribute / weapon / disc）
// 底部：选中 category 的技能列表，每个 = 一张 ZenlessUI.Card 横条卡（公共组件统一形态）

// SkillLevel → S/A/B 视觉档位 + Card color 档位
// primary → S/orange · daily → A/green · familiar → B/purple
const RANK_BY_LEVEL: Record<SkillLevel, { tier: string; color: ZenlessCardColor }> = {
  primary: { tier: "S", color: "orange" },
  daily: { tier: "A", color: "green" },
  familiar: { tier: "B", color: "purple" },
};

interface ZenlessHomeTechStacksProps {
  locale: Locale;
  theme: Theme;
}

export default function ZenlessHomeTechStacks({ locale, theme }: ZenlessHomeTechStacksProps) {
  const skillCategories = useSkillCategories(locale);
  const [active, setActive] = useState(0);
  const aboutUrl = getLocalizedUrl("/about", locale, theme);

  return (
    <SitePageSection
      style={{
        minHeight: "80vh",
        paddingTop: "var(--space-2xl)",
        paddingBottom: "var(--space-2xl)",
        background:
          "radial-gradient(ellipse 60% 50% at 25% 75%, rgba(139,92,246,0.18) 0%, transparent 60%), var(--theme-bg)",
      }}
    >
      <div style={{ position: "relative" }}>
        <ZenlessUI.Title1
          as="h2"
          size="section"
          eyebrow="AGENT ATTRIBUTE · EQUIPPE"
          title="TECH STACKS"
          accentTail="STACKS"
          marginBottom="var(--space-xl)"
          animate="sweep"
        />

        {/* category tabs */}
        <div
          role="tablist"
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          {skillCategories.map((cat, i) => {
            const isActive = i === active;
            return (
              <ZenlessUI.Button
                key={cat.label}
                variant="tab"
                active={isActive}
                role="tab"
                ariaSelected={isActive}
                onClick={() => setActive(i)}
              >
                {cat.label}
              </ZenlessUI.Button>
            );
          })}
        </div>

        {/* skill list */}
        <div
          style={{
            background: "var(--theme-elevated)",
            border: "2px solid var(--theme-accent)",
            padding: 0,
            position: "relative",
            marginBottom: "var(--space-2xl)",
          }}
        >
          <div style={{ padding: 16 }}>
            <p
              style={{
                fontFamily: "var(--theme-font-mono)",
                fontSize: 11,
                color: "var(--theme-fg-muted)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              ▣ {skillCategories[active].label} · ATTRIBUTE GRADE
            </p>

            <div
              key={skillCategories[active].label}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 360px), 1fr))",
                gap: 12,
              }}
            >
              {skillCategories[active].skills.map((s, i) => {
                const level = skillCategories[active].levels[s] ?? "familiar";
                const r = RANK_BY_LEVEL[level];
                return (
                  <ZenlessUI.Card
                    key={s}
                    staggerIndex={i}
                    color={r.color}
                    leading={
                      <ZenlessUI.Tag size="md" variant="contained" color={r.color}>
                        {r.tier}
                      </ZenlessUI.Tag>
                    }
                    title={s}
                    description={LEVEL_META[level].label}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* 跳转 About 按钮 */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ZenlessUI.Button variant="contained" size="md" href={aboutUrl}>
            ABOUT ME →
          </ZenlessUI.Button>
        </div>
      </div>
    </SitePageSection>
  );
}
