import SitePageSection from "@/components/react/layout/SitePageSection";
import type { DemoType, Work } from "@/data/works";
import { useWorks } from "@/data/works.hooks";
import type { Locale } from "@/types";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ZenlessUI } from "../components";
import "./ZenlessDetailA.scss";
import "./details-variants.css";
import type { ChapterRailItem } from "./shared/ChapterRail";
import ChapterRail from "./shared/ChapterRail";
import ScrollCounter from "./shared/ScrollCounter";

const CHAPTERS: ChapterRailItem[] = [
  { idx: 1, label: "COVER" },
  { idx: 2, label: "BRIEFING" },
  { idx: 3, label: "LOADOUT" },
  { idx: 4, label: "OPERATOR" },
  { idx: 5, label: "ACHIEVEMENTS" },
  { idx: 6, label: "THREATS" },
  { idx: 7, label: "REWARDS" },
  { idx: 8, label: "REPLAY" },
  { idx: 9, label: "NEXT" },
];

// ===================================================
//  Variant A — Mission Console
//  - 顶部固定 HUD 终端条
//  - 章节竖排：每章 ~100vh 框，框内 corner brackets + 扫光 + grid bg
//  - Cover 章节封面用 useScroll parallax 三层
//  - 章节切换用 hazard divider（绿黑流动），到 Threats 章节前换 warn 橙黑
//  - 配色：绿 80% / 紫 10%（成就 + NDA 标识）/ 橙 10%（仅 Threats + 警示）
// ===================================================

const RANK: Record<DemoType, { rank: string; color: string; status: string }> = {
  live: { rank: "S", color: "var(--theme-warn)", status: "OPERATIONAL" },
  iframe: { rank: "A", color: "var(--theme-accent)", status: "STANDBY" },
  screenshot: { rank: "A", color: "var(--theme-accent)", status: "ARCHIVED" },
  nda: { rank: "SS", color: "var(--theme-accent-2)", status: "CLASSIFIED" },
};

interface Props {
  workId?: string;
  locale: Locale;
}

export default function ZenlessDetailA({ workId = "fintech-dashboard", locale }: Props) {
  const works = useWorks(locale);
  const work = works.find((w) => w.id === workId) || works[0];

  const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());
  const [activeChapter, setActiveChapter] = useState(1);

  // IntersectionObserver — 当前 active 章节
  useEffect(() => {
    const els = Array.from(sectionRefs.current.entries());
    if (!els.length) return;
    const visible = new Map<number, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const idx = Number((e.target as HTMLElement).dataset.idx);
          if (e.isIntersecting) visible.set(idx, e.intersectionRatio);
          else visible.delete(idx);
        }
        if (!visible.size) return;
        let best = 1;
        let max = -1;
        for (const [idx, r] of visible) {
          if (r > max) {
            max = r;
            best = idx;
          }
        }
        setActiveChapter(best);
      },
      { rootMargin: "-20% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach(([, el]) => io.observe(el));
    return () => io.disconnect();
  }, [work.id]);

  const setRef = (idx: number) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(idx, el);
    else sectionRefs.current.delete(idx);
  };

  const jumpTo = (idx: number) => {
    const el = sectionRefs.current.get(idx);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="zd-a-main"
      style={{
        background: "var(--theme-bg)",
        position: "relative",
        overflowX: "clip",
      }}
    >
      {/* 全局 grid 背景 */}
      <div
        aria-hidden
        className="zd-grid-bg"
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.4,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Chapter1 work={work} setRef={setRef(1)} active={activeChapter === 1} />
      <Chapter2 work={work} setRef={setRef(2)} active={activeChapter === 2} />
      <Chapter3 work={work} setRef={setRef(3)} active={activeChapter === 3} />
      <Chapter4 work={work} setRef={setRef(4)} active={activeChapter === 4} />
      <Chapter5 work={work} setRef={setRef(5)} active={activeChapter === 5} />
      <ZenlessUI.Hazard color="warn" label="▸▸ ENTERING THREAT ZONE ▸▸" />
      <Chapter6 work={work} setRef={setRef(6)} active={activeChapter === 6} />
      <ZenlessUI.Hazard color="warn" label="▸ EXIT THREAT ZONE ◂" />
      <Chapter7 work={work} setRef={setRef(7)} active={activeChapter === 7} />
      <Chapter8 work={work} setRef={setRef(8)} active={activeChapter === 8} />
      <Chapter9 setRef={setRef(9)} active={activeChapter === 9} />

      <ChapterRail chapters={CHAPTERS} active={activeChapter} onJump={jumpTo} />
    </div>
  );
}

// ============== 通用章节框 ==============

function ChapterFrame({
  idx,
  label,
  setRef,
  active,
  threat = false,
  children,
}: {
  idx: number;
  label: string;
  setRef: (el: HTMLElement | null) => void;
  active: boolean;
  threat?: boolean;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.section
      ref={setRef as any}
      data-idx={idx}
      className="zd-a-stage"
      aria-label={`Phase ${idx} — ${label}`}
      initial={reduced ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderColor: threat ? "color-mix(in srgb, var(--theme-warn) 50%, transparent)" : undefined,
      }}
    >
      <span className="zd-corner zd-corner--tl" />
      <span className="zd-corner zd-corner--tr" />
      <span className="zd-corner zd-corner--bl" />
      <span className="zd-corner zd-corner--br" />
      {active && <span className="zd-glow-edge" aria-hidden />}

      {children}

      {/* 右下角大编号 — 参考 ch7 reward card 描边数字风格 */}
      <span aria-hidden className="zd-a-stage__num">
        {String(idx).padStart(2, "0")}
      </span>
    </motion.section>
  );
}

// ============== Chapter 1 — Cover ==============

function Chapter1({
  work,
  setRef,
  active,
}: {
  work: Work;
  setRef: (el: HTMLElement | null) => void;
  active: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });
  // 三层视差
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0.4]);

  return (
    <section
      ref={(el: HTMLElement | null) => {
        setRef(el);
        containerRef.current = el as HTMLDivElement | null;
      }}
      data-idx={1}
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        marginBottom: 24,
      }}
      aria-label="Phase 1 — Cover"
    >
      {/* L1 背景图（视差最慢） */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-10% 0",
          backgroundImage: `linear-gradient(180deg, transparent 30%, var(--theme-bg) 100%), url(${work.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: yBg,
          opacity,
        }}
      />
      {/* L2 紫色径向 + grain（中速） */}
      <motion.div
        aria-hidden
        className="zd-scanlines"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 25% 75%, rgba(139,92,246,0.28) 0%, transparent 60%)",
          y: yMid,
        }}
      />
      {/* L3 主标题（向上反向视差） */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 5,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 var(--site-padding-x) clamp(80px, 12vh, 160px)",
          y: yTitle,
        }}
      >
        <SitePageSection>
          <CoverFrame work={work} active={active} />
        </SitePageSection>
      </motion.div>
    </section>
  );
}

function CoverFrame({ work, active }: { work: Work; active: boolean }) {
  const reduced = useReducedMotion();
  const rk = RANK[work.demoType];

  return (
    <div className="zd-a-cover" style={{ position: "relative" }}>
      <motion.div
        initial={reduced ? {} : { opacity: 0, x: -40 }}
        animate={active ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", zIndex: 2 }}
      >
        {/* 任务标签条 — 移至标题上方 */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            marginBottom: 24,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <ZenlessUI.Tag
            variant={work.demoType === "live" ? "contained" : "outlined"}
            color={work.demoType === "nda" ? "purple" : "green"}
            size="sm"
          >
            RANK {rk.rank} · {rk.status}
          </ZenlessUI.Tag>
          <ZenlessUI.Tag variant="outlined" color="green" size="sm">
            {work.techStack.length} EQUIPPED
          </ZenlessUI.Tag>
          <ZenlessUI.Tag variant="outlined" color="orange" size="sm">
            2023 — 2024
          </ZenlessUI.Tag>
          {work.demoType === "nda" && (
            <ZenlessUI.Tag variant="contained" color="purple" size="sm">
              NDA
            </ZenlessUI.Tag>
          )}
        </motion.div>

        <ZenlessUI.Title1
          as="h1"
          size="clamp(72px, 16vw, 160px)"
          eyebrow={`MISSION BRIEFING / ${work.category.toUpperCase()}`}
          title={work.title}
          marginBottom="0"
        />

        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--theme-font-body)",
            fontSize: "clamp(18px, 2vw, 26px)",
            color: "var(--theme-fg-muted)",
            marginTop: 24,
            maxWidth: 760,
            lineHeight: 1.4,
          }}
        >
          {work.subtitle}
        </motion.p>
      </motion.div>
    </div>
  );
}

// ============== Chapter 2 — Briefing ==============

function Chapter2({
  work,
  setRef,
  active,
}: {
  work: Work;
  setRef: (el: HTMLElement | null) => void;
  active: boolean;
}) {
  return (
    <ChapterFrame idx={2} label="BRIEFING" setRef={setRef} active={active}>
      <ZenlessUI.Title2
        phase="PHASE 02 / 09"
        label="Briefing"
        title={
          <>
            Mission <span style={{ color: "var(--theme-accent)" }}>Context</span>
          </>
        }
        style={{ marginBottom: 32 }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 48,
          maxWidth: 1400,
        }}
        className="portfolio__zenless-detail-a__ch2"
      >
        {/* 左：briefing 文本 */}
        <div>
          <blockquote
            style={{
              borderLeft: "3px solid var(--theme-accent)",
              paddingLeft: 24,
              margin: 0,
              fontFamily: "var(--theme-font-body)",
              fontSize: "clamp(17px, 1.6vw, 22px)",
              color: "var(--theme-fg)",
              lineHeight: 1.6,
              maxWidth: 800,
            }}
          >
            {work.title} 是{work.category === "company" ? "公司主营业务" : "我个人发起的开源项目"}，
            面向 {work.category === "company" ? "B 端专业用户" : "前端开发社区"}。 服务于{" "}
            <strong style={{ color: "var(--theme-accent)" }}>{work.subtitle}</strong> 这一核心场景。
          </blockquote>
        </div>

        {/* 右：mission stats 侧栏 */}
        <aside
          style={{
            background: "rgba(10,10,10,0.55)",
            border: "1px solid color-mix(in srgb, var(--theme-accent) 32%, transparent)",
            padding: 20,
          }}
        >
          <p
            style={{
              fontFamily: "var(--theme-font-mono)",
              fontSize: 10,
              letterSpacing: "0.3em",
              color: "var(--theme-accent)",
              textTransform: "uppercase",
              margin: "0 0 16px",
              fontWeight: 700,
            }}
          >
            ▣ MISSION STATS
          </p>
          {[
            { k: "TIMELINE", v: "2023 — 2024" },
            {
              k: "STAGE",
              v: work.category === "company" ? "PRODUCTION" : "OPEN SOURCE",
            },
            { k: "STACK", v: `${work.techStack.length} LIBS` },
            { k: "TEAM", v: work.myRole.split("/")[1]?.trim() || "INDEPENDENT" },
          ].map((it, i) => (
            <div
              key={it.k}
              style={{
                paddingTop: i === 0 ? 0 : 12,
                paddingBottom: 12,
                borderBottom:
                  i === 3
                    ? "none"
                    : "1px dashed color-mix(in srgb, var(--theme-fg) 14%, transparent)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--theme-font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  color: "var(--theme-fg-muted)",
                  margin: 0,
                }}
              >
                ▸ {it.k}
              </p>
              <p
                style={{
                  fontFamily: "var(--theme-font-display)",
                  fontWeight: 900,
                  fontSize: 18,
                  color: "var(--theme-fg)",
                  margin: "4px 0 0",
                  letterSpacing: "0.05em",
                }}
              >
                {it.v}
              </p>
            </div>
          ))}
        </aside>
      </div>
    </ChapterFrame>
  );
}

// ============== Chapter 3 — Loadout ==============

function Chapter3({
  work,
  setRef,
  active,
}: {
  work: Work;
  setRef: (el: HTMLElement | null) => void;
  active: boolean;
}) {
  return (
    <ChapterFrame idx={3} label="LOADOUT" setRef={setRef} active={active}>
      <ZenlessUI.Title2
        phase="PHASE 03 / 09"
        label="Loadout"
        title={
          <>
            <span style={{ color: "var(--theme-accent)" }}>Equipment</span> Tree
          </>
        }
        style={{ marginBottom: 32 }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 360px), 1fr))",
          gap: 12,
          maxWidth: 1400,
        }}
      >
        {work.techStack.map((t, i) => {
          const num = String(i + 1).padStart(2, "0");
          return (
            <ZenlessUI.Card
              key={t}
              color="green"
              leading={
                <ZenlessUI.Tag size="md" variant="contained" color="green">
                  {num}
                </ZenlessUI.Tag>
              }
              title={t}
              trailing={
                <span
                  style={{
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--theme-accent)",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  SLOT {num}
                </span>
              }
              staggerIndex={i}
            />
          );
        })}
      </div>
    </ChapterFrame>
  );
}

// ============== Chapter 4 — Operator ==============

function Chapter4({
  work,
  setRef,
  active,
}: {
  work: Work;
  setRef: (el: HTMLElement | null) => void;
  active: boolean;
}) {
  const [pos, team] = work.myRole.includes("/")
    ? [work.myRole.split("/")[0].trim(), work.myRole.split("/").slice(1).join("/").trim()]
    : [work.myRole, "Independent"];

  return (
    <ChapterFrame idx={4} label="OPERATOR" setRef={setRef} active={active}>
      <ZenlessUI.Title2
        phase="PHASE 04 / 09"
        label="Operator"
        title={
          <>
            Active <span style={{ color: "var(--theme-accent)" }}>Operator</span>
          </>
        }
        style={{ marginBottom: 32 }}
      />

      <div
        className="portfolio__zenless-detail-a__ch4"
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: 48,
          alignItems: "center",
          maxWidth: 1200,
        }}
      >
        {/* 左 operator portrait */}
        <div
          style={{
            position: "relative",
            aspectRatio: "3/4",
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--theme-accent-2) 30%, var(--theme-elevated)), var(--theme-elevated))",
            border: "2px solid var(--theme-accent)",
            clipPath: "polygon(0 0, 100% 0, 100% 88%, 88% 100%, 0 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 32px rgba(197,255,0,0.3)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--theme-font-display)",
              fontWeight: 900,
              fontSize: 120,
              color: "var(--theme-accent)",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              textShadow: "0 0 24px var(--theme-accent)",
            }}
          >
            CHEN
          </span>
          <span
            style={{
              position: "absolute",
              bottom: 14,
              left: 14,
              fontFamily: "var(--theme-font-mono)",
              fontSize: 10,
              letterSpacing: "0.3em",
              color: "var(--theme-accent)",
              textTransform: "uppercase",
            }}
          >
            ▸ OPERATOR
          </span>
        </div>

        {/* 右 stats */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                fontFamily: "var(--theme-font-mono)",
                fontSize: 10,
                letterSpacing: "0.3em",
                color: "var(--theme-accent)",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              ▸ POSITION
            </p>
            <p
              style={{
                fontFamily: "var(--theme-font-display)",
                fontWeight: 900,
                fontSize: 32,
                color: "var(--theme-fg)",
                marginTop: 6,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              {pos}
            </p>
          </div>
          <div style={{ marginBottom: 32 }}>
            <p
              style={{
                fontFamily: "var(--theme-font-mono)",
                fontSize: 10,
                letterSpacing: "0.3em",
                color: "var(--theme-accent-2)",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              ▸ DIVISION
            </p>
            <p
              style={{
                fontFamily: "var(--theme-font-body)",
                fontSize: 18,
                color: "var(--theme-fg-muted)",
                marginTop: 6,
              }}
            >
              {team}
            </p>
          </div>

          {/* 能力雷达条 — 装饰用 mock */}
          <div style={{ display: "grid", gap: 10 }}>
            {[
              { k: "ARCHITECTURE", v: 92 },
              { k: "DELIVERY", v: 88 },
              { k: "RESEARCH", v: 78 },
              { k: "MENTORSHIP", v: 70 },
            ].map((s) => (
              <div
                key={s.k}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 40px",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.25em",
                    color: "var(--theme-fg-muted)",
                  }}
                >
                  ▸ {s.k}
                </span>
                <div
                  style={{
                    height: 8,
                    background: "color-mix(in srgb, var(--theme-fg) 10%, transparent)",
                    position: "relative",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.v}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      height: "100%",
                      background: "var(--theme-accent)",
                      boxShadow: "0 0 8px var(--theme-accent)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "var(--theme-font-display)",
                    fontWeight: 900,
                    fontSize: 14,
                    color: "var(--theme-accent)",
                    textAlign: "right",
                  }}
                >
                  {s.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChapterFrame>
  );
}

// ============== Chapter 5 — Achievements ==============

function Chapter5({
  work,
  setRef,
  active,
}: {
  work: Work;
  setRef: (el: HTMLElement | null) => void;
  active: boolean;
}) {
  return (
    <ChapterFrame idx={5} label="ACHIEVEMENTS" setRef={setRef} active={active}>
      <ZenlessUI.Title2
        phase="PHASE 05 / 09"
        label="Achievements"
        title={
          <>
            Combat <span style={{ color: "var(--theme-accent)" }}>Log</span>
          </>
        }
        style={{ marginBottom: 32 }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 1400 }}>
        {work.contributions.map((c, i) => {
          const num = String(i + 1).padStart(2, "0");
          return (
            <ZenlessUI.Card
              key={i}
              color="green"
              staggerIndex={i}
              leading={
                <span
                  aria-hidden
                  style={{
                    fontFamily: "var(--theme-font-display)",
                    fontWeight: 900,
                    fontSize: 28,
                    color: "var(--theme-accent)",
                    letterSpacing: "-0.02em",
                    width: 56,
                    textAlign: "center",
                  }}
                >
                  {num}
                </span>
              }
              title={c}
              trailing={
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--theme-accent)",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  CLEARED
                </span>
              }
            />
          );
        })}
      </div>
    </ChapterFrame>
  );
}

// ============== Chapter 6 — Threats ==============

function Chapter6({
  work,
  setRef,
  active,
}: {
  work: Work;
  setRef: (el: HTMLElement | null) => void;
  active: boolean;
}) {
  return (
    <ChapterFrame idx={6} label="THREATS" setRef={setRef} active={active} threat>
      <ZenlessUI.Title2
        phase="PHASE 06 / 09"
        label="Threats"
        accentColor="var(--theme-warn)"
        title={
          <>
            Hard <span style={{ color: "var(--theme-warn)" }}>Bosses</span>
          </>
        }
        style={{ marginBottom: 32 }}
      />

      {/* 顶部警戒条 */}
      <ZenlessUI.Hazard color="warn" height={8} style={{ marginBottom: 32 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 1400 }}>
        {work.challenges.map((ch, i) => {
          const num = String(i + 1).padStart(2, "0");
          return (
            <div
              key={i}
              className="portfolio__zenless-detail-a__ch6"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
            >
              <ZenlessUI.Card
                color="orange"
                leading={
                  <ZenlessUI.Tag size="md" variant="contained" color="orange">
                    {num}
                  </ZenlessUI.Tag>
                }
                title={ch.problem}
                trailing={
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "var(--theme-font-mono)",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#FF6B00",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                    }}
                  >
                    THREAT {num}
                  </span>
                }
                staggerIndex={i}
              />
              <ZenlessUI.Card
                color="green"
                leading={
                  <ZenlessUI.Tag size="md" variant="contained" color="green">
                    {num}
                  </ZenlessUI.Tag>
                }
                title={ch.solution}
                trailing={
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "var(--theme-font-mono)",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--theme-accent)",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                    }}
                  >
                    COUNTER {num}
                  </span>
                }
                staggerIndex={i}
              />
            </div>
          );
        })}
      </div>
    </ChapterFrame>
  );
}

// ============== Chapter 7 — Rewards ==============

function Chapter7({
  work,
  setRef,
  active,
}: {
  work: Work;
  setRef: (el: HTMLElement | null) => void;
  active: boolean;
}) {
  return (
    <ChapterFrame idx={7} label="REWARDS" setRef={setRef} active={active}>
      <ZenlessUI.Title2
        phase="PHASE 07 / 09"
        label="Rewards"
        title={
          <>
            <span style={{ color: "var(--theme-accent)" }}>Mission</span> Rewards
          </>
        }
        style={{ marginBottom: 48 }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
          gap: 24,
          maxWidth: 1400,
        }}
      >
        {work.businessValue.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              position: "relative",
              padding: 28,
              background: "var(--theme-elevated)",
              border: "1px solid color-mix(in srgb, var(--theme-accent) 40%, transparent)",
              clipPath: "polygon(2% 0, 100% 0, 98% 100%, 0 100%)",
              overflow: "hidden",
            }}
          >
            {/* 背景大数字底纹 */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                right: -10,
                bottom: -40,
                fontFamily: "var(--theme-font-display)",
                fontWeight: 900,
                fontSize: 220,
                color: "transparent",
                WebkitTextStroke: "1.5px color-mix(in srgb, var(--theme-accent) 18%, transparent)",
                lineHeight: 0.8,
                userSelect: "none",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p
              style={{
                fontFamily: "var(--theme-font-mono)",
                fontSize: 10,
                letterSpacing: "0.3em",
                color: "var(--theme-accent)",
                textTransform: "uppercase",
                fontWeight: 700,
                margin: 0,
                position: "relative",
              }}
            >
              ▸ REWARD {String(i + 1).padStart(2, "0")} · {m.label}
            </p>
            <p
              style={{
                fontFamily: "var(--theme-font-display)",
                fontWeight: 900,
                fontSize: "clamp(56px, 8vw, 140px)",
                color: "var(--theme-accent)",
                lineHeight: 0.9,
                margin: "16px 0 0",
                letterSpacing: "-0.04em",
                position: "relative",
                textShadow: "0 0 20px rgba(197,255,0,0.4)",
              }}
            >
              <ScrollCounter to={m.value} active={active} />
              <span
                style={{
                  fontSize: "0.4em",
                  color: "var(--theme-fg)",
                  marginLeft: 8,
                  letterSpacing: 0,
                }}
              >
                {m.suffix}
              </span>
            </p>
          </motion.div>
        ))}
      </div>
    </ChapterFrame>
  );
}

// ============== Chapter 8 — Replay ==============

function Chapter8({
  work,
  setRef,
  active,
}: {
  work: Work;
  setRef: (el: HTMLElement | null) => void;
  active: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <ChapterFrame idx={8} label="COMBAT REPLAY" setRef={setRef} active={active}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 32,
          gap: 16,
        }}
      >
        <ZenlessUI.Title2
          phase="PHASE 08 / 09"
          label="Combat Replay"
          title={
            <>
              See It <span style={{ color: "var(--theme-accent)" }}>Live</span>
            </>
          }
        />
        {/* REC 状态指示 */}
        {!reduced && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--theme-font-mono)",
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "var(--theme-warn)",
              textTransform: "uppercase",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{
                width: 10,
                height: 10,
                background: "var(--theme-warn)",
                borderRadius: "50%",
                boxShadow: "0 0 8px var(--theme-warn)",
              }}
            />
            REC · LIVE
          </span>
        )}
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/10",
          maxHeight: "60vh",
          background: "rgba(0,0,0,0.7)",
          border: "2px solid var(--theme-accent)",
          boxShadow: "0 0 32px rgba(197,255,0,0.25)",
          overflow: "hidden",
        }}
      >
        <span className="zd-corner zd-corner--tl" />
        <span className="zd-corner zd-corner--tr" />
        <span className="zd-corner zd-corner--bl" />
        <span className="zd-corner zd-corner--br" />

        {work.demoType === "live" && (
          <iframe
            title={work.title}
            src={work.liveUrl ?? "about:blank"}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        )}
        {work.demoType === "iframe" && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--theme-font-mono)",
              color: "var(--theme-fg-muted)",
              fontSize: 13,
              letterSpacing: "0.2em",
            }}
          >
            ⟶ EMBED PLACEHOLDER · {work.iframeUrl}
          </div>
        )}
        {work.demoType === "screenshot" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 4,
              width: "100%",
              height: "100%",
            }}
          >
            {(work.screenshots ?? []).slice(0, 4).map((s, i) => (
              <div
                key={i}
                style={{
                  backgroundImage: `url(${s})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>
        )}
        {work.demoType === "nda" && <NdaCover work={work} />}
      </div>

      {/* 时间轴 mock — REC 时长 */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: "var(--theme-font-mono)",
          fontSize: 11,
          color: "var(--theme-fg-muted)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 4,
            background: "color-mix(in srgb, var(--theme-fg) 12%, transparent)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "60%",
              background: "var(--theme-accent)",
              boxShadow: "0 0 6px var(--theme-accent)",
            }}
          />
        </div>
        <span>02:14 / 03:42</span>
      </div>
    </ChapterFrame>
  );
}

function NdaCover({ work }: { work: Work }) {
  const reduced = useReducedMotion();
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundImage: `linear-gradient(135deg, rgba(10,10,10,0.85), rgba(10,10,10,0.95)), url(${work.cover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(2px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      {/* 警戒线（黄黑）覆盖在 NDA 上 */}
      <ZenlessUI.Hazard
        color="warn"
        animated={!reduced}
        height={32}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "45%",
          opacity: 0.4,
        }}
      />
      <p
        style={{
          fontFamily: "var(--theme-font-display)",
          fontWeight: 900,
          fontSize: 32,
          letterSpacing: "0.4em",
          color: "var(--theme-warn)",
          textTransform: "uppercase",
          margin: 0,
          textShadow: "0 0 12px rgba(255,107,0,0.6)",
        }}
      >
        CLASSIFIED
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          maxWidth: 600,
          padding: "0 16px",
          justifyContent: "center",
        }}
      >
        {(work.ndaKeywords ?? []).slice(0, 4).map((k) => (
          <span
            key={k}
            className="zd-chip zd-chip--ghost"
            style={{
              borderColor: "var(--theme-warn)",
              color: "var(--theme-warn)",
              filter: "blur(2px)",
            }}
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============== Chapter 9 — Next Mission ==============

function Chapter9({
  setRef,
  active,
}: {
  setRef: (el: HTMLElement | null) => void;
  active: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <ChapterFrame idx={9} label="NEXT MISSION" setRef={setRef} active={active}>
      <div
        style={{
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--theme-font-mono)",
            fontSize: 12,
            letterSpacing: "0.4em",
            color: "var(--theme-accent)",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          ▸ MISSION COMPLETE — REWARDS DISPATCHED
        </p>
        <ZenlessUI.Title2
          phase="PHASE 09 / 09"
          label="Next Mission"
          title={
            <>
              Next <span style={{ color: "var(--theme-accent)" }}>Mission</span>
            </>
          }
          titleSize="clamp(48px, 10vw, 200px)"
          style={{ alignItems: "center" }}
        />

        {/* 警戒线 + CTA */}
        <div style={{ width: "100%", maxWidth: 600, margin: "16px 0" }}>
          <ZenlessUI.Hazard animated={!reduced} height={6} style={{ marginBottom: 24 }} />
        </div>

        <motion.button
          animate={reduced ? {} : { x: [0, 12, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 40px",
            background: "var(--theme-accent)",
            color: "var(--theme-bg)",
            border: "2px solid var(--theme-accent)",
            fontFamily: "var(--theme-font-display)",
            fontWeight: 900,
            fontSize: 18,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
            minWidth: 240,
            boxShadow: "0 0 24px rgba(197,255,0,0.5)",
          }}
        >
          DEPLOY
        </motion.button>

        <p
          style={{
            fontFamily: "var(--theme-font-mono)",
            fontSize: 10,
            letterSpacing: "0.3em",
            color: "var(--theme-fg-muted)",
            textTransform: "uppercase",
            marginTop: 24,
          }}
        >
          ◇ END OF FILE · ID#0001 · DEC 2024
        </p>
      </div>
    </ChapterFrame>
  );
}
