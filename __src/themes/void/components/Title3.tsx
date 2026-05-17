import type { CSSProperties, ReactNode } from "react";
import "./Title3.scss";

// Void 风格三档标题 —— 章节内小标题（h3）
// mono uppercase + accent 横线（位于文本右侧），做更细分的内部层级
//
// 样式：BEM via Title3.scss
//   - block:    portfolio__void-title-3
//   - element:  portfolio__void-title-3__{mark,line}

export interface Title3Props {
  text: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export default function Title3({ text, style, className }: Title3Props) {
  return (
    <h3 className={["portfolio__void-title-3", className].filter(Boolean).join(" ")} style={style}>
      <span aria-hidden className="portfolio__void-title-3__mark">
        ◆
      </span>
      {text}
      <span aria-hidden className="portfolio__void-title-3__line" />
    </h3>
  );
}
