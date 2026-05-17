import SitePageSection from "@/components/react/layout/SitePageSection";
import { useWorks } from "@/data/works.hooks";
import type { Locale, Theme } from "@/types";
import { getLocalizedUrl } from "@/utils/i18n";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { VoidUI } from "../components";
import VoidShaderImage from "../effects/VoidShaderImage";
import "./VoidHomeFeaturedWorks.scss";

// Void Featured.Works：单 preview + 顶部 prev/next 手动切换
// 切换转场：与全局 Void 页面切换语言一致 — opacity + blur(4px) 0.4s easeOut 出场/进场

const FADE_MS = 400;
const REVEAL_MS = 400;

interface VoidHomeFeaturedWorksProps {
  locale: Locale;
  theme: Theme;
}

export default function VoidHomeFeaturedWorks({ locale, theme }: VoidHomeFeaturedWorksProps) {
  const works = useWorks(locale);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [revealKey, setRevealKey] = useState(0);
  const timersRef = useRef<number[]>([]);
  const cur = works[displayed];

  const goto = (n: number) => {
    if (n < 0) n = works.length - 1;
    if (n >= works.length) n = 0;
    if (n === active) return;
    setActive(n);
    if (reduced) {
      setDisplayed(n);
      return;
    }
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];

    setContentVisible(false);

    const t1 = window.setTimeout(() => {
      setDisplayed(n);
      setContentVisible(true);
      setRevealKey((k) => k + 1);
    }, FADE_MS);
    timersRef.current.push(t1);
  };

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <SitePageSection
      style={{
        minHeight: "100vh",
        paddingTop: "clamp(40px, 8vw, 96px)",
        paddingBottom: "clamp(40px, 8vw, 96px)",
        background:
          "radial-gradient(ellipse 80% 50% at 30% 30%, rgba(107,216,230,0.05) 0%, transparent 65%)",
      }}
      containerProps={{
        style: { display: "flex", flexDirection: "column", gap: 24 },
      }}
    >
      <VoidUI.Title2 text="Featured" accent=".Works" />

      {/* 主区：单大屏 preview，切换转场（A/C 两种模式） */}
      <div style={{ position: "relative", flex: 1, minHeight: 480 }}>
        <a
          href={getLocalizedUrl(`/works/${cur.id}`, locale, theme)}
          aria-label={`${cur.title} — ${cur.subtitle}`}
          className="portfolio__void-home-featured-works__panel"
          style={{
            position: "relative",
            padding: 16,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
            gap: 16,
            minHeight: 480,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          {/* 左：大屏 preview — 与全局页面切换同语言（opacity + blur 4px） */}
          <motion.div
            key={`L-${revealKey}`}
            initial={reduced ? { opacity: 1 } : { opacity: 0, filter: "blur(4px)" }}
            animate={
              contentVisible
                ? { opacity: 1, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(4px)" }
            }
            transition={{
              duration: (contentVisible ? REVEAL_MS : FADE_MS) / 1000,
              ease: "easeOut",
            }}
            style={{
              position: "relative",
              overflow: "hidden",
              minHeight: 320,
              background: "#05060A",
            }}
          >
            <VoidShaderImage imageUrl={cur.cover} />
          </motion.div>

          {/* 右：元数据面板 — 与全局页面切换同语言 */}
          <motion.div
            key={`R-${revealKey}`}
            initial={reduced ? { opacity: 1 } : { opacity: 0, filter: "blur(4px)" }}
            animate={
              contentVisible
                ? { opacity: 1, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(4px)" }
            }
            transition={{
              duration: (contentVisible ? REVEAL_MS : FADE_MS) / 1000,
              ease: "easeOut",
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <VoidUI.Card
              variant="slab"
              color="accent"
              style={{ flex: 1 }}
              title={cur.title}
              desc={cur.subtitle}
              rows={[
                {
                  label: "STACKS",
                  color: "accent",
                  value: (
                    <span
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                      }}
                    >
                      {cur.techStack.slice(0, 4).map((t) => (
                        <VoidUI.Tag key={t} variant="daily" size="xs">
                          {t}
                        </VoidUI.Tag>
                      ))}
                      {cur.techStack.length > 4 && (
                        <VoidUI.Tag variant="familiar" size="xs">
                          +{cur.techStack.length - 4}
                        </VoidUI.Tag>
                      )}
                    </span>
                  ),
                },
                { label: "ROLE", color: "accent-2", value: cur.myRole },
                {
                  label: "IMPACT",
                  color: "success",
                  value: cur.businessValue
                    .map((v) => `${v.value}${v.suffix} ${v.label}`)
                    .join(" · "),
                },
              ]}
            />
          </motion.div>
        </a>
      </div>

      {/* 底部控制栏：PREV / NEXT + 项目编号（位于内容下方、缩略图条上方） */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <VoidUI.Button onClick={() => goto(active - 1)} ariaLabel="Previous">
          PREV
        </VoidUI.Button>
        <VoidUI.Button variant="contained" onClick={() => goto(active + 1)} ariaLabel="Next">
          NEXT
        </VoidUI.Button>

        <span
          style={{
            fontFamily: "var(--theme-font-mono)",
            fontSize: 12,
            color: "var(--theme-accent)",
            letterSpacing: "0.2em",
            fontWeight: 700,
          }}
        >
          {String(displayed + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
        </span>
      </div>

      {/* 底部缩略图导航条 —— 强制单行，小屏自动收窄 */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "nowrap",
          marginTop: 8,
          width: "100%",
        }}
      >
        {works.map((w, i) => (
          <button
            key={w.id}
            onClick={() => goto(i)}
            aria-label={`Go to ${w.title}`}
            style={{
              flex: "1 1 0",
              minWidth: 0,
              maxWidth: 120,
              height: 6,
              background:
                i === displayed
                  ? "var(--theme-accent)"
                  : "color-mix(in srgb, var(--theme-fg) 16%, transparent)",
              border: "none",
              cursor: "pointer",
              transition: "background 200ms",
              boxShadow: i === displayed ? "0 0 8px var(--theme-accent)" : "none",
            }}
          />
        ))}
      </div>

      {/* 底部 view-all CTA */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <VoidUI.Button href={getLocalizedUrl("/works", locale, theme)}>
          VIEW ALL WORKS
        </VoidUI.Button>
      </div>
    </SitePageSection>
  );
}
