import type { CSSProperties, ReactNode } from "react";
import "./Title2.scss";

// Void 风格二档标题 —— 分区主标题（h2）
// 固定形态：eyebrow（mono uppercase 引导线，§-编号）+ 主标题
// 用于：home Featured/Tech、about Trajectory/Constellation、work-detail §02–§08
//
// 样式：BEM via Title2.scss
//   - block:    portfolio__void-title-2
//   - element:  portfolio__void-title-2__{eyebrow,text,accent}

export interface Title2Props {
  text: ReactNode;
  accent?: ReactNode;
  eyebrow?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export default function Title2({ text, accent, eyebrow, style, className }: Title2Props) {
  const wrapperClass = ["portfolio__void-title-2", className].filter(Boolean).join(" ");

  return (
    <div className={wrapperClass} style={style}>
      {eyebrow && <p className="portfolio__void-title-2__eyebrow">{eyebrow}</p>}
      <h2 className="portfolio__void-title-2__text">
        {text}
        {accent && <span className="portfolio__void-title-2__accent">{accent}</span>}
      </h2>
    </div>
  );
}
