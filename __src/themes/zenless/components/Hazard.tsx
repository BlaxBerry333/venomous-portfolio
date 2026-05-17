import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import "./Hazard.scss";

// Zenless 风警戒线 hazard-stripe —— 黑 + 主题色斜纹
// 用于章节切换分隔 / Threats 章节边缘 / NDA 内容遮挡 / Next CTA 上方
//
// 形态：
//   variant="inline"（默认）—— 跟随容器宽度的水平条；带 label 时被切成左右两段
//   variant="stripe" —— Hero 同款全宽斜带：position:absolute / left:-50% / width:200% / rotate
//                       随滚动入场（whileInView：x:±40 → 0），文案可嵌入条内贴左/居中/贴右
//                       使用方需保证父容器 position:relative + overflow:visible（横向 overflow 由 body 兜底）
//
// 样式：BEM via Hazard.scss
//   - block:    portfolio__zenless-hazard (+ --with-label)
//   - element:  portfolio__zenless-hazard__{bar,label}
//   - element modifier: __bar--animated

export type ZenlessHazardColor = "green" | "orange" | "purple" | "warn";
export type ZenlessHazardLabelPosition = "left" | "center" | "right";
export type ZenlessHazardVariant = "inline" | "stripe";

export interface ZenlessHazardProps {
  /** 颜色档位 — 与 Tag/Card 共享色板（warn = 橙色告警语义，独立于 orange 档） */
  color?: ZenlessHazardColor;
  /** 是否流动动画（reduced-motion 自动停） */
  animated?: boolean;
  /** 居中/贴边文字（不传则纯斜纹条） */
  label?: ReactNode;
  /** label 位置 — center 默认，left 贴左，right 贴右 */
  labelPosition?: ZenlessHazardLabelPosition;
  /** 斜纹条厚度，默认 12px；纯条建议 6-12，带 label 建议 8-12；stripe 建议 28-48 */
  height?: number;
  /** 形态变体 — inline 跟容器走 / stripe 全宽斜带（Hero 同款，需父级 position:relative） */
  variant?: ZenlessHazardVariant;
  /** stripe 模式：旋转角度（deg），默认 -8。建议 ±6~12 之间 */
  rotate?: number;
  /** stripe 模式：垂直定位（与父级 relative 容器对齐），默认 "50%"（垂直居中） */
  top?: string | number;
  /** stripe 模式：滚动入场方向（左 / 右滑入），默认 "left" */
  enterFrom?: "left" | "right";
  /** stripe 模式：入场触发时机
   *  - "scroll"（默认）随滚动进入视口触发
   *  - "load" 页面加载即触发（适合首屏 above-the-fold） */
  enterTrigger?: "scroll" | "load";
  /** stripe 模式：覆盖入场动画 transition（duration / delay / ease 等） */
  transition?: Transition;
  className?: string;
  style?: CSSProperties;
}

// 颜色档位 → 斜纹中的彩色条色值（黑色条恒定 #0A0A0A）
const COLOR_TABLE: Record<ZenlessHazardColor, string> = {
  green: "var(--theme-accent)",
  orange: "#FF6B00",
  purple: "#8B5CF6",
  warn: "var(--theme-warn)",
};

export default function Hazard({
  color = "green",
  animated = true,
  label,
  labelPosition = "center",
  height = 12,
  variant = "inline",
  rotate = -8,
  top = "50%",
  enterFrom = "left",
  enterTrigger = "scroll",
  transition,
  className,
  style,
}: ZenlessHazardProps) {
  const ac = COLOR_TABLE[color];
  const reduced = useReducedMotion();

  const barClass = [
    "portfolio__zenless-hazard__bar",
    animated ? "portfolio__zenless-hazard__bar--animated" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const labelEl =
    label != null ? <span className="portfolio__zenless-hazard__label">{label}</span> : null;

  // 内部条/标签布局（两种 variant 共用）
  const inner =
    label == null ? (
      <span className={barClass} style={{ height, width: "100%" }} />
    ) : (
      <>
        {labelPosition === "right" && <span className={barClass} style={{ height }} />}
        {labelPosition === "left" && labelEl}
        {labelPosition === "center" && <span className={barClass} style={{ height }} />}
        {labelPosition === "center" && labelEl}
        {(labelPosition === "left" || labelPosition === "center") && (
          <span className={barClass} style={{ height }} />
        )}
        {labelPosition === "right" && labelEl}
      </>
    );

  const baseClass = [
    "portfolio__zenless-hazard",
    label != null ? "portfolio__zenless-hazard--with-label" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const cssVars: Record<string, string> = {
    "--portfolio__zenless-hazard--ac": ac,
  };

  // —— stripe variant：Hero 同款全宽斜带 ——
  if (variant === "stripe") {
    const dx = enterFrom === "left" ? -60 : 60;
    const motionTriggers =
      enterTrigger === "load"
        ? {
            initial: reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: dx },
            animate: { opacity: 1, x: 0 },
          }
        : {
            initial: reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: dx },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true, amount: 0.3 } as const,
          };
    return (
      <motion.div
        aria-hidden
        className={baseClass}
        {...motionTriggers}
        transition={transition ?? { duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={
          {
            ...cssVars,
            position: "absolute",
            left: "-50%",
            width: "200%",
            top,
            rotate,
            transformOrigin: "center",
            zIndex: 1,
            pointerEvents: "none",
            ...style,
          } as CSSProperties
        }
      >
        {inner}
      </motion.div>
    );
  }

  // —— inline variant（默认）——
  return (
    <div className={baseClass} style={{ ...cssVars, ...style } as CSSProperties} aria-hidden>
      {inner}
    </div>
  );
}
