import { LEVEL_META, type SkillLevel } from "@/data/skills";
import { motion } from "framer-motion";
import { useState, type CSSProperties, type ReactNode } from "react";
import "./Tag.scss";

// Void 风格通用 tag —— 视觉来自 about/Constellation 的 SkillToken
// 3 档 variant：primary（实底荧光） / daily（描边发光） / familiar（暗淡描边）
//
// 样式：BEM via Tag.scss（layout / size 基线；hover 视觉由 React state 注入 inline style）
//   - block:    portfolio__void-tag (+ --{xs|sm|md}, --interactive)
//   - element:  portfolio__void-tag__{tooltip,sparks,spark}

export type VoidTagVariant = SkillLevel;
export type VoidTagSize = "xs" | "sm" | "md";

export const VOID_TAG_STYLE: Record<
  VoidTagVariant,
  {
    bg: string;
    border: string;
    color: string;
    glow: string;
    weight: number;
  }
> = {
  primary: {
    bg: "var(--theme-accent)",
    border: "var(--theme-accent)",
    color: "var(--theme-bg)",
    glow: "0 0 18px color-mix(in srgb, var(--theme-accent) 45%, transparent), 0 0 6px color-mix(in srgb, var(--theme-accent) 30%, transparent)",
    weight: 800,
  },
  daily: {
    bg: "color-mix(in srgb, var(--theme-accent) 8%, transparent)",
    border: "var(--theme-accent)",
    color: "var(--theme-accent)",
    glow: "0 0 8px color-mix(in srgb, var(--theme-accent) 20%, transparent)",
    weight: 600,
  },
  familiar: {
    bg: "transparent",
    border: "color-mix(in srgb, var(--theme-fg) 22%, transparent)",
    color: "var(--theme-fg-muted)",
    glow: "none",
    weight: 400,
  },
};

export interface VoidTagProps {
  variant: VoidTagVariant;
  children: ReactNode;
  size?: VoidTagSize;
  // hover 时弹等级 tooltip + 粒子涟漪 + 上浮微动
  interactive?: boolean;
  // 进入视口动画
  delay?: number;
  revealed?: boolean;
  reduced?: boolean;
  showLevelTooltip?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

export default function Tag({
  variant,
  children,
  size = "md",
  interactive = false,
  delay = 0,
  revealed = true,
  reduced = false,
  showLevelTooltip = true,
  className,
  style,
  ariaLabel,
}: VoidTagProps) {
  const [hovered, setHovered] = useState(false);
  const s = VOID_TAG_STYLE[variant];

  return (
    <motion.span
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      animate={
        revealed ? { opacity: 1, y: 0 } : reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
      }
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={interactive ? () => setHovered(true) : undefined}
      onMouseLeave={interactive ? () => setHovered(false) : undefined}
      className={[
        "portfolio__void-tag",
        `portfolio__void-tag--${size}`,
        interactive ? "portfolio__void-tag--interactive" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={ariaLabel}
      style={{
        fontWeight: s.weight,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow:
          interactive && hovered && !reduced
            ? `0 0 24px color-mix(in srgb, var(--theme-accent) 50%, transparent)`
            : s.glow,
        transform: interactive && hovered && !reduced ? "translateY(-3px)" : "translateY(0)",
        ...style,
      }}
    >
      {children}
      {interactive && hovered && showLevelTooltip && (
        <span aria-hidden className="portfolio__void-tag__tooltip">
          {LEVEL_META[variant].label}
        </span>
      )}
      {interactive && hovered && !reduced && <TagSparks />}
    </motion.span>
  );
}

// hover 时 6 颗粒子从中心向外飞散
function TagSparks() {
  const seeds = [0, 1, 2, 3, 4, 5];
  return (
    <span aria-hidden className="portfolio__void-tag__sparks">
      {seeds.map((i) => {
        const angle = (i / seeds.length) * Math.PI * 2;
        const dist = 22 + (i % 2) * 6;
        return (
          <motion.span
            key={i}
            className="portfolio__void-tag__spark"
            initial={{ x: 0, y: 0, opacity: 0.9, scale: 0.6 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.03,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        );
      })}
    </span>
  );
}
