import SitePageSection from "@/components/react/layout/SitePageSection";
import type { WorkCategory } from "@/data/works";
import { useWorks } from "@/data/works.hooks";
import type { Locale, Theme } from "@/types";
import { getLocalizedUrl } from "@/utils/i18n";
import { useState } from "react";
import type { MangaCardColor } from "../components";
import { MangaUI } from "../components";
import "./MangaWorksList.scss";

type Filter = "all" | WorkCategory;

// 右上贴纸配色循环 — 让书架卡之间的 topBadge 颜色错开
const BADGE_COLOR_CYCLE: MangaCardColor[] = ["red", "yellow", "white", "black"];

// 卡片本体配色循环 — 米/红/黄 错开
const CARD_COLOR_CYCLE: MangaCardColor[] = ["white", "red", "yellow"];

function cardPalette(c: MangaCardColor): { bg: string; fg: string } {
  switch (c) {
    case "red":
      return { bg: "var(--theme-accent)", fg: "var(--theme-fg)" };
    case "yellow":
      return { bg: "var(--theme-accent-2)", fg: "var(--theme-fg)" };
    case "black":
      return { bg: "var(--theme-fg)", fg: "var(--theme-bg)" };
    case "white":
    default:
      return { bg: "var(--theme-bg)", fg: "var(--theme-fg)" };
  }
}

interface MangaWorksListProps {
  locale: Locale;
  theme: Theme;
}

export default function MangaWorksList({ locale, theme }: MangaWorksListProps) {
  const works = useWorks(locale);
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = works.filter((w) => filter === "all" || w.category === filter);

  return (
    <SitePageSection
      style={{
        background: "linear-gradient(180deg, var(--theme-bg) 0%, #EAE3D6 100%)",
        minHeight: "100vh",
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-3xl)",
      }}
    >
      <MangaUI.Title1 eyebrow="全卷揃" animate="spring">
        ALL WORKS
      </MangaUI.Title1>

      {/* filter — 漫画书贴纸式 */}
      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        {(["all", "company", "personal"] as Filter[]).map((f, i) => {
          const isActive = filter === f;
          return (
            <MangaUI.Button
              key={f}
              onClick={() => setFilter(f)}
              color={isActive ? "red" : "white"}
              size="sm"
              restRotate={(i - 1) * 1.5}
            >
              {f}
            </MangaUI.Button>
          );
        })}
      </div>

      {/* 漫画书架：一排排卷宗 — 由 MangaUI.Card 当容器，children 拼封面 + 标题块 */}
      <div
        className="portfolio__manga-works-list__shelf"
        style={{
          marginTop: "var(--space-xl)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "var(--space-lg)",
        }}
      >
        {filtered.map((w, i) => {
          const rot = ((i % 5) - 2) * 1.4;
          const isDraft = w.demoType === "nda";
          const badgeText = isDraft ? "機密" : w.category === "company" ? "公式" : "独立";
          const badgeColor = BADGE_COLOR_CYCLE[i % BADGE_COLOR_CYCLE.length];
          const cardColor = CARD_COLOR_CYCLE[i % CARD_COLOR_CYCLE.length];
          const palette = cardPalette(cardColor);

          return (
            <a
              key={w.id}
              href={getLocalizedUrl(`/works/${w.id}`, locale, theme)}
              aria-label={`${w.title} — ${w.subtitle}`}
              style={{ color: "inherit", textDecoration: "none", display: "block" }}
            >
              <MangaUI.Card
                color={cardColor}
                padding={0}
                minHeight={0}
                borderWidth={4}
                shadowOffset={10}
                restRotate={rot}
                hoverDirection={i % 2 === 0 ? "+" : "-"}
                topBadge={{ text: badgeText, color: badgeColor }}
                initial={{ opacity: 0, y: 24, rotate: rot * 2 }}
                whileInView={{ opacity: 1, y: 0, rotate: rot }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (i % 6) * 0.05 }}
              >
                {/* 封面 */}
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "3/4",
                    backgroundImage: `linear-gradient(180deg, transparent 50%, rgba(14,14,16,0.6)), url(${w.cover})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: isDraft ? "blur(10px) grayscale(0.6)" : "none",
                    overflow: "hidden",
                  }}
                >
                  {/* 网点滤镜 */}
                  <div
                    aria-hidden
                    className="manga-ui--halftone"
                    style={{
                      position: "absolute",
                      inset: 0,
                      color: "rgba(14,14,16,0.4)",
                      mixBlendMode: "multiply",
                      opacity: 0.5,
                      pointerEvents: "none",
                    }}
                  />
                </div>
                {/* 标题块 */}
                <div
                  style={{
                    borderTop: `4px solid var(--theme-fg)`,
                    padding: "12px 14px",
                    background: palette.bg,
                    color: palette.fg,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--theme-font-display)",
                      fontWeight: 900,
                      fontSize: 22,
                      color: palette.fg,
                      textTransform: "uppercase",
                      lineHeight: 1.05,
                      letterSpacing: "0.02em",
                      margin: 0,
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                      wordBreak: "break-word",
                      minHeight: `${2 * 1.05}em`,
                    }}
                  >
                    {w.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--theme-font-body)",
                      fontWeight: 700,
                      fontSize: 12,
                      color: palette.fg,
                      opacity: 0.7,
                      marginTop: 4,
                      margin: 0,
                    }}
                  >
                    {w.subtitle}
                  </p>
                </div>
              </MangaUI.Card>
            </a>
          );
        })}
      </div>
    </SitePageSection>
  );
}
