import SitePageSection from "@/components/react/layout/SitePageSection";
import { useSkillCategories } from "@/data/skills.hooks";
import type { Locale } from "@/types";
import { ZenlessUI } from "../components";

// Zenless About.TechStacks — Equipped / Loadout

export default function ZenlessAboutTechStacks({ locale }: { locale: Locale }) {
  const skillCategories = useSkillCategories(locale);
  return (
    <SitePageSection
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse 60% 40% at 25% 70%, rgba(139,92,246,0.18) 0%, transparent 60%), var(--theme-bg)",
        paddingTop: "var(--space-2xl)",
        paddingBottom: "var(--space-3xl)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <ZenlessUI.Title2 label="EQUIPPED" title="MY TECH STACKS" style={{ marginBottom: 56 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {skillCategories.map((cat, ci) => {
            const tagColor: "orange" | "purple" = ci % 2 === 0 ? "orange" : "purple";
            return (
              <div
                key={cat.label}
                style={{
                  padding: 16,
                  background: "var(--theme-elevated)",
                  border: "2px solid var(--theme-accent)",
                }}
              >
                <ZenlessUI.Title3
                  size={20}
                  divider={false}
                  subtitle={`${cat.skills.length.toString().padStart(2, "0")} EQUIPPED`}
                  style={{ marginBottom: 20 }}
                >
                  {cat.label}
                </ZenlessUI.Title3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {cat.skills.map((s) => (
                    <ZenlessUI.Tag
                      key={s}
                      variant={cat.levels[s] === "primary" ? "contained" : "outlined"}
                      color={tagColor}
                      size="sm"
                    >
                      {s}
                    </ZenlessUI.Tag>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SitePageSection>
  );
}
