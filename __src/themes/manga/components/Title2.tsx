import type { CSSProperties, ReactNode } from "react";
import Tag from "./Tag";
import "./Title2.scss";

// 漫画风二档章节标题 — 灵感来自 Work Detail 的 "第 01 話 表紙"
// 结构：[贴纸式章节角标 (MangaUI.Tag)] + [日文/副标签]
// 左右共享同一个 rotate，保持倾斜一致
//
// 样式：BEM via Title2.scss
//   - block:    portfolio__manga-title-2
//   - element:  portfolio__manga-title-2__label
export interface Title2Props {
  // 章节号（如 "01" / "肆"），渲染在贴纸里："第 {num} 話"
  num: ReactNode;
  // 单位字（默认 "話"），可改为 "卷" "章" 等
  unit?: string;
  // 副标签（如 "表紙" "Cover"）
  label?: ReactNode;
  // 贴纸 + 副标共用旋转角，默认 -2deg
  rotate?: number;
  // 自定义贴纸文本（提供时优先于 num/unit）
  stampText?: ReactNode;
  style?: CSSProperties;
}

export default function Title2({ num, unit = "話", label, rotate, stampText, style }: Title2Props) {
  const cssVars: Record<string, string> = {};
  if (rotate !== undefined) cssVars["--portfolio__manga-title-2--rotate"] = `${rotate}deg`;

  // Tag 的 restRotate 仍走 prop（不是 CSS）— 这里保持与 CSS 变量同步
  const stampRotate = rotate ?? -2;

  return (
    <div className="portfolio__manga-title-2" style={{ ...cssVars, ...style } as CSSProperties}>
      <Tag color="black" size="md" restRotate={stampRotate}>
        {stampText ?? (
          <>
            第 {num} {unit}
          </>
        )}
      </Tag>
      {label && <span className="portfolio__manga-title-2__label">{label}</span>}
    </div>
  );
}
