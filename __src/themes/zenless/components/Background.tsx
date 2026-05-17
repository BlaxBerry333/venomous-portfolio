import type { CSSProperties } from "react";
import "./Background.scss";

// Zenless 档案室背景肌理 —— 从 ZenlessHomeHero / ZenlessAboutExperience 抽离
// 一张 absolute inset:0 的背景层，纹理为细网格 + 椭圆遮罩中央可见、四周渐隐
// 使用方需保证父容器 position: relative
//
// 样式：BEM via Background.scss
//   - block: portfolio__zenless-background

export interface ZenlessBackgroundProps {
  /** 网格单元像素，默认 48 */
  cellSize?: number;
  /** 网格线不透明度档位（百分比），默认 6 */
  lineOpacity?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Background({
  cellSize,
  lineOpacity,
  className,
  style,
}: ZenlessBackgroundProps) {
  const cssVars: Record<string, string> = {};
  if (cellSize !== undefined)
    cssVars["--portfolio__zenless-background--cell-size"] = `${cellSize}px`;
  if (lineOpacity !== undefined)
    cssVars["--portfolio__zenless-background--line-color"] =
      `color-mix(in srgb, var(--theme-fg) ${lineOpacity}%, transparent)`;

  return (
    <div
      aria-hidden
      className={["portfolio__zenless-background", className].filter(Boolean).join(" ")}
      style={{ ...cssVars, ...style } as CSSProperties}
    />
  );
}
