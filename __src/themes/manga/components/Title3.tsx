import type { CSSProperties, ReactNode } from "react";
import "./Title3.scss";

// 漫画风三档小节标题 — 用于组件页 Block / 内容子区段
// 结构：[主标题(display)] + [可选 mono 副标] + 底部硬实线（独立元素，固定显示且 100% 充满父容器）
// 比 Hero(一档) 与 Chapter(二档) 更轻：无贴纸 / 无硬阴影 / 无旋转
//
// 样式：BEM via Title3.scss
//   - block:    portfolio__manga-title-3
//   - element:  portfolio__manga-title-3__{row,text,subtitle,divider}
export interface Title3Props {
  // 主标题
  children: ReactNode;
  // 副标 (mono 字体小字)
  subtitle?: ReactNode;
  // 主标题字号，默认 28
  size?: number;
  // 底部分隔线颜色，默认与标题文本同色 (--theme-fg)
  dividerColor?: string;
  style?: CSSProperties;
}

export default function Title3({ children, subtitle, size, dividerColor, style }: Title3Props) {
  const cssVars: Record<string, string> = {};
  if (size !== undefined) cssVars["--portfolio__manga-title-3--size"] = `${size}px`;
  if (dividerColor !== undefined)
    cssVars["--portfolio__manga-title-3--divider-color"] = dividerColor;

  return (
    <div className="portfolio__manga-title-3" style={{ ...cssVars, ...style } as CSSProperties}>
      <div className="portfolio__manga-title-3__row">
        <h3 className="portfolio__manga-title-3__text">{children}</h3>
        {subtitle && <span className="portfolio__manga-title-3__subtitle">{subtitle}</span>}
      </div>
      <div aria-hidden className="portfolio__manga-title-3__divider" />
    </div>
  );
}
