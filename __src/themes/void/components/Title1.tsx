import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import "./Title1.scss";

// Void 风格一档标题 —— 页面级 hero（h1）
// 用于：ComponentsPage / About / Works 三个页面的顶部主标题
//
// 样式：BEM via Title1.scss
//   - block:    portfolio__void-title-1
//   - element:  portfolio__void-title-1__accent

export interface Title1Props {
  text: ReactNode;
  accent?: ReactNode;
  /** 入场动画：'fade-up' = 参考 home hero 的 y:30 fade-up；'none' = 不动画。默认 'none' */
  animate?: "fade-up" | "none";
  style?: CSSProperties;
  className?: string;
}

export default function Title1({ text, accent, animate = "none", style, className }: Title1Props) {
  const reduced = useReducedMotion();
  const motionEnabled = animate === "fade-up" && !reduced;

  const cls = ["portfolio__void-title-1", className].filter(Boolean).join(" ");

  const inner = (
    <>
      {text}
      {accent && <span className="portfolio__void-title-1__accent">{accent}</span>}
    </>
  );

  if (motionEnabled) {
    return (
      <motion.h1
        className={cls}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={style}
      >
        {inner}
      </motion.h1>
    );
  }

  return (
    <h1 className={cls} style={style}>
      {inner}
    </h1>
  );
}
