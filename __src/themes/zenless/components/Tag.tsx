import { motion, type HTMLMotionProps, type MotionStyle } from "framer-motion";
import type { ReactNode } from "react";
import "./Tag.scss";

// Zenless 风通用 tag —— 平行四边形切角 + display 大写主文字 + mono 副前缀
//
// 视觉血缘：左上角 badge chip 形态对齐 PreviewCard 左上角徽章
//   - width / height = 52 (md) / 26 (sm)
//   - fontSize: 28 (md) / 14 (sm)
//
// 切角策略：按 height 锁定的像素切角 — round(height × 0.15)，斜面像素恒定不变。
//
// 形态规则：
//   - 默认 1:1 方块：minWidth = height
//   - outlined 真"四面 border"：双层结构，外层 ac 实色 + clipPath，内层 inset 1.5px + bg 填充 + 缩进的 clipPath
//   - contained 单层：实底 + bg 文字
//
// 样式：BEM via Tag.scss
//   - block:    portfolio__zenless-tag (+ --{sm|md}, --{contained|outlined}, --{orange|green|purple})
//   - element:  portfolio__zenless-tag__{fill,content,prefix}
//   - element modifier: __content--single

export type ZenlessTagVariant = "contained" | "outlined";
export type ZenlessTagColor = "orange" | "green" | "purple";
export type ZenlessTagSize = "sm" | "md";

export interface ZenlessTagProps extends Omit<HTMLMotionProps<"span">, "ref" | "prefix" | "color"> {
  children?: ReactNode;
  variant?: ZenlessTagVariant;
  color?: ZenlessTagColor;
  size?: ZenlessTagSize;
  /** 前缀小字（mono 风），例：'▸' / '#' / 'ID#' / 'No.' */
  prefix?: ReactNode;
}

export default function Tag({
  children,
  variant = "outlined",
  color = "orange",
  size = "sm",
  prefix,
  className,
  style,
  ...rest
}: ZenlessTagProps) {
  const isContained = variant === "contained";
  // 单字符（A/S/B/SS 等极短文本）不加 letter-spacing
  const childText = typeof children === "string" ? children.trim() : "";
  const isSingleChar = childText.length === 1 && prefix == null;

  return (
    <motion.span
      className={[
        "portfolio__zenless-tag",
        `portfolio__zenless-tag--${size}`,
        `portfolio__zenless-tag--${variant}`,
        `portfolio__zenless-tag--${color}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style as MotionStyle}
      {...rest}
    >
      {/* outlined 内填充层：缩进 1.5px，bg 染色，clipPath 重画 */}
      {!isContained && <span aria-hidden className="portfolio__zenless-tag__fill" />}
      {/* 主内容层 */}
      <span
        className={[
          "portfolio__zenless-tag__content",
          isSingleChar ? "portfolio__zenless-tag__content--single" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {prefix != null && (
          <span aria-hidden className="portfolio__zenless-tag__prefix">
            {prefix}
          </span>
        )}
        {children}
      </span>
    </motion.span>
  );
}
