import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import "./Title1.scss";

// Zenless 一档大标题 — works 页 "ALL MISSIONS" 同款
// 结构：① eyebrow（荧光横线 + mono 小字） ② 主文字 h1/h2
// 用途：页面级 / 分区级标题（hero 用 size='page'，section 用默认）
//
// 样式：BEM via Title1.scss
//   - block:    portfolio__zenless-title-1
//   - element:  portfolio__zenless-title-1__{eyebrow-row,line,eyebrow,title,title-accent}

export interface Title1Props {
  /** 顶部 eyebrow 小字（mono 全大写）。例：'MISSION HALL · BRIEFING ROOM' */
  eyebrow: ReactNode;
  /** 主文字 — 字符串或 ReactNode。例：'ALL MISSIONS' / 'About Agent' */
  title: ReactNode;
  /** 主文字尾部高亮分词（用 accent 色）。传 'MISSIONS' 则等价 'ALL <span>MISSIONS</span>' */
  accentTail?: string;
  /** 标签语义：h1 用于页面级、h2 用于分区级，默认 h2 */
  as?: "h1" | "h2";
  /** 主文字字号 clamp，默认 'clamp(48px, 8vw, 120px)'（h2 用）；
   *  传 'page' 自动切换为 'clamp(64px, 10vw, 160px)'（h1 用）；
   *  也可直接传任意 clamp/css */
  size?: "section" | "page" | string;
  /** 容器底部 margin，默认 'var(--space-2xl)' */
  marginBottom?: string;
  /** 入场动画：'sweep' = eyebrow 横线扫入 + 主文字滑入；'none' = 不动画。默认 'none' */
  animate?: "sweep" | "none";
  className?: string;
  style?: CSSProperties;
}

const SIZE_PRESET: Record<"section" | "page", string> = {
  section: "clamp(48px, 8vw, 120px)",
  page: "clamp(64px, 10vw, 160px)",
};

export default function Title1({
  eyebrow,
  title,
  accentTail,
  as = "h2",
  size,
  marginBottom,
  animate = "none",
  className,
  style,
}: Title1Props) {
  const reduced = useReducedMotion();
  const motionEnabled = animate === "sweep" && !reduced;
  const Tag = as;
  const fontSize =
    size === "page" || size === "section" || !size
      ? SIZE_PRESET[(size as "section" | "page") || (as === "h1" ? "page" : "section")]
      : size;

  let titleNode: ReactNode = title;
  if (typeof title === "string" && accentTail) {
    const idx = title.toUpperCase().lastIndexOf(accentTail.toUpperCase());
    if (idx >= 0) {
      const head = title.slice(0, idx);
      const tail = title.slice(idx, idx + accentTail.length);
      const rest = title.slice(idx + accentTail.length);
      titleNode = (
        <>
          {head}
          <span className="portfolio__zenless-title-1__title-accent">{tail}</span>
          {rest}
        </>
      );
    }
  }

  const cssVars: Record<string, string> = {
    "--portfolio__zenless-title-1--font-size": fontSize,
  };
  if (marginBottom !== undefined)
    cssVars["--portfolio__zenless-title-1--margin-bottom"] = marginBottom;

  return (
    <div
      className={["portfolio__zenless-title-1", className].filter(Boolean).join(" ")}
      style={{ ...cssVars, ...style } as CSSProperties}
    >
      <div className="portfolio__zenless-title-1__eyebrow-row">
        {motionEnabled ? (
          <motion.span
            aria-hidden
            className="portfolio__zenless-title-1__line"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <span aria-hidden className="portfolio__zenless-title-1__line" />
        )}
        {motionEnabled ? (
          <motion.p
            className="portfolio__zenless-title-1__eyebrow"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {eyebrow}
          </motion.p>
        ) : (
          <p className="portfolio__zenless-title-1__eyebrow">{eyebrow}</p>
        )}
      </div>

      {motionEnabled ? (
        // motion.h1 / motion.h2 — Tag 是字符串变量，用 motion(Tag) 不行；分支处理
        as === "h1" ? (
          <motion.h1
            className="portfolio__zenless-title-1__title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {titleNode}
          </motion.h1>
        ) : (
          <motion.h2
            className="portfolio__zenless-title-1__title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {titleNode}
          </motion.h2>
        )
      ) : (
        <Tag className="portfolio__zenless-title-1__title">{titleNode}</Tag>
      )}
    </div>
  );
}
