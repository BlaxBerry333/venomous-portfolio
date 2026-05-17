import type { Work } from "@/data/works";
import { useWorks } from "@/data/works.hooks";
import { MangaUI } from "@/themes/manga/components";
import VoidWorkDetail from "@/themes/void/sections/VoidWorkDetail";
import type { Locale, Theme } from "@/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Panel1Cover from "./panels/Panel1Cover";
import Panel2Context from "./panels/Panel2Context";
import Panel3TechStack from "./panels/Panel3TechStack";
import Panel4Role from "./panels/Panel4Role";
import Panel5Contributions from "./panels/Panel5Contributions";
import Panel6Challenges from "./panels/Panel6Challenges";
import Panel7Value from "./panels/Panel7Value";
import Panel8Demo from "./panels/Panel8Demo";
import Panel9Next from "./panels/Panel9Next";

// 简易 useMediaQuery — hydration 安全：SSR 和 CSR 首帧均返回 false，mount 后读真实值
function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatch(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatch(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return match;
}

interface SectionItem {
  id: string;
  index: number;
  label: string;
  jpLabel: string;
}

const TOTAL = 9;
const SWITCH_LOCK_MS = 700;

interface Props {
  workId?: string;
  theme: Theme;
  locale: Locale;
}

export default function WorkDetail({ workId = "fintech-dashboard", theme, locale }: Props) {
  const works = useWorks(locale);
  const work: Work = works.find((w) => w.id === workId) || works[0];

  // Void：单列长读 narrative
  if (theme === "void") {
    return <VoidWorkDetail work={work} />;
  }

  // Zenless：普通垂直页面，所有 panel 顺序排列，浏览器滚动
  if (theme === "zenless") {
    return <ZenlessVerticalDetail work={work} theme={theme} />;
  }

  // Manga：横向左右切换，黑黄按钮夹击（同 Home Featured!! 风格）
  return <MangaHorizontalDetail work={work} theme={theme} />;
}

// =============== Vertical (Zenless) ===============

const ZENLESS_SECTIONS: SectionItem[] = [
  { id: "phase-1", index: 1, label: "Cover", jpLabel: "表紙" },
  { id: "phase-2", index: 2, label: "Briefing", jpLabel: "状況" },
  { id: "phase-3", index: 3, label: "Loadout", jpLabel: "装備" },
  { id: "phase-4", index: 4, label: "Operator", jpLabel: "役職" },
  { id: "phase-5", index: 5, label: "Achievements", jpLabel: "戦果" },
  { id: "phase-6", index: 6, label: "Threats", jpLabel: "脅威" },
  { id: "phase-7", index: 7, label: "Rewards", jpLabel: "報酬" },
  { id: "phase-8", index: 8, label: "Combat Replay", jpLabel: "実演" },
  { id: "phase-9", index: 9, label: "Next Mission", jpLabel: "次回予告" },
];

function ZenlessVerticalDetail({ work, theme }: { work: Work; theme: Theme }) {
  const [, setActiveIndex] = useState(1);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const setRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el);
    else sectionRefs.current.delete(id);
  };

  // IntersectionObserver：选中视口中"最靠近 35% 顶部参考线"的 section
  useEffect(() => {
    const els = Array.from(sectionRefs.current.values());
    if (!els.length) return;
    const visible = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio);
          else visible.delete(entry.target);
        }
        if (!visible.size) return;
        let bestEl: Element | null = null;
        let bestRatio = -1;
        for (const [el, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestEl = el;
          }
        }
        if (bestEl) {
          const hit = ZENLESS_SECTIONS.find((s) => sectionRefs.current.get(s.id) === bestEl);
          if (hit) setActiveIndex(hit.index);
        }
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [work.id]);

  return (
    <div
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 25% 75%, rgba(139,92,246,0.18) 0%, transparent 60%), var(--theme-bg)",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div
        className="zenless-detail-content"
        style={{
          minHeight: "calc(100vh - 60px)",
          scrollBehavior: "smooth",
        }}
      >
        {ZENLESS_SECTIONS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            ref={setRef(s.id)}
            data-phase={s.index}
            style={{
              position: "relative",
              scrollMarginTop: 80,
            }}
          >
            {s.index < ZENLESS_SECTIONS.length && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: "var(--space-2xl)",
                  bottom: -1,
                  width: 32,
                  height: 1,
                  background: "var(--theme-accent)",
                  boxShadow: "0 0 6px var(--theme-accent)",
                  opacity: 0.6,
                }}
              />
            )}
            {renderZenlessPanel(s.index, work, theme)}
          </section>
        ))}
      </div>
    </div>
  );
}

function renderZenlessPanel(index: number, work: Work, theme: Theme) {
  switch (index) {
    case 1:
      return <Panel1Cover work={work} theme={theme} />;
    case 2:
      return <Panel2Context work={work} theme={theme} />;
    case 3:
      return <Panel3TechStack work={work} active={true} theme={theme} />;
    case 4:
      return <Panel4Role work={work} theme={theme} />;
    case 5:
      return <Panel5Contributions work={work} theme={theme} />;
    case 6:
      return <Panel6Challenges work={work} theme={theme} />;
    case 7:
      return <Panel7Value work={work} active={true} theme={theme} />;
    case 8:
      return <Panel8Demo work={work} theme={theme} />;
    case 9:
      return <Panel9Next theme={theme} />;
    default:
      return null;
  }
}

// =============== Manga Horizontal ===============

const LABELS = [
  "Cover",
  "Context",
  "Tech Stack",
  "My Role",
  "Contributions",
  "Challenges",
  "Value",
  "Demo",
  "Next",
];

function MangaHorizontalDetail({ work, theme }: { work: Work; theme: Theme }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  if (isMobile) {
    return <MangaVerticalDetail work={work} theme={theme} />;
  }
  return <MangaHorizontalDetailInner work={work} theme={theme} />;
}

function MangaHorizontalDetailInner({ work, theme }: { work: Work; theme: Theme }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const lockRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goto = (i: number) => {
    if (lockRef.current) return;
    if (i < 0 || i >= TOTAL) return;
    lockRef.current = true;
    setDir(i > index ? 1 : -1);
    setIndex(i);
    setTimeout(() => {
      lockRef.current = false;
    }, SWITCH_LOCK_MS);
  };

  // 键盘 + 滚轮 + 触屏
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 8 && Math.abs(e.deltaX) < 8) return;
      const d = e.deltaY + e.deltaX > 0 ? 1 : -1;
      goto(index + d);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goto(index + 1);
      else if (e.key === "ArrowLeft") goto(index - 1);
    };
    const el = containerRef.current;
    el?.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      el?.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [index]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 60) goto(index + (dx < 0 ? 1 : -1));
    };
    el.addEventListener("touchstart", onStart);
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [index]);

  const renderPanel = (i: number) => {
    switch (i) {
      case 0:
        return <Panel1Cover work={work} theme={theme} />;
      case 1:
        return <Panel2Context work={work} theme={theme} />;
      case 2:
        return <Panel3TechStack work={work} active={index === 2} theme={theme} />;
      case 3:
        return <Panel4Role work={work} theme={theme} />;
      case 4:
        return <Panel5Contributions work={work} theme={theme} />;
      case 5:
        return <Panel6Challenges work={work} theme={theme} />;
      case 6:
        return <Panel7Value work={work} active={index === 6} theme={theme} />;
      case 7:
        return <Panel8Demo work={work} theme={theme} />;
      case 8:
        return <Panel9Next theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "linear-gradient(180deg, var(--theme-bg) 0%, #EAE3D6 100%)",
      }}
      tabIndex={0}
    >
      {/* 固定背景层（不随 panel 平移） */}
      <div
        aria-hidden
        className="manga-ui--halftone"
        style={{
          position: "absolute",
          inset: 0,
          color: "rgba(14,14,16,0.18)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* panel 切换层 */}
      <div
        style={{
          position: "absolute",
          inset: "60px 96px 80px 96px",
          zIndex: 1,
        }}
        className="manga-detail-stage"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            role="region"
            aria-roledescription="slide"
            aria-label={`Panel ${index + 1} of ${TOTAL} — ${LABELS[index]}`}
            initial={
              reduced
                ? { opacity: 0 }
                : {
                    x: dir > 0 ? "100%" : "-100%",
                    opacity: 1,
                  }
            }
            animate={
              reduced
                ? { opacity: 1, x: 0 }
                : {
                    x: 0,
                    opacity: 1,
                  }
            }
            exit={
              reduced
                ? { opacity: 0 }
                : {
                    x: dir > 0 ? "-100%" : "100%",
                    opacity: 1,
                  }
            }
            transition={{
              duration: reduced ? 0.2 : 0.55,
              ease: [0.83, 0, 0.17, 1],
            }}
            style={{
              position: "absolute",
              inset: 0,
            }}
          >
            {renderPanel(index)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 左按钮（红底）— 没有上一章时不显示 */}
      {index > 0 && (
        <div
          className="manga-detail-btn-wrap"
          style={{
            position: "absolute",
            left: 18,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
          }}
        >
          <MangaUI.Button
            onClick={() => goto(index - 1)}
            aria-label="Previous panel"
            color="red"
            size="md"
            restRotate={-2}
            className="manga-detail-btn"
            style={{ width: 56, height: 96, padding: 0 }}
          >
            {"<"}
          </MangaUI.Button>
        </div>
      )}

      {/* 右按钮（黄底）— 没有下一章时不显示 */}
      {index < TOTAL - 1 && (
        <div
          className="manga-detail-btn-wrap right"
          style={{
            position: "absolute",
            right: 18,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
          }}
        >
          <MangaUI.Button
            onClick={() => goto(index + 1)}
            aria-label="Next panel"
            color="yellow"
            size="md"
            restRotate={2}
            className="manga-detail-btn"
            style={{ width: 56, height: 96, padding: 0 }}
          >
            {">"}
          </MangaUI.Button>
        </div>
      )}

      {/* 底部进度（只保留 dots 条） */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          zIndex: 10,
          padding: "0 var(--space-lg)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {LABELS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDir(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Page ${i + 1}`}
              style={{
                width: i === index ? 36 : 14,
                height: 12,
                background: i === index ? "var(--theme-accent)" : "var(--theme-fg)",
                border: "2px solid var(--theme-fg)",
                cursor: "pointer",
                transition: "width 200ms",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// =============== Manga Vertical (移动端) ===============
// 移动端把横向 9 page 改成纵向长滚 — 去掉翻页按钮 / dot 条 / stage absolute 包裹
function MangaVerticalDetail({ work, theme }: { work: Work; theme: Theme }) {
  const renderPanel = (i: number) => {
    switch (i) {
      case 0:
        return <Panel1Cover work={work} theme={theme} />;
      case 1:
        return <Panel2Context work={work} theme={theme} />;
      case 2:
        return <Panel3TechStack work={work} active={true} theme={theme} />;
      case 3:
        return <Panel4Role work={work} theme={theme} />;
      case 4:
        return <Panel5Contributions work={work} theme={theme} />;
      case 5:
        return <Panel6Challenges work={work} theme={theme} />;
      case 6:
        return <Panel7Value work={work} active={true} theme={theme} />;
      case 7:
        return <Panel8Demo work={work} theme={theme} />;
      case 8:
        return <Panel9Next theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="manga-detail-vertical"
      style={{
        background: "linear-gradient(180deg, var(--theme-bg) 0%, #EAE3D6 100%)",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div
        aria-hidden
        className="manga-ui--halftone"
        style={{
          position: "fixed",
          inset: 0,
          color: "rgba(14,14,16,0.18)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <section key={i} data-panel={i + 1} style={{ position: "relative" }}>
            {renderPanel(i)}
          </section>
        ))}
      </div>
    </div>
  );
}
