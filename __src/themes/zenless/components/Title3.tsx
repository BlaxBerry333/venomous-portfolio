import type { CSSProperties, ReactNode } from "react";
import "./Title3.scss";

// Zenless 三档小节标题 — 用于组件页 Block / 内容子区段
// 结构：[主标题 display h3] + [可选 mono 副标 ▸ subtitle] + 底部 accent 分隔线
// 比 Title1（hero/section）与 Title2（chapter w/ phase）更轻：无 eyebrow / 无 phase chip
//
// 样式：BEM via Title3.scss
//   - block:    portfolio__zenless-title-3 (+ --no-divider)
//   - element:  portfolio__zenless-title-3__{text,subtitle}

export interface Title3Props {
  /** 主文字 */
  children: ReactNode;
  /** 副标 (mono 字体小字) */
  subtitle?: ReactNode;
  /** 主标题字号，默认 28 */
  size?: number;
  /** 是否带底部分隔实线，默认 true */
  divider?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Title3({
  children,
  subtitle,
  size,
  divider = true,
  className,
  style,
}: Title3Props) {
  const cssVars: Record<string, string> = {};
  if (size !== undefined) cssVars["--portfolio__zenless-title-3--size"] = `${size}px`;

  return (
    <div
      className={[
        "portfolio__zenless-title-3",
        divider ? "" : "portfolio__zenless-title-3--no-divider",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ...cssVars, ...style } as CSSProperties}
    >
      <h3 className="portfolio__zenless-title-3__text">{children}</h3>
      {subtitle && <span className="portfolio__zenless-title-3__subtitle">▸ {subtitle}</span>}
    </div>
  );
}
