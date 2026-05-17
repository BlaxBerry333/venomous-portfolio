import SitePageSection from "@/components/react/layout/SitePageSection";
import { pcFeaturedWorkIds, type DemoType, type Work } from "@/data/works";
import { useWorks } from "@/data/works.hooks";
import type { Locale, Theme } from "@/types";
import { getLocalizedUrl } from "@/utils/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ZenlessUI, type ZenlessCardColor } from "../components";
import "./ZenlessHomeFeaturedWorks.scss";
import ZenlessHomeFeaturedWorksMobile from "./ZenlessHomeFeaturedWorksMobile";

// hydration 安全：SSR 和 CSR 首帧均返回 false，mount 后读真实值
function useIsMobile(breakpoint = 768): boolean {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setM(mql.matches);
    const h = (e: MediaQueryListEvent) => setM(e.matches);
    mql.addEventListener("change", h);
    return () => mql.removeEventListener("change", h);
  }, [breakpoint]);
  return m;
}
// Zenless Featured Works：任务面板
// 左侧 mission list（带等级 + 状态）/ 右侧大屏 mission detail
// 选中切换：右侧扫光 + 涂鸦色块滑入

// rank 颜色档位 → ZenlessCardColor（Card 内部色板）
// 同时保留 hex 给详情大屏的 border / glow / 扫光等装饰用（不归 Card 管）
const RANK: Record<
  DemoType,
  { rank: string; color: ZenlessCardColor; hex: string; status: string }
> = {
  live: { rank: "S", color: "orange", hex: "#FF6B00", status: "OPERATIONAL" },
  iframe: { rank: "A", color: "green", hex: "#C5FF00", status: "STANDBY" },
  screenshot: { rank: "A", color: "green", hex: "#C5FF00", status: "ARCHIVED" },
  nda: { rank: "B", color: "purple", hex: "#8B5CF6", status: "CLASSIFIED" },
};

interface ZenlessHomeFeaturedWorksProps {
  locale: Locale;
  theme: Theme;
}

export default function ZenlessHomeFeaturedWorks({ locale, theme }: ZenlessHomeFeaturedWorksProps) {
  const works = useWorks(locale);
  const isMobile = useIsMobile();
  const featured = useMemo<Work[]>(() => {
    const list = pcFeaturedWorkIds
      .map((id) => works.find((w) => w.id === id))
      .filter((w): w is Work => Boolean(w));
    return list.length ? list : works.slice(0, 5);
  }, [works]);
  const [active, setActive] = useState(0);
  const cur = featured[active] ?? featured[0];
  const rk = RANK[cur.demoType];
  const detailUrl = getLocalizedUrl(`/works/${cur.id}`, locale, theme);
  const worksListUrl = getLocalizedUrl("/works", locale, theme);

  if (isMobile) {
    return <ZenlessHomeFeaturedWorksMobile locale={locale} theme={theme} />;
  }

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
      {/* 全宽斜带 — 紫（顶部装饰） */}
      <ZenlessUI.Hazard
        variant="stripe"
        color="purple"
        animated
        rotate={-12}
        top="20vh"
        enterFrom="right"
        height={36}
        className="zenless-featured-hazard"
        style={{ opacity: 0.55, zIndex: 0 }}
      />
      {/* 全宽斜带 — 绿（底部装饰） */}
      <ZenlessUI.Hazard
        variant="stripe"
        color="green"
        animated
        rotate={8}
        top="40vh"
        enterFrom="left"
        height={36}
        style={{ opacity: 0.55, zIndex: 0 }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <ZenlessUI.Title1
          as="h2"
          size="section"
          eyebrow="AGENT OPERATION · MISSIONS"
          title="FEATURED WORKS"
          accentTail="WORKS"
          animate="sweep"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(360px, 0.9fr) 1.4fr",
            gap: 24,
            height: 600,
          }}
          className="portfolio__zenless-home-featured-works__grid"
        >
          {/* 左：任务列表 — 固定 650px，列表超出内部滚动 */}
          <div
            style={{
              background: "var(--theme-elevated)",
              border: "2px solid var(--theme-accent)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: 16,
                borderBottom: "1px solid color-mix(in srgb, var(--theme-fg) 12%, transparent)",
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--theme-font-mono)",
                  fontSize: 11,
                  color: "var(--theme-fg-muted)",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                }}
              >
                {featured.length} FEATURED · {works.length - featured.length} IN ARCHIVE
              </p>
            </div>

            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
                overflowY: "auto",
              }}
            >
              {featured.map((w, i) => {
                const r = RANK[w.demoType];
                const isActive = i === active;
                return (
                  <li
                    key={w.id}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    tabIndex={0}
                    style={{ cursor: "pointer" }}
                  >
                    <ZenlessUI.Card
                      staggerIndex={i}
                      color={r.color}
                      leading={
                        <ZenlessUI.Tag size="md" variant="contained" color={r.color}>
                          {r.rank}
                        </ZenlessUI.Tag>
                      }
                      title={w.title}
                      titleEllipsis
                      trailing={
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontFamily: "var(--theme-font-mono)",
                            fontSize: 11,
                            fontWeight: 700,
                            color: r.hex,
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                          }}
                        >
                          {r.status}
                        </span>
                      }
                      active={isActive}
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 右：mission board — 固定 600px，常驻 hazard 底纹 + 切换 pane */}
          <div
            className="mission-board"
            style={{
              position: "relative",
              border: `2px solid ${rk.hex}`,
              overflow: "hidden",
              boxShadow: `0 0 40px color-mix(in srgb, ${rk.hex} 30%, transparent)`,
              height: "100%",
            }}
          >
            {/* 常驻警戒线斜纹底层 — 不参与切换，pane 透明时露出 */}
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
                {/* 大封面 — cover 图本身不透明 */}
                <div
                  className="mission-board__cover"
                  style={{
                    position: "relative",
                    height: 260,
                    background: `linear-gradient(180deg, transparent 40%, var(--theme-elevated)), url(${cur.cover}) center/cover`,
                    filter: cur.demoType === "nda" ? "blur(8px) grayscale(0.5)" : "none",
                  }}
                />

                {/* 内容区 — 实色 elevated 盖住底纹 */}
                <div
                  className="mission-board__content"
                  style={{
                    position: "relative",
                    background: "var(--theme-elevated)",
                    padding: "16px 24px",
                    height: "calc(100% - 260px)",
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                  }}
                >
                  <p
                    className="mission-board__id"
                    style={{
                      fontFamily: "var(--theme-font-mono)",
                      fontSize: 11,
                      color: rk.hex,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    MISSION · ID#{String(active + 1).padStart(4, "0")} · {rk.status}
                  </p>
                  <h3
                    className="mission-board__title"
                    style={{
                      fontFamily: "var(--theme-font-display)",
                      fontWeight: 900,
                      fontSize: 40,
                      color: "var(--theme-fg)",
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      lineHeight: 1.05,
                    }}
                  >
                    {cur.title}
                  </h3>
                  <p
                    className="mission-board__subtitle"
                    style={{
                      fontFamily: "var(--theme-font-body)",
                      color: "var(--theme-fg-muted)",
                      marginTop: 4,
                      fontSize: 15,
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
                        gap: 12,
                        alignItems: "center",
                        fontFamily: "var(--theme-font-mono)",
                        fontSize: 12,
                        color: "var(--theme-fg-muted)",
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
                              fontSize: 22,
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
        </div>

        {/* 查看更多作品 — 统一组件 + nudge 动画 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "var(--space-2xl)",
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
