import type { CSSProperties, ReactNode } from "react";
import "./Title2.scss";

// Zenless 二档章节小标题 — work-detail 的 "PHASE 03 / 09 ▸ Loadout" 同款
// 结构：[PHASE chip / 荧光横线+mono 文本] + [▸ mono label] + [主文字 h2]
//
// 样式：BEM via Title2.scss
//   - block:    portfolio__zenless-title-2
//   - element:  portfolio__zenless-title-2__{chip-row,chip,phase-text,phase-text-line,label,title}

export interface Title2Props {
  /** PHASE 文本，可选。例：'PHASE 03 / 09' / 'BRANCH 02' / '01 / 09'。
   *  若 phase 与 label 都不传则只渲染主文字 h2（用于 PanelFrame 内已有 PHASE 行的位置） */
  phase?: ReactNode;
  /** chip 后的 mono label，例：'Loadout' */
  label?: ReactNode;
  /** 主文字 h2，例：'Loadout' */
  title: ReactNode;
  /** chip 颜色，默认 var(--theme-accent) */
  accentColor?: string;
  /** 主文字尺寸（与 PanelFrame 内 h2 一致），默认 clamp(28px, 4vw, 56px) */
  titleSize?: string;
  /** phase 渲染样式：
   *  - 'chip'（默认）平行四边形彩色 chip
   *  - 'text' 荧光横线 + mono 文本（如 '01/09'），与右侧 ChapterStepper 呼应 */
  phaseStyle?: "chip" | "text";
  className?: string;
  style?: CSSProperties;
}

export default function Title2({
  phase,
  label,
  title,
  accentColor,
  titleSize,
  phaseStyle = "chip",
  className,
  style,
}: Title2Props) {
  const showChipRow = phase != null || label != null;

  const cssVars: Record<string, string> = {};
  if (accentColor !== undefined)
    cssVars["--portfolio__zenless-title-2--accent-color"] = accentColor;
  if (titleSize !== undefined) cssVars["--portfolio__zenless-title-2--title-size"] = titleSize;

  return (
    <div
      className={["portfolio__zenless-title-2", className].filter(Boolean).join(" ")}
      style={{ ...cssVars, ...style } as CSSProperties}
    >
      {showChipRow && (
        <div className="portfolio__zenless-title-2__chip-row">
          {phase != null && phaseStyle === "chip" && (
            <span className="portfolio__zenless-title-2__chip">{phase}</span>
          )}
          {phase != null && phaseStyle === "text" && (
            <span className="portfolio__zenless-title-2__phase-text">
              <span aria-hidden className="portfolio__zenless-title-2__phase-text-line" />
              {phase}
            </span>
          )}
          {label != null && <span className="portfolio__zenless-title-2__label">▸ {label}</span>}
        </div>
      )}

      <h2 className="portfolio__zenless-title-2__title">{title}</h2>
    </div>
  );
}
