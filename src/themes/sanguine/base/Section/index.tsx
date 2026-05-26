import type { ReactNode } from "react";
import Heading from "../Heading";
import Text from "../Text";
import "./index.scss";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Props {
  /** 锚点 id，挂在 <section> 上（如 "timeline"） */
  id?: string;
  /**
   * 纵向留白档位。
   *   - normal（默认）：120 / 160px —— home / about / works 等主内容页
   *   - compact：80 / 120px —— work-detail 这类多区块连排的页
   */
  size?: "normal" | "compact";
  /**
   * 标题块小字 —— 碑铭式斜体小标（如 "— 01 / 02 —"）。
   * 传了就在 Heading 上方渲染。
   */
  titleLabel?: string;
  /**
   * 区块主标题文本。用 {花括号} 包住的段落渲染为 accent（红色）。
   * 传了就内联渲染整个标题块（label + Heading + description）。
   */
  title?: string;
  /** 标题语义级别，透传给 Heading。默认 2。 */
  titleLevel?: 1 | 2 | 3 | 4;
  /**
   * 标题块下方的说明文字，单段或多段。
   * 走 body 字阶，带统一的 whileInView 进场。
   */
  description?: string | string[];
  /**
   * 内容出血：children 横向跑满区块整宽（标题块仍限宽）。
   * 用于 marquee 这类需贯穿视口的内容。
   */
  contentBleed?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * sanguine 页面区块的布局壳。
 * 负责容器规范（限宽 / padding / 留白档位 / 锚点）+ 可选的内联标题块。
 *   - 传 titleLabel / title / description → 渲染 __head 标题块
 *   - children → 区块主体内容
 */
export default function Section({
  id,
  size = "normal",
  titleLabel,
  title,
  titleLevel = 2,
  description,
  contentBleed = false,
  className,
  children,
}: Props) {
  const cls = [
    "portfolio--sanguine-section",
    `portfolio--sanguine-section--${size}`,
    contentBleed && "portfolio--sanguine-section--bleed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // description 归一为数组，单段 / 多段统一处理
  const descLines =
    description == null ? [] : Array.isArray(description) ? description : [description];

  return (
    <section id={id} className={cls}>
      {title && (
        <div className="portfolio--sanguine-section__head">
          {titleLabel && <span className="portfolio--sanguine-section__label">{titleLabel}</span>}
          <Heading level={titleLevel} text={title} />
          {descLines.length > 0 && (
            <div className="portfolio--sanguine-section__desc">
              {descLines.map((line, i) => (
                <Text
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: EASE }}
                >
                  {line}
                </Text>
              ))}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
