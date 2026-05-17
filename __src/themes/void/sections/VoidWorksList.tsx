import SitePageSection from "@/components/react/layout/SitePageSection";
import { skillCategories, type SkillLevel } from "@/data/skills";
import type { Work, WorkCategory } from "@/data/works";
import { useWorks } from "@/data/works.hooks";
import type { Locale, Theme } from "@/types";
import { getLocalizedUrl } from "@/utils/i18n";
import { motion } from "framer-motion";
import { useState } from "react";
import { VoidUI } from "../components";
import VoidParticleStream from "../effects/VoidParticleStream";

// 把 skillCategories 中的等级表压平为 name → level 查表
// （levels 表与 locale 无关，模块级求值即可）
const SKILL_LEVEL_LOOKUP: Map<string, SkillLevel> = (() => {
  const m = new Map<string, SkillLevel>();
  for (const cat of skillCategories) {
    for (const [name, lv] of Object.entries(cat.levels)) {
      m.set(name, lv);
    }
  }
  return m;
})();

type Filter = "all" | WorkCategory;

function VoidWorkCard({ work, index, href }: { work: Work; index: number; href: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 0 28px rgba(107,216,230,0.25)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="void-ui--frame-bordered"
      style={{
        position: "relative",
        background: "var(--theme-surface)",
        cursor: "pointer",
        overflow: "hidden",
        color: "inherit",
        textDecoration: "none",
        display: "block",
      }}
      aria-label={`${work.title} — ${work.subtitle}`}
    >
      {hovered && (
        <VoidParticleStream
          count={10}
          radius={[120, 200]}
          spread="upRight"
          loop={true}
          durationMs={1400}
        />
      )}
      {/* 图区 — hover 时 image 同步降亮，让冷青粒子流不被亮封面吃掉 */}
      <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
        <img
          src={work.cover}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: hovered ? "brightness(0.4) saturate(0.7)" : "brightness(1) saturate(1)",
            transition: "filter 220ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        {/* hover 时叠一层冷青色调让暗下来后画面带"虚空"感 */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(107,216,230,0.10) 0%, transparent 70%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 220ms cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 50%, rgba(5,5,7,0.85) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* 标题 overlay */}
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 2 }}>
          <p
            style={{
              fontFamily: "var(--theme-font-mono)",
              fontSize: 10,
              color: "var(--theme-accent)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              textShadow: "none",
            }}
          >
            ◆ {work.category}
          </p>
          <h3
            style={{
              fontFamily: "var(--theme-font-display)",
              fontWeight: 900,
              fontSize: "clamp(20px, 2.4vw, 30px)",
              color: "var(--theme-fg)",
              letterSpacing: "-0.02em",
              marginTop: 4,
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
              lineHeight: 1.05,
            }}
          >
            {work.title}
          </h3>
        </div>
      </div>

      {/* 底部信息条 */}
      <div style={{ padding: "12px 14px" }}>
        <p
          style={{
            fontFamily: "var(--theme-font-body)",
            fontSize: 13,
            color: "var(--theme-fg-muted)",
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {work.subtitle}
        </p>
        {/* 技术栈 chip — 复用 VoidTag 视觉，无 hover */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {work.techStack.slice(0, 3).map((t) => (
            <VoidUI.Tag key={t} size="xs" variant={SKILL_LEVEL_LOOKUP.get(t) ?? "daily"}>
              {t}
            </VoidUI.Tag>
          ))}
          {work.techStack.length > 3 && (
            <span
              style={{
                padding: "3px 6px",
                fontFamily: "var(--theme-font-mono)",
                fontSize: 10,
                color: "var(--theme-fg-dim)",
                alignSelf: "center",
                letterSpacing: "0.1em",
              }}
            >
              {work.techStack.length - 3}+ MORE
            </span>
          )}
        </div>
      </div>
    </motion.a>
  );
}

interface VoidWorksListProps {
  locale: Locale;
  theme: Theme;
}

export default function VoidWorksList({ locale, theme }: VoidWorksListProps) {
  const works = useWorks(locale);
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = works.filter((w) => filter === "all" || w.category === filter);

  return (
    <SitePageSection
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 30% 30%, rgba(107,216,230,0.04) 0%, transparent 65%)",
        minHeight: "100vh",
        paddingTop: "var(--space-3xl)",
        paddingBottom: "clamp(40px, 8vw, 96px)",
      }}
    >
      <VoidUI.Title1 text="All" accent=".Works" animate="fade-up" />

      <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
        {(["all", "company", "personal"] as Filter[]).map((f) => {
          const isActive = filter === f;
          return (
            <VoidUI.Button
              key={f}
              variant={isActive ? "contained" : "outlined"}
              role="tab"
              ariaSelected={isActive}
              onClick={() => setFilter(f)}
            >
              {f}
            </VoidUI.Button>
          );
        })}
      </div>

      {/* card grid */}
      <div
        style={{
          marginTop: "var(--space-2xl)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
          gap: "clamp(16px, 2.5vw, 24px)",
        }}
      >
        {filtered.map((w, i) => (
          <VoidWorkCard
            key={w.id}
            work={w}
            index={i}
            href={getLocalizedUrl(`/works/${w.id}`, locale, theme)}
          />
        ))}
      </div>
    </SitePageSection>
  );
}
