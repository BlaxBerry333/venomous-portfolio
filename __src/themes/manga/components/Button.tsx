import { motion, type HTMLMotionProps, type MotionStyle } from "framer-motion";
import type { ReactNode } from "react";
import "./Button.scss";

// 漫画风按钮：黑边 + 偏移硬阴影 + 大写 display 字体
// hover：阴影回收 + 微微下沉（像被按下去了）
// active：阴影完全消失 + 平移到位
//
// 样式：BEM via Button.scss
//   - block:    portfolio__manga-button
//   - element:  portfolio__manga-button__badge
//   - modifier: portfolio__manga-button--{sm|md|lg}, portfolio__manga-button--{red|yellow|black|white}
export type MangaButtonColor = "red" | "yellow" | "black" | "white";
export type MangaButtonSize = "sm" | "md" | "lg";

export interface MangaButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children?: ReactNode;
  // 配色：red=accent / yellow=accent-2 / black=solid / white=ghost
  color?: MangaButtonColor;
  size?: MangaButtonSize;
  // 静止旋转角，配合错位排版用
  restRotate?: number;
  // 阴影偏移，默认按 size 推导
  shadowOffset?: number;
  // 装饰性拟声角标（如 "BAM!" "ドン"），渲染在右上
  badge?: string;
}

// hover/tap motion 位移幅度按 size 推导（与 size modifier 的 --offset 保持一致）
const SIZE_OFFSET: Record<MangaButtonSize, number> = {
  sm: 4,
  md: 6,
  lg: 8,
};

export default function Button({
  children,
  color = "black",
  size = "md",
  restRotate,
  shadowOffset,
  badge,
  style,
  className,
  ...rest
}: MangaButtonProps) {
  const offset = shadowOffset ?? SIZE_OFFSET[size];

  const cssVars: Record<string, string> = {};
  if (restRotate !== undefined) cssVars["--portfolio__manga-button--rotate"] = `${restRotate}deg`;
  if (shadowOffset !== undefined)
    cssVars["--portfolio__manga-button--offset"] = `${shadowOffset}px`;

  return (
    <motion.button
      initial={false}
      whileHover={{
        x: offset / 2,
        y: offset / 2,
        transition: { type: "spring", stiffness: 380, damping: 18 },
      }}
      whileTap={{
        x: offset,
        y: offset,
        transition: { type: "spring", stiffness: 500, damping: 22 },
      }}
      className={[
        "portfolio__manga-button",
        `portfolio__manga-button--${size}`,
        `portfolio__manga-button--${color}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ...cssVars, ...style } as MotionStyle}
      {...rest}
    >
      {children}
      {badge && (
        <span aria-hidden className="portfolio__manga-button__badge">
          {badge}
        </span>
      )}
    </motion.button>
  );
}
