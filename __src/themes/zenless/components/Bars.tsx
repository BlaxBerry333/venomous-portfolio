import type { CSSProperties } from "react";
import "./Bars.scss";

// Zenless 风 N 段竖条装饰 —— 从原 Card 右侧抽离
// 纯视觉，非进度条；用于"等级 / 频谱 / 信号强度"暗示
// 颜色三档与 Card / Tag / TaskItem 对齐（orange / green / purple）
//
// 样式：BEM via Bars.scss
//   - block:    portfolio__zenless-bars (+ --{orange|green|purple})
//   - element:  portfolio__zenless-bars__item

export type ZenlessBarsColor = "orange" | "green" | "purple";

export interface ZenlessBarsProps {
  color?: ZenlessBarsColor;
  /** 段数，默认 5 */
  count?: number;
  /** 单条宽度 px，默认 4 */
  barWidth?: number;
  /** 段间距 px，默认 3 */
  gap?: number;
  /** 高度 px，默认 28 */
  height?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Bars({
  color = "green",
  count = 5,
  barWidth,
  gap,
  height,
  className,
  style,
}: ZenlessBarsProps) {
  const cssVars: Record<string, string> = {};
  if (gap !== undefined) cssVars["--portfolio__zenless-bars--gap"] = `${gap}px`;
  if (height !== undefined) cssVars["--portfolio__zenless-bars--height"] = `${height}px`;

  const itemStyle: CSSProperties = {};
  if (barWidth !== undefined)
    (itemStyle as Record<string, string>)["--portfolio__zenless-bars__item--width"] =
      `${barWidth}px`;

  return (
    <span
      aria-hidden
      className={["portfolio__zenless-bars", `portfolio__zenless-bars--${color}`, className]
        .filter(Boolean)
        .join(" ")}
      style={{ ...cssVars, ...style } as CSSProperties}
    >
      {Array.from({ length: count }).map((_, j) => (
        <span key={j} className="portfolio__zenless-bars__item" style={itemStyle} />
      ))}
    </span>
  );
}
