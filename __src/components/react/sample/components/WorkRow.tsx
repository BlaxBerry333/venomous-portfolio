import { motion } from "framer-motion";
import { useState } from "react";
import Tag from "./Tag";
import { Title2 } from "./Title";
import { alpha, C, FONT_DISPLAY, FONT_MONO, TextGlow1, TextGlow2 } from "./tokens";

export type Work = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  impact: string;
  href?: string;
};

// 作品行：序号 / 主标 + 副标 + tags / impact + 箭头
// hover 时背景 cyan tint、标题切换为 strong glow、箭头右移
export default function WorkRow({
  work,
  index,
  animate = true,
}: {
  work: Work;
  index: number;
  animate?: boolean;
}) {
  const [hover, setHover] = useState(false);

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "80px 1fr auto",
    alignItems: "center",
    gap: 32,
    padding: "32px 0",
    borderTop: `1px solid ${C.borderSoft}`,
    color: C.fg,
    textDecoration: "none",
    cursor: "pointer",
    position: "relative" as const,
    transition: "background 280ms ease",
    background: hover ? alpha(C.accent, 0.06) : "transparent",
  };

  const content = (
    <>
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 12,
          color: C.accent,
          letterSpacing: "0.25em",
          textShadow: hover ? `0 0 12px ${C.accent}` : `0 0 6px ${C.accent}`,
        }}
      >
        / {work.id}
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Title2
          as="h3"
          style={{
            fontSize: "clamp(28px, 4vw, 52px)",
            letterSpacing: "0.02em",
            transition: "text-shadow 200ms",
            // hover 时升级到 Title1 的厚重辉光；idle 时用 Title2 自身
            textShadow: hover ? TextGlow1 : TextGlow2,
          }}
        >
          {work.title}
        </Title2>
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            color: C.muted,
            fontFamily: FONT_DISPLAY,
            fontSize: 14,
            letterSpacing: "0.04em",
            flexWrap: "wrap",
          }}
        >
          <span>{work.subtitle}</span>
          <span style={{ color: C.borderSoft }}>·</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {work.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: FONT_MONO,
          fontSize: 11,
          color: C.accent,
          letterSpacing: "0.2em",
          whiteSpace: "nowrap",
          textShadow: `0 0 10px ${C.accent}`,
        }}
      >
        <span>{work.impact}</span>
        <motion.span
          animate={{ x: hover ? 8 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            display: "inline-block",
            fontSize: 18,
            color: C.accent,
            textShadow: `0 0 8px ${C.accent}`,
          }}
        >
          →
        </motion.span>
      </div>
    </>
  );

  if (animate) {
    return (
      <motion.a
        href={work.href ?? "#"}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        style={rowStyle}
      >
        {content}
      </motion.a>
    );
  }
  return (
    <a
      href={work.href ?? "#"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={rowStyle}
    >
      {content}
    </a>
  );
}
