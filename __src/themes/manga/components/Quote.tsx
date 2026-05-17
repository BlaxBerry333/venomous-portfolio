import type { CSSProperties, ReactNode } from "react";
import "./Quote.scss";

// 漫画风名言/引言框 — 抽自 MangaAbout 的 blockquote
// - 厚边框 + accent-2 偏移硬阴影
// - 左上贴角章（label，默认 "名言"）
// - 默认轻微旋转 0.6deg（漫画分镜错位感）
// - children 接受任意 ReactNode（文字 / 图片 / Tag / 自定义布局都行）
//
// 样式：BEM via Quote.scss
//   - block:    portfolio__manga-quote
//   - element:  portfolio__manga-quote__stamp
//   - modifier: portfolio__manga-quote--{red|yellow|black|white}
export type QuoteColor = "red" | "yellow" | "black" | "white";

export interface QuoteProps {
  /** 引用主体 — 任意 ReactNode（文字 / 富文本 / 自定义子组件）；不传则空容器 */
  children?: ReactNode;
  /** 左上贴角章。可传字符串或 ReactNode；不传则不显示 */
  label?: ReactNode;
  /** 配色风格：red / yellow / black / white，默认 white */
  color?: QuoteColor;
  /** 整体旋转角，默认 0.6deg */
  rotate?: number;
  /** 阴影颜色 — 不传时按 color 自动选取 */
  shadowColor?: string;
  /** 内容最大宽度，默认 620 */
  maxWidth?: number | string;
  /** 内边距（px），默认 18 */
  padding?: number;
  /** 最小高度（px），不传则随内容 */
  minHeight?: number;
  /** 角章背景色 — 不传走默认 accent */
  labelBg?: string;
  /** 角章文字色 — 不传走默认 fg */
  labelColor?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Quote({
  children,
  label,
  color = "white",
  rotate,
  shadowColor,
  maxWidth,
  padding,
  minHeight,
  labelBg,
  labelColor,
  className,
  style,
}: QuoteProps) {
  const cssVars: Record<string, string> = {};
  if (rotate !== undefined) cssVars["--portfolio__manga-quote--rotate"] = `${rotate}deg`;
  if (padding !== undefined) cssVars["--portfolio__manga-quote--padding"] = `${padding}px`;
  if (maxWidth !== undefined) {
    cssVars["--portfolio__manga-quote--max-width"] =
      typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
  }
  if (minHeight !== undefined) cssVars["--portfolio__manga-quote--min-height"] = `${minHeight}px`;
  if (shadowColor !== undefined) cssVars["--portfolio__manga-quote--shadow"] = shadowColor;
  if (labelBg !== undefined) cssVars["--portfolio__manga-quote__stamp--bg"] = labelBg;
  if (labelColor !== undefined) cssVars["--portfolio__manga-quote__stamp--fg"] = labelColor;

  return (
    <blockquote
      className={["portfolio__manga-quote", `portfolio__manga-quote--${color}`, className]
        .filter(Boolean)
        .join(" ")}
      style={{ ...cssVars, ...style } as CSSProperties}
    >
      {label !== undefined && label !== null && label !== false && (
        <span aria-hidden className="portfolio__manga-quote__stamp">
          {label}
        </span>
      )}
      {children}
    </blockquote>
  );
}
