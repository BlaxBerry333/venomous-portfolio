import { motion } from "framer-motion";
import "./index.scss";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TAG_BY_LEVEL = { 1: "h1", 2: "h2", 3: "h3", 4: "h4" } as const;

const MOTION_TAG = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  span: motion.span,
  div: motion.div,
} as const;

type HeadingProps = {
  /** 标题文本；用 {花括号} 包住的段落渲染为 accent（红色） */
  text: string;
  /** 字阶：1 展示级（hero 大字）/ 2 章节级（默认）/ 3 次级 / 4 子标题级 */
  level?: 1 | 2 | 3 | 4;
  /** 覆盖渲染标签 —— span 用于嵌进 <h1>，div 用于纯演示，与文档大纲解耦 */
  as?: "span" | "div";
  /** 纯展示模式：跳过进场动画（design system 等场景用）。 */
  static?: boolean;
};

export default function Heading({ text, level = 2, as, static: isStatic = false }: HeadingProps) {
  const Tag = MOTION_TAG[as ?? TAG_BY_LEVEL[level]];
  const parts = text.split(/(\{[^}]+\})/).filter(Boolean);
  return (
    <Tag
      className={`portfolio--sanguine-heading portfolio--sanguine-heading--${level}`}
      initial={isStatic ? false : { opacity: 0, y: 60 }}
      whileInView={isStatic ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      {parts.map((p, i) =>
        p.startsWith("{") && p.endsWith("}") ? (
          <span key={i} className="portfolio--sanguine-heading__accent">
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </Tag>
  );
}
