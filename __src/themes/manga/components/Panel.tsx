import { motion, type HTMLMotionProps, type MotionStyle } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import "./Panel.scss";

// 漫画风分镜框：黑边 + 偏移硬阴影 + 可选网点底
// 视觉为主，逻辑透传 — 入场 / hover / 布局全交给调用方控制 motion props 与 style。
//
// 样式：BEM via Panel.scss
//   - block:    portfolio__manga-panel
//   - element:  portfolio__manga-panel__halftone
export interface MangaPanelProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children?: ReactNode;
  // 边框宽度（px），默认 3
  borderWidth?: number;
  // 阴影偏移量（px），默认 6 → "6px 6px 0 var(--theme-fg)"
  shadowOffset?: number;
  // 是否在内部铺一层网点（manga-ui--halftone），默认 true
  halftone?: boolean;
  // 网点层不透明度，默认 0.18
  halftoneOpacity?: number;
  // 网点层颜色（默认跟随当前文字颜色 currentColor，由 style.color 决定）
  halftoneColor?: string;
}

export default function Panel({
  children,
  borderWidth,
  shadowOffset,
  halftone = true,
  halftoneOpacity,
  halftoneColor,
  style,
  className,
  ...motionProps
}: MangaPanelProps) {
  const cssVars: Record<string, string> = {};
  if (borderWidth !== undefined)
    cssVars["--portfolio__manga-panel--border-width"] = `${borderWidth}px`;
  if (shadowOffset !== undefined)
    cssVars["--portfolio__manga-panel--shadow-offset"] = `${shadowOffset}px`;

  const halftoneVars: Record<string, string> = {};
  if (halftoneOpacity !== undefined)
    halftoneVars["--portfolio__manga-panel__halftone--opacity"] = String(halftoneOpacity);
  if (halftoneColor !== undefined)
    halftoneVars["--portfolio__manga-panel__halftone--color"] = halftoneColor;

  return (
    <motion.div
      className={["portfolio__manga-panel", className].filter(Boolean).join(" ")}
      style={{ ...cssVars, ...style } as MotionStyle}
      {...motionProps}
    >
      {halftone && (
        <div
          aria-hidden
          className="portfolio__manga-panel__halftone"
          style={halftoneVars as CSSProperties}
        />
      )}
      {children}
    </motion.div>
  );
}
