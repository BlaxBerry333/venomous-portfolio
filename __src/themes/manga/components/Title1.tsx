import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import Tag, { type MangaTagColor, type MangaTagSize } from "./Tag";
import "./Title1.scss";

// 漫画风一档大标题 — 灵感来自 Works 页 "Works!!"
// - 顶部贴纸式角标（复用 MangaUI.Tag，黑底 -2deg）
// - 主标题 display 字体 + accent 偏移硬阴影
// - 入场动画：滚动进入视口时触发一次（whileInView + once），
//   主标题先弹入，eyebrow 随后；弹性参考 hero（stiffness 220 / damping 9），但起始 scale 不归零
//
// 样式：BEM via Title1.scss
//   - block:    portfolio__manga-title-1
//   - element:  portfolio__manga-title-1__text (+ --static modifier 仅用于无 motion 形态)
export interface Title1Props {
  // 上方贴纸文字（如 "全卷揃! BOOK SHELF"）
  eyebrow?: ReactNode;
  // 主标题
  children: ReactNode;
  // 主标题旋转角，默认 -2deg（与 eyebrow 贴纸一致）
  rotate?: number;
  // 阴影颜色，默认 var(--theme-accent)
  shadowColor?: string;
  // eyebrow Tag 颜色，默认 "black"（黑底亮黄字）
  eyebrowColor?: MangaTagColor;
  // eyebrow Tag 大小，默认 "md"
  eyebrowSize?: MangaTagSize;
  // 入场动画：'spring' = 滚动进入视口触发一次；'none' = 不动画。默认 'none'
  animate?: "spring" | "none";
  style?: CSSProperties;
}

const TITLE_SPRING = { type: "spring" as const, stiffness: 220, damping: 9 };
// eyebrow 收得更紧一点，避免在主标题落定前就过冲
const EYEBROW_SPRING = { type: "spring" as const, stiffness: 240, damping: 14 };

export default function Title1({
  eyebrow,
  children,
  rotate = -2,
  shadowColor,
  eyebrowColor = "black",
  eyebrowSize = "md",
  animate = "none",
  style,
}: Title1Props) {
  const reduced = useReducedMotion();
  const motionEnabled = animate === "spring" && !reduced;

  const cssVars: Record<string, string> = {
    "--portfolio__manga-title-1--rotate": `${rotate}deg`,
  };
  if (shadowColor !== undefined) cssVars["--portfolio__manga-title-1--shadow-color"] = shadowColor;

  // eyebrow 与 Title 共享同一个倾角
  const eyebrowRotate = rotate;

  if (motionEnabled) {
    return (
      <div className="portfolio__manga-title-1" style={{ ...cssVars, ...style } as CSSProperties}>
        {eyebrow && (
          <Tag
            color={eyebrowColor}
            size={eyebrowSize}
            restRotate={eyebrowRotate}
            initial={{ opacity: 0, scale: 0.85, y: -6, rotate: eyebrowRotate }}
            whileInView={{ opacity: 1, scale: 1, y: 0, rotate: eyebrowRotate }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ ...EYEBROW_SPRING, delay: 0.18 }}
          >
            {eyebrow}
          </Tag>
        )}
        <motion.h1
          className="portfolio__manga-title-1__text"
          initial={{ opacity: 0, scale: 0.7, rotate: rotate }}
          whileInView={{ opacity: 1, scale: 1, rotate: rotate }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ ...TITLE_SPRING, delay: 0 }}
        >
          {children}
        </motion.h1>
      </div>
    );
  }

  return (
    <div className="portfolio__manga-title-1" style={{ ...cssVars, ...style } as CSSProperties}>
      {eyebrow && (
        <Tag color={eyebrowColor} size={eyebrowSize} restRotate={eyebrowRotate}>
          {eyebrow}
        </Tag>
      )}
      <h1 className="portfolio__manga-title-1__text portfolio__manga-title-1__text--static">
        {children}
      </h1>
    </div>
  );
}
