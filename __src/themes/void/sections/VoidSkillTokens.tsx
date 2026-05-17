import { LEVEL_META, type SkillLevel } from "@/data/skills";
import { useEffect, useRef, useState } from "react";
import { VoidUI } from "../components";
import "./VoidSkillTokens.scss";

// 共享的 Void 技能 token 系统
// 由 about/Constellation 与 work-detail/Stack 共用，保持视觉一致
// 视觉单位实际是 ui/VoidTag —— 这层只负责"按等级排序 + 列表 reveal + 进入视口动画"

// 单个技能 token：复用 VoidTag 的 3 档视觉，开启 interactive 以获得 hover tooltip + 上浮 + 粒子
export function VoidSkillToken({
  name,
  level,
  delay,
  revealed,
  reduced,
}: {
  name: string;
  level: SkillLevel;
  delay: number;
  revealed: boolean;
  reduced: boolean;
}) {
  return (
    <VoidUI.Tag variant={level} interactive delay={delay} revealed={revealed} reduced={reduced}>
      {name}
    </VoidUI.Tag>
  );
}

// 技能 token 列表容器：viewport 进入后批量 reveal，token 间错峰
// 用于 work-detail/Stack：扁平列表，无分组
export function VoidSkillTokenList({
  items,
  reduced,
  minHeight,
}: {
  items: { name: string; level: SkillLevel }[];
  reduced: boolean;
  minHeight?: number | string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        minHeight,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          alignContent: "flex-start",
          gap: 12,
        }}
      >
        {items.map((it, i) => (
          <VoidSkillToken
            key={it.name}
            name={it.name}
            level={it.level}
            delay={revealed && !reduced ? i * 0.04 : 0}
            revealed={revealed}
            reduced={reduced}
          />
        ))}
      </div>
    </div>
  );
}

// 单个 stratum：用于 about/Constellation
// 左大标题 + 计数 / 右技能 token 列（按等级排序，带 minHeight 保证 PC 端高度一致）
export function VoidStratum({
  label,
  skills,
  levels,
  reduced,
  tokenAreaMinHeight,
}: {
  label: string;
  skills: string[];
  levels: Record<string, SkillLevel>;
  reduced: boolean;
  tokenAreaMinHeight?: number | string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // 按等级权重排序：primary 在前
  const sorted = [...skills].sort(
    (a, b) =>
      LEVEL_META[levels[b] || "familiar"].weight - LEVEL_META[levels[a] || "familiar"].weight,
  );

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "minmax(0, 280px) 1fr",
        gap: "clamp(24px, 4vw, 56px)",
        alignItems: "start",
      }}
      className="portfolio__void-skill-tokens__stratum"
    >
      <div style={{ position: "relative" }}>
        <p
          style={{
            fontFamily: "var(--theme-font-mono)",
            fontSize: 11,
            color: "var(--theme-accent)",
            letterSpacing: "0.4em",
            marginBottom: 14,
          }}
        >
          {String(skills.length).padStart(2, "0")} ENTRIES
        </p>
        <h3
          style={{
            fontFamily: "var(--theme-font-display)",
            fontWeight: 900,
            fontSize: "clamp(28px, 3.6vw, 52px)",
            color: "var(--theme-fg)",
            letterSpacing: "-0.025em",
            lineHeight: 1,
            margin: 0,
          }}
        >
          {label.charAt(0) + label.slice(1).toLowerCase()}
        </h3>
      </div>

      <div
        style={{
          paddingTop: 28,
          borderTop: "1px solid color-mix(in srgb, var(--theme-accent) 22%, transparent)",
          position: "relative",
          minHeight: tokenAreaMinHeight,
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: -4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--theme-accent)",
            boxShadow: "0 0 8px var(--theme-accent)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            alignContent: "flex-start",
            gap: 12,
          }}
        >
          {sorted.map((s, i) => (
            <VoidSkillToken
              key={s}
              name={s}
              level={levels[s] || "familiar"}
              delay={revealed && !reduced ? i * 0.04 : 0}
              revealed={revealed}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
