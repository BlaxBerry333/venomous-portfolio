import { clsx } from "@/utils/styles";
import type { CSSProperties, ReactNode } from "react";
import "./index.scss";

interface Props {
  level?: 1 | 2 | 3 | 4;
  /**
   * 限制最大行数：超出省略，并按行数预留高度避免卡片高度抖动。
   * 仅在 level=4（卡片标题档）下推荐使用。
   */
  clamp?: 1 | 2 | 3;
  /**
   * 渲染的 HTML 标签。默认按 level 映射成 h1/h2/h3/h4；
   * 传 "div" 用于纯视觉演示（如 design-system 页），让样式与文档大纲解耦。
   */
  as?: "div";
  style?: CSSProperties;
  children: ReactNode;
}

const TAG_LEVEL = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
} as const;

export default function Heading({ level = 2, clamp, as, style, children }: Props) {
  const Tag = as ?? TAG_LEVEL[level];
  return (
    <Tag
      className={clsx(
        "portfolio--nebula-heading",
        `portfolio--nebula-heading--${level}`,
        clamp && `portfolio--nebula-heading--clamp-${clamp}`,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
