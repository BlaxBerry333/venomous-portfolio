import SitePageSection from "@/components/react/layout/SitePageSection";
import { mobileFeaturedWorkIds, type DemoType, type Work } from "@/data/works";
import { useWorks } from "@/data/works.hooks";
import type { Locale, Theme } from "@/types";
import { getLocalizedUrl } from "@/utils/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ZenlessUI, type ZenlessCardColor } from "../components";

// 移动端 Active Missions
// 布局：标题 → 顶部水平编号牌（精选子集，等分铺满，不滚动）→ 详情大卡 → View All
// 精选子集来自 mobileFeaturedWorkIds（S/A/B 各一档，公司/个人混合）
// 更多作品由底部 View All Missions 进入完整列表

const RANK: Record<
  DemoType,
  { rank: string; color: ZenlessCardColor; hex: string; status: string }
> = {
  live: { rank: "S", color: "orange", hex: "#FF6B00", status: "OPERATIONAL" },
  iframe: { rank: "A", color: "green", hex: "#C5FF00", status: "STANDBY" },
  screenshot: { rank: "A", color: "green", hex: "#C5FF00", status: "ARCHIVED" },
  nda: { rank: "B", color: "purple", hex: "#8B5CF6", status: "CLASSIFIED" },
};

interface ZenlessHomeFeaturedWorksMobileProps {
  locale: Locale;
  theme: Theme;
}

export default function ZenlessHomeFeaturedWorksMobile({
  locale,
  theme,
}: ZenlessHomeFeaturedWorksMobileProps) {
  const works = useWorks(locale);
  // 取精选子集；找不到的 id 跳过；为空兜底回前 3 个
  const featured = useMemo<Work[]>(() => {
    const list = mobileFeaturedWorkIds
      .map((id) => works.find((w) => w.id === id))
      .filter((w): w is Work => Boolean(w));
    return list.length ? list : works.slice(0, 3);
  }, [works]);

  const [active, setActive] = useState(0);
  const cur = featured[active];
  const rk = RANK[cur.demoType];
  const detailUrl = getLocalizedUrl(`/works/${cur.id}`, locale, theme);
  const worksListUrl = getLocalizedUrl("/works", locale, theme);

  return (
    <SitePageSection
      style={{
        minHeight: "100vh",
        paddingTop: "var(--space-2xl)",
        paddingBottom: "var(--space-2xl)",
        background:
          "radial-gradient(ellipse 60% 50% at 25% 75%, rgba(139,92,246,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 45% at 80% 25%, rgba(197,255,0,0.10) 0%, transparent 65%), var(--theme-bg)",
      }}
    >
      <ZenlessUI.Hazard
        variant="stripe"
        color="purple"
        animated
        rotate={-12}
        top="12vh"
        enterFrom="right"
        height={36}
        style={{ opacity: 0.55, zIndex: 0 }}
      />
      <ZenlessUI.Hazard
        variant="stripe"
        color="green"
        animated
        rotate={8}
        top="82vh"
        enterFrom="left"
        height={36}
        style={{ opacity: 0.55, zIndex: 0 }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <ZenlessUI.Title1
          as="h2"
          size="section"
          eyebrow="MISSION TERMINAL · OPERATOR LV.MAX"
          title="Active Missions"
          accentTail="Missions"
          animate="sweep"
        />

        {/* 顶部精选编号牌 — Tag 自身做 tab，左对齐 */}
        <div
          role="tablist"
          aria-label="Featured missions"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 10,
            margin: "12px 0 8px",
          }}
        >
          {featured.map((w, i) => {
            const isActive = i === active;
            const r = RANK[w.demoType];
            return (
              <ZenlessUI.Tag
                key={w.id}
                variant={isActive ? "contained" : "outlined"}
                color={r.color}
                size="md"
                prefix="No."
                role="tab"
                aria-selected={isActive}
                aria-label={`Mission ${String(i + 1).padStart(2, "0")} — ${w.title}`}
                tabIndex={0}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                {String(i + 1).padStart(2, "0")}
              </ZenlessUI.Tag>
            );
          })}
        </div>

        {/* 详情大卡 — mission board，常驻 hazard 底纹 + fade 切换 pane */}
        <div
          className="mission-board"
          style={{
            position: "relative",
            border: `2px solid ${rk.hex}`,
            overflow: "hidden",
            boxShadow: `0 0 40px color-mix(in srgb, ${rk.hex} 30%, transparent)`,
            height: 600,
          }}
        >
          {/* 常驻警戒线斜纹底层 */}
          <div
            className="mission-board__hazard"
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <ZenlessUI.Hazard
              variant="inline"
              color={rk.color}
              animated
              height={600}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.a
              key={cur.id}
              href={detailUrl}
              aria-label={`${cur.title} — ${cur.subtitle}`}
              className="mission-board__panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                height: "100%",
                overflow: "hidden",
                position: "relative",
                zIndex: 1,
                display: "block",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <div
                className="mission-board__cover"
                style={{
                  position: "relative",
                  height: 240,
                  background: `linear-gradient(180deg, transparent 40%, var(--theme-elevated)), url(${cur.cover}) center/cover`,
                  filter: cur.demoType === "nda" ? "blur(8px) grayscale(0.5)" : "none",
                }}
              />

              <div
                className="mission-board__content"
                style={{
                  position: "relative",
                  background: "var(--theme-elevated)",
                  padding: "16px 16px 20px",
                  height: "calc(100% - 240px)",
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                }}
              >
                <p
                  className="mission-board__id"
                  style={{
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 10,
                    color: rk.hex,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  MISSION · ID#{String(active + 1).padStart(4, "0")} · {rk.status}
                </p>
                <h3
                  className="mission-board__title"
                  style={{
                    fontFamily: "var(--theme-font-display)",
                    fontWeight: 900,
                    fontSize: 32,
                    color: "var(--theme-fg)",
                    letterSpacing: "-0.02em",
                    textTransform: "uppercase",
                    lineHeight: 1.1,
                  }}
                >
                  {cur.title}
                </h3>
                <p
                  className="mission-board__subtitle"
                  style={{
                    fontFamily: "var(--theme-font-body)",
                    color: "var(--theme-fg-muted)",
                    marginTop: 6,
                    fontSize: 14,
                  }}
                >
                  {cur.subtitle}
                </p>

                <div
                  className="mission-board__skills"
                  style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 }}
                >
                  {cur.techStack.slice(0, 6).map((t) => (
                    <ZenlessUI.Tag key={t} variant="outlined" color={rk.color} size="sm">
                      {t}
                    </ZenlessUI.Tag>
                  ))}
                </div>

                <div
                  className="mission-board__footer"
                  style={{
                    marginTop: "auto",
                    paddingTop: 12,
                    borderTop: "1px dashed color-mix(in srgb, var(--theme-fg) 20%, transparent)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    className="mission-board__operator"
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      fontFamily: "var(--theme-font-mono)",
                      fontSize: 11,
                      color: "var(--theme-fg-muted)",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ color: "var(--theme-accent-2)", letterSpacing: "0.2em" }}>
                      OPERATOR
                    </span>
                    <span style={{ color: "var(--theme-fg)" }}>{cur.myRole}</span>
                  </div>

                  <div
                    className="mission-board__metrics"
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {cur.businessValue.map((v, i) => (
                      <div
                        key={i}
                        className="mission-board__metric"
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          className="mission-board__metric-label"
                          style={{
                            fontFamily: "var(--theme-font-mono)",
                            fontSize: 11,
                            color: "var(--theme-fg-muted)",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          ▸ {v.label}
                        </span>
                        <span
                          className="mission-board__metric-value"
                          style={{
                            fontFamily: "var(--theme-font-display)",
                            fontWeight: 900,
                            color: rk.hex,
                            fontSize: 20,
                          }}
                        >
                          {v.value}
                          <span style={{ fontSize: 11 }}>{v.suffix}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.a>
          </AnimatePresence>
        </div>

        {/* 引导：剩余作品在 View All 里 */}
        <p
          style={{
            fontFamily: "var(--theme-font-mono)",
            fontSize: 10,
            color: "var(--theme-accent)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          {works.length - featured.length} MORE MISSIONS IN ARCHIVE
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          <ZenlessUI.Button variant="contained" size="lg" animation="nudge" href={worksListUrl}>
            View All Missions
          </ZenlessUI.Button>
        </div>
      </div>
    </SitePageSection>
  );
}
