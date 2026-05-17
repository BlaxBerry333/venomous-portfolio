import { skillCategories, type SkillLevel } from "@/data/skills";
import type { Work } from "@/data/works";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VoidUI } from "../components";
import { VoidSkillTokenList } from "./VoidSkillTokens";
import "./VoidWorkDetail.scss";

// 把 work.techStack 的扁平字符串解析成 (name, level) — 在 skillCategories 中查不到时降级为 daily
function resolveStackLevels(techStack: string[]): { name: string; level: SkillLevel }[] {
  const levelMap = new Map<string, SkillLevel>();
  for (const cat of skillCategories) {
    for (const [name, lv] of Object.entries(cat.levels)) {
      levelMap.set(name, lv);
    }
  }
  return techStack.map((name) => ({ name, level: levelMap.get(name) ?? "daily" }));
}

// Void Work Detail — 单列长读 narrative
// 极简长读：左侧 sticky 章节进度 / 右侧主流式叙述 / 单冷青色 / 大留白

const SECTIONS = [
  { id: "cover", label: "Cover" },
  { id: "context", label: "Context" },
  { id: "stack", label: "Stack" },
  { id: "role", label: "Role" },
  { id: "build", label: "What I Built" },
  { id: "challenges", label: "Challenges" },
  { id: "value", label: "Value" },
  { id: "demo", label: "Demo" },
];

export default function VoidWorkDetail({ work }: { work: Work }) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // 跟踪当前可视章节（IntersectionObserver）
  useEffect(() => {
    const sectionEls = SECTIONS.map((s) => document.getElementById(`void-sec-${s.id}`)).filter(
      Boolean,
    ) as HTMLElement[];
    if (sectionEls.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.id.replace("void-sec-", "");
            const i = SECTIONS.findIndex((s) => s.id === id);
            if (i >= 0) setActive(i);
          }
        });
      },
      { threshold: 0.4, rootMargin: "-20% 0px -40% 0px" },
    );
    sectionEls.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const isNda = work.demoType === "nda";

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        maxWidth: 800,
        margin: "0 auto",
        color: "var(--theme-fg)",
        position: "relative",
      }}
    >
      <div
        className="void-detail-wrapper"
        style={{
          position: "relative",
          // padding: "var(--space-3xl) var(--site-padding-x) clamp(60px, 10vh, 120px)",
        }}
      >
        {/* 左 rail — portal 到 body 逃出 AnimatePresence 的 filter（filter 会创建 containing block 让 fixed 失效）*/}
        <RailPortal active={active} reduced={!!reduced} />

        {/* 主内容 — 在视口居中，独立于 rail */}
        <article style={{ maxWidth: "var(--site-max-width)", margin: "0 auto", minWidth: 0 }}>
          {/* §01 Cover */}
          <Section id="cover" first reduced={!!reduced}>
            <VoidUI.Title1 text={work.title} animate="fade-up" style={{ marginBottom: 24 }} />
            <p
              style={{
                fontFamily: "var(--theme-font-body)",
                fontSize: "clamp(18px, 1.8vw, 24px)",
                color: "var(--theme-fg-muted)",
                lineHeight: 1.5,
                fontWeight: 300,
                marginBottom: 40,
                maxWidth: 720,
              }}
            >
              {work.subtitle}
            </p>
            <div
              style={{
                aspectRatio: "16/9",
                width: "100%",
                background: `linear-gradient(180deg, transparent 60%, var(--theme-bg) 100%), url(${work.cover}) center/cover`,
                filter: isNda
                  ? "blur(12px) saturate(0.5) brightness(0.6)"
                  : "saturate(0.6) brightness(0.9)",
                border: "1px solid color-mix(in srgb, var(--theme-fg) 12%, transparent)",
              }}
              role="img"
              aria-label={`${work.title} cover`}
            />
            {isNda && (
              <p
                style={{
                  fontFamily: "var(--theme-font-mono)",
                  fontSize: 11,
                  color: "var(--theme-alert)",
                  letterSpacing: "0.3em",
                  marginTop: 12,
                  textTransform: "uppercase",
                }}
              >
                ⌘ NDA — visual obscured
              </p>
            )}
          </Section>

          {/* §02 Context */}
          <Section id="context" reduced={!!reduced}>
            <VoidUI.Title2 eyebrow="§02 — CONTEXT" text="Context" />
            <Body>
              {work.category === "company"
                ? "A company-scale engagement. The brief and outcomes captured here distil what shipped — not the noise of the team."
                : "A personal project. Built to explore an edge of the platform that paid work hadn't taken me to yet."}
            </Body>
            <Meta
              rows={[
                { k: "Category", v: work.category === "company" ? "Company" : "Personal" },
                { k: "Format", v: work.demoType.toUpperCase() },
              ]}
            />
          </Section>

          {/* §03 Stack — 复用 about/Constellation 的 SkillToken 视觉 */}
          <Section id="stack" reduced={!!reduced}>
            <VoidUI.Title2 eyebrow="§03 — STACK" text="Stack" />
            <VoidSkillTokenList items={resolveStackLevels(work.techStack)} reduced={!!reduced} />
          </Section>

          {/* §04 Role */}
          <Section id="role" reduced={!!reduced}>
            <VoidUI.Title2 eyebrow="§04 — ROLE" text="My Role" />
            <Body>{work.myRole}</Body>
          </Section>

          {/* §05 Build */}
          <Section id="build" reduced={!!reduced}>
            <VoidUI.Title2 eyebrow="§05 — WHAT I BUILT" text="What I Built" />
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: "24px 0 0",
                counterReset: "build-counter",
              }}
            >
              {work.contributions.map((c, i) => (
                <motion.li
                  key={i}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: 24,
                    alignItems: "baseline",
                    padding: "20px 0",
                    borderTop:
                      i === 0
                        ? "none"
                        : "1px solid color-mix(in srgb, var(--theme-fg) 8%, transparent)",
                  }}
                >
                  <VoidUI.Tag variant="daily" size="xs">
                    /{String(i + 1).padStart(2, "0")}
                  </VoidUI.Tag>
                  <p
                    style={{
                      fontFamily: "var(--theme-font-body)",
                      fontSize: "clamp(16px, 1.4vw, 19px)",
                      color: "var(--theme-fg)",
                      lineHeight: 1.55,
                      fontWeight: 300,
                    }}
                  >
                    {c}
                  </p>
                </motion.li>
              ))}
            </ol>
          </Section>

          {/* §06 Challenges */}
          <Section id="challenges" reduced={!!reduced}>
            <VoidUI.Title2 eyebrow="§06 — CHALLENGES" text="Challenges" />
            <div style={{ display: "grid", gap: 32, marginTop: 24 }}>
              {work.challenges.map((c, i) => (
                <motion.div
                  key={i}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: "grid",
                    gap: 12,
                    padding: "24px 0",
                    borderTop: "1px solid color-mix(in srgb, var(--theme-fg) 10%, transparent)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--theme-font-mono)",
                      fontSize: 11,
                      color: "var(--theme-fg-muted)",
                      letterSpacing: "0.25em",
                      marginBottom: 4,
                    }}
                  >
                    PROBLEM
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--theme-font-body)",
                      fontSize: "clamp(17px, 1.5vw, 21px)",
                      lineHeight: 1.5,
                      color: "var(--theme-fg)",
                      fontWeight: 400,
                    }}
                  >
                    {c.problem}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--theme-font-mono)",
                      fontSize: 11,
                      color: "var(--theme-accent)",
                      letterSpacing: "0.25em",
                      marginTop: 8,
                    }}
                  >
                    ↳ SOLUTION
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--theme-font-body)",
                      fontSize: "clamp(15px, 1.3vw, 18px)",
                      lineHeight: 1.55,
                      color: "var(--theme-fg-muted)",
                      fontWeight: 300,
                    }}
                  >
                    {c.solution}
                  </p>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* §07 Value */}
          <Section id="value" reduced={!!reduced}>
            <VoidUI.Title2 eyebrow="§07 — VALUE" text="Value Shipped" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 24,
                marginTop: 32,
              }}
            >
              {work.businessValue.map((v, i) => (
                <motion.div
                  key={v.label}
                  initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    padding: "24px 0",
                    borderTop: "1px solid var(--theme-accent)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--theme-font-display)",
                      fontWeight: 900,
                      fontSize: "clamp(40px, 5vw, 72px)",
                      color: "var(--theme-accent)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {v.value}
                    <span style={{ fontSize: "0.5em", marginLeft: 4 }}>{v.suffix}</span>
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--theme-font-mono)",
                      fontSize: 11,
                      color: "var(--theme-fg-muted)",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                    }}
                  >
                    {v.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* §08 Demo */}
          <Section id="demo" reduced={!!reduced}>
            <VoidUI.Title2 eyebrow="§08 — DEMO" text="Demo" />
            {isNda ? (
              <div
                style={{
                  marginTop: 24,
                  padding: 40,
                  border: "1px dashed color-mix(in srgb, var(--theme-alert) 60%, transparent)",
                  background: "color-mix(in srgb, var(--theme-alert) 4%, transparent)",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 11,
                    color: "var(--theme-alert)",
                    letterSpacing: "0.4em",
                    marginBottom: 12,
                  }}
                >
                  ⌘ CLASSIFIED
                </p>
                <p
                  style={{
                    fontFamily: "var(--theme-font-body)",
                    fontSize: 15,
                    color: "var(--theme-fg-muted)",
                    fontWeight: 300,
                  }}
                >
                  Visual evidence is under NDA. Keywords:{" "}
                  {(work.ndaKeywords || []).map((k, i) => (
                    <span key={k}>
                      <code
                        style={{
                          fontFamily: "var(--theme-font-mono)",
                          color: "var(--theme-fg)",
                          background: "color-mix(in srgb, var(--theme-fg) 8%, transparent)",
                          padding: "2px 6px",
                        }}
                      >
                        {k}
                      </code>
                      {i < (work.ndaKeywords?.length || 0) - 1 ? " · " : ""}
                    </span>
                  ))}
                </p>
              </div>
            ) : (
              <div
                style={{
                  marginTop: 24,
                  aspectRatio: "16/9",
                  width: "100%",
                  background: `url(${work.cover}) center/cover`,
                  filter: "saturate(0.7)",
                  border: "1px solid color-mix(in srgb, var(--theme-fg) 12%, transparent)",
                }}
                role="img"
                aria-label={`${work.title} preview`}
              />
            )}
          </Section>

          {/* End — 极简 next */}
          <div
            style={{
              marginTop: "clamp(80px, 14vh, 160px)",
              paddingTop: 32,
              borderTop: "1px solid color-mix(in srgb, var(--theme-fg) 12%, transparent)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--theme-font-mono)",
                fontSize: 11,
                color: "var(--theme-fg-muted)",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
              }}
            >
              END OF TRANSMISSION · CHEN.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

// =================== rail portal ===================
// 父级 motion.div 用了 filter:blur 转场——CSS 规范规定 filter 创建 containing block，
// 会让内部 position:fixed 退化为 position:absolute。用 portal 把 rail 挂到 document.body 逃出。

function RailPortal({ active, reduced }: { active: number; reduced: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <aside
      className="portfolio__void-work-detail__rail"
      style={{
        position: "fixed",
        left: "clamp(20px, 3vw, 48px)",
        top: 140,
        width: 180,
        zIndex: 40,
        pointerEvents: "auto",
      }}
    >
      <p
        style={{
          fontFamily: "var(--theme-font-mono)",
          fontSize: 10,
          color: "var(--theme-accent)",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      >
        § CONTENTS
      </p>
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          fontFamily: "var(--theme-font-mono)",
          fontSize: 11,
          letterSpacing: "0.15em",
        }}
      >
        {SECTIONS.map((s, i) => {
          const isActive = i === active;
          return (
            <li
              key={s.id}
              style={{
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
                position: "relative",
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "relative",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: isActive
                    ? "var(--theme-accent)"
                    : "color-mix(in srgb, var(--theme-fg) 30%, transparent)",
                  boxShadow: isActive
                    ? "0 0 6px rgba(107,216,230,0.95), 0 0 16px rgba(107,216,230,0.65), 0 0 32px rgba(107,216,230,0.35)"
                    : "none",
                  flexShrink: 0,
                  transition: "background 200ms, box-shadow 200ms",
                }}
              >
                {isActive && !reduced && (
                  <motion.span
                    key={`ripple-${i}-${active}`}
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 6, opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: -2,
                      borderRadius: "50%",
                      border: "1px solid var(--theme-accent)",
                      pointerEvents: "none",
                    }}
                  />
                )}
              </span>
              <a
                href={`#void-sec-${s.id}`}
                style={{
                  color: isActive ? "var(--theme-accent)" : "var(--theme-fg-muted)",
                  textShadow: isActive
                    ? "0 0 8px rgba(107,216,230,0.85), 0 0 20px rgba(107,216,230,0.45)"
                    : "none",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 200ms, text-shadow 200ms",
                }}
              >
                {String(i + 1).padStart(2, "0")} · {s.label}
              </a>
            </li>
          );
        })}
      </ol>
    </aside>,
    document.body,
  );
}

// =================== atoms ===================

function Section({
  id,
  first,
  reduced,
  children,
}: {
  id: string;
  first?: boolean;
  reduced: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={`void-sec-${id}`}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        paddingTop: first ? 0 : "clamp(80px, 14vh, 160px)",
        scrollMarginTop: 100,
      }}
    >
      {children}
    </motion.section>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--theme-font-body)",
        fontSize: "clamp(17px, 1.5vw, 21px)",
        color: "var(--theme-fg-muted)",
        lineHeight: 1.6,
        fontWeight: 300,
        maxWidth: 720,
      }}
    >
      {children}
    </p>
  );
}

function Meta({ rows }: { rows: { k: string; v: string }[] }) {
  return (
    <dl
      style={{
        margin: "32px 0 0",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "16px 32px",
        fontFamily: "var(--theme-font-mono)",
        fontSize: 13,
        borderTop: "1px solid color-mix(in srgb, var(--theme-fg) 10%, transparent)",
        paddingTop: 24,
      }}
    >
      {rows.map((r) => (
        <div key={r.k} style={{ display: "contents" }}>
          <dt
            style={{
              color: "var(--theme-fg-muted)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontSize: 11,
              alignSelf: "baseline",
              paddingTop: 2,
            }}
          >
            {r.k}
          </dt>
          <dd
            style={{
              margin: 0,
              color: "var(--theme-fg)",
              fontWeight: 400,
            }}
          >
            {r.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
