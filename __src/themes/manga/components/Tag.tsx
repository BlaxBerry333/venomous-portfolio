import { motion, type HTMLMotionProps, type MotionStyle } from "framer-motion";
import type { ReactNode } from "react";
import "./Tag.scss";

// 漫画风标签：紧凑、轻微旋转、薄边 + 小阴影
// 用于章节角标、技能词条、状态徽章
//
// 样式：BEM via Tag.scss
//   - block:    portfolio__manga-tag
//   - element:  portfolio__manga-tag__prefix
//   - modifier: portfolio__manga-tag--{xs|sm|md}, portfolio__manga-tag--{red|yellow|black|white}
export type MangaTagColor = "red" | "yellow" | "black" | "white";
export type MangaTagSize = "xs" | "sm" | "md";

export interface MangaTagProps extends Omit<HTMLMotionProps<"span">, "ref" | "prefix"> {
  children?: ReactNode;
  color?: MangaTagColor;
  size?: MangaTagSize;
  restRotate?: number;
  // 前缀符号（如 "#" "★" "No.01"）
  prefix?: ReactNode;
}

export default function Tag({
  children,
  color = "white",
  size = "sm",
  restRotate,
  prefix,
  style,
  className,
  ...rest
}: MangaTagProps) {
  const cssVars: Record<string, string> = {};
  if (restRotate !== undefined) cssVars["--portfolio__manga-tag--rotate"] = `${restRotate}deg`;

  return (
    <motion.span
      initial={false}
      whileHover={{
        scale: 1.05,
        transition: { type: "spring", stiffness: 320, damping: 14 },
      }}
      className={[
        "portfolio__manga-tag",
        `portfolio__manga-tag--${size}`,
        `portfolio__manga-tag--${color}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ...cssVars, ...style } as MotionStyle}
      {...rest}
    >
      {prefix && (
        <span aria-hidden className="portfolio__manga-tag__prefix">
          {prefix}
        </span>
      )}
      {children}
    </motion.span>
  );
}
