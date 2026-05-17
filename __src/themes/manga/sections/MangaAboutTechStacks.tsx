import SitePageSection from "@/components/react/layout/SitePageSection";
import { LEVEL_META } from "@/data/skills";
import { useSkillCategories } from "@/data/skills.hooks";
import type { Locale } from "@/types";
import { MangaUI } from "../components";
import "./MangaAboutTechStacks.scss";

// Manga About.TechStacks — ARSENAL · RAILS：左侧贴纸分类章 + 右侧 Tag 流（按熟练度分级 size）

export default function MangaAboutTechStacks({ locale }: { locale: Locale }) {
  const skillCategories = useSkillCategories(locale);
  return (
    <SitePageSection
      style={{
        background: "linear-gradient(180deg, var(--theme-bg) 0%, #EAE3D6 100%)",
        paddingTop: "var(--space-2xl)",
        paddingBottom: "var(--space-3xl)",
      }}
      containerProps={{ className: "arsenal-rails" }}
    >
      <MangaUI.Title2
        num={null}
        stampText="必殺技"
        label="MY TECH STACKS"
        rotate={-1}
        style={{ marginBottom: 32 }}
      />
      <div className="portfolio__manga-about-tech-stacks__list">
        {skillCategories.map((cat, ci) => {
          const sorted = [...cat.skills].sort((a, b) => {
            const la = cat.levels[a];
            const lb = cat.levels[b];
            return (lb ? LEVEL_META[lb].weight : 0) - (la ? LEVEL_META[la].weight : 0);
          });
          // 颜色循环对齐 home Skill Codex 4 联画：white → yellow → red → black
          const CARD_COLOR_CYCLE = ["white", "yellow", "red", "black"] as const;
          const CARD_ROTATE_CYCLE = [-3, 2.5, -2, 3] as const;
          const cardColor = CARD_COLOR_CYCLE[ci % CARD_COLOR_CYCLE.length];
          const cardRotate = CARD_ROTATE_CYCLE[ci % CARD_ROTATE_CYCLE.length];
          return (
            <div key={cat.label} className="portfolio__manga-about-tech-stacks__row">
              {/* PC：左侧分类卡 */}
              <div className="portfolio__manga-about-tech-stacks__stamp">
                <MangaUI.Card
                  color={cardColor}
                  restRotate={cardRotate}
                  hoverDirection={ci % 2 === 0 ? "+" : "-"}
                  prefix={`第 ${ci + 1} 章`}
                  title={cat.label}
                  titleSize={22}
                  subtitle={`${cat.skills.length} skills`}
                  minHeight={120}
                  padding={18}
                />
              </div>
              {/* 移动端：Title3 替代分类卡 */}
              <div className="portfolio__manga-about-tech-stacks__stamp-mobile">
                <MangaUI.Title3
                  size={22}
                  subtitle={`第 ${ci + 1} 章 · ${cat.skills.length} skills`}
                >
                  {cat.label}
                </MangaUI.Title3>
              </div>
              {/* 右侧 Tag 流：按熟练度选 size */}
              <div className="portfolio__manga-about-tech-stacks__tags">
                {sorted.map((s) => {
                  const level = cat.levels[s];
                  const tagSize: "xs" | "sm" | "md" =
                    level === "primary" ? "md" : level === "daily" ? "sm" : "xs";
                  // 颜色：primary 黑底 / daily 黄底 / familiar 白底
                  const tagColor: "black" | "yellow" | "white" =
                    level === "primary" ? "black" : level === "daily" ? "yellow" : "white";
                  return (
                    <MangaUI.Tag key={s} color={tagColor} size={tagSize}>
                      {s}
                    </MangaUI.Tag>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </SitePageSection>
  );
}
