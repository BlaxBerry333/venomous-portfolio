import { motion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import { TextLabel, TextMuted } from "./Text";
import { Title2, Title3 } from "./Title";
import { alpha, C } from "./tokens";

export type Skill = {
  name: string;
  family: string;
  initial: string; // 2 字大字
};

type SkillCardProps = {
  skill: Skill;
  index: number;
  animate?: boolean;
  // clickable 是总开关：不开启则是纯展示，hover/active/disabled 全部失效
  clickable?: boolean;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
};

// 技能卡：右上序号 (TextLabel) + 左上大字 initial (Title2) + 名称 (Title3) + 分组 (TextMuted)
// 默认是纯展示卡片；clickable=true 时启用 hover/active/disabled 三态
export default function SkillCard({
  skill,
  index,
  animate = true,
  clickable = false,
  active = false,
  disabled = false,
  onClick,
  href,
}: SkillCardProps) {
  const [hover, setHover] = useState(false);
  const isInteractive = clickable && !disabled;
  const showHover = clickable && hover && !disabled;
  const showActive = clickable && active && !disabled;
  const showDisabled = clickable && disabled;

  const borderColor = showActive ? C.accent : showHover ? alpha(C.accent, 0.6) : C.border;
  const background = showActive
    ? alpha(C.accent, 0.1)
    : showHover
      ? alpha(C.accent, 0.06)
      : "rgba(0,0,0,0.6)";

  // active 时整框 accent 外发光 + 内发光，凸显选中
  const boxShadow = showActive
    ? `0 0 0 1px ${C.accent}, 0 0 24px ${alpha(C.accent, 0.35)}, inset 0 0 24px ${alpha(C.accent, 0.08)}`
    : "none";

  const cardStyle: CSSProperties = {
    position: "relative",
    padding: 24,
    border: `1px solid ${borderColor}`,
    background,
    backdropFilter: "blur(2px)",
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minHeight: 180,
    overflow: "hidden",
    transition:
      "border-color 220ms ease, background 220ms ease, transform 220ms ease, opacity 220ms ease, box-shadow 220ms ease",
    transform: showHover ? "translateY(-2px)" : "translateY(0)",
    opacity: showDisabled ? 0.4 : 1,
    cursor: showDisabled ? "not-allowed" : isInteractive ? "pointer" : "default",
    filter: showDisabled ? "saturate(0.4)" : "none",
    boxShadow,
    textDecoration: "none",
    color: "inherit",
    textAlign: "left",
    font: "inherit",
  };

  const children = (
    <>
      <div style={{ position: "absolute", top: 12, right: 14 }}>
        <TextLabel style={{ letterSpacing: "0.2em" }}>
          / {String(index + 1).padStart(2, "0")}
        </TextLabel>
      </div>

      <Title2 as="span" style={{ fontSize: 56, lineHeight: 1, letterSpacing: "-0.02em" }}>
        {skill.initial}
      </Title2>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Title3 as="h3" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.02em" }}>
          {skill.name}
        </Title3>
        <TextMuted style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase" }}>
          {skill.family}
        </TextMuted>
      </div>
    </>
  );

  // motion props（仅在 animate 启用时附加；其它情况是空对象，motion.* 会原样渲染）
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 20 } as const,
        whileInView: { opacity: 1, y: 0 } as const,
        viewport: { once: true, margin: "-10%" } as const,
        transition: { duration: 0.55, delay: index * 0.05 } as const,
      }
    : {};

  const interactionProps = isInteractive
    ? {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
      }
    : {};

  // 渲染策略：clickable + href → motion.a；clickable + (onClick or disabled) → motion.button；否则 motion.div
  if (clickable && href && !disabled) {
    return (
      <motion.a href={href} style={cardStyle} {...motionProps} {...interactionProps}>
        {children}
      </motion.a>
    );
  }
  if (clickable && (onClick || disabled)) {
    return (
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onClick}
        style={cardStyle}
        {...motionProps}
        {...interactionProps}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.div style={cardStyle} {...motionProps}>
      {children}
    </motion.div>
  );
}
