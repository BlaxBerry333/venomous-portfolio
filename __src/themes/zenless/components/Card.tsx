import { motion, type HTMLMotionProps, type MotionStyle } from "framer-motion";
import type { ReactNode } from "react";
import "./Card.scss";

// Zenless 风横条信息卡 —— 三槽位（leading / 中三段 / trailing）容器
// 形态锁死：横条 · 左色边 · 中区从上到下 title → description → metric · 左右槽位均可选
//
// API：
//   - color                                    颜色档位，决定左色边 / leading / metric / trailing 的统一着色
//   - leading?: ReactNode                       左侧自定义槽（推荐塞 ZenlessUI.Tag size="md" + 1-2 字符 = 大方块徽章）
//   - title: ReactNode                          主标题（必填，display uppercase）
//   - titleEllipsis?: boolean                   主标题单行省略（…），默认 false 多行换行
//   - description?: ReactNode                   二级描述（body 字号、muted 色，可选）
//   - metric?: { value, label }                 第三段：display 大数字（着色继承 color）+ mono 小标签
//   - trailing?: ReactNode                      右侧自定义槽（推荐塞 ZenlessUI.Bars 或 status chip）
//   - disableHover / active / staggerIndex / titleEllipsis 行为修饰
//
// 样式：BEM via Card.scss
//   - block:    portfolio__zenless-card (+ --no-hover, --active)
//   - element:  portfolio__zenless-card__{leading,body,title,desc,metric,metric-value,metric-label,trailing}
//   - element modifier: __title--ellipsis

export type ZenlessCardColor = "orange" | "green" | "purple";

export interface ZenlessCardMetric {
  value: ReactNode;
  label: ReactNode;
}

export interface ZenlessCardProps
  extends Omit<HTMLMotionProps<"article">, "ref" | "title" | "color"> {
  /** 颜色档位 */
  color: ZenlessCardColor;
  /** 左侧自定义槽（可选） */
  leading?: ReactNode;
  /** 主标题（display uppercase） */
  title: ReactNode;
  /** 主标题单行省略（…）— 默认 false 即多行换行 */
  titleEllipsis?: boolean;
  /** 二级描述（可选，body 字号、muted 色） */
  description?: ReactNode;
  /** 第三段（可选，display 大数字 + mono 小标签，着色继承 color） */
  metric?: ZenlessCardMetric;
  /** 右侧自定义槽（可选） */
  trailing?: ReactNode;
  /** 关闭 hover 视觉反馈 */
  disableHover?: boolean;
  /** 已选中态：常驻呈现 hover 同款视觉 */
  active?: boolean;
  /** 列表 stagger 索引，仅作用于默认 transition.delay */
  staggerIndex?: number;
}

const COLOR_TABLE: Record<ZenlessCardColor, string> = {
  orange: "#FF6B00",
  green: "var(--theme-accent)",
  purple: "#8B5CF6",
};

export default function Card({
  color,
  leading,
  title,
  titleEllipsis = false,
  description,
  metric,
  trailing,
  disableHover = false,
  active = false,
  staggerIndex = 0,
  className,
  style,
  initial,
  whileInView,
  whileHover,
  viewport,
  transition,
  ...motionProps
}: ZenlessCardProps) {
  const ac = COLOR_TABLE[color];

  const cssVars: Record<string, string> = {
    "--portfolio__zenless-card--ac": ac,
  };

  return (
    <motion.article
      className={[
        "portfolio__zenless-card",
        disableHover ? "portfolio__zenless-card--no-hover" : "",
        active ? "portfolio__zenless-card--active" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ...cssVars, ...style } as MotionStyle}
      initial={initial ?? { opacity: 0, y: 16 }}
      whileInView={whileInView ?? { opacity: 1, y: 0 }}
      whileHover={whileHover}
      viewport={viewport ?? { once: true, amount: 0.2 }}
      transition={
        transition ?? {
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
          delay: (staggerIndex % 6) * 0.04,
        }
      }
      {...motionProps}
    >
      {/* 左：leading 槽（可选） */}
      {leading != null && <span className="portfolio__zenless-card__leading">{leading}</span>}

      {/* 中：title → description → metric 三段堆叠 */}
      <div className="portfolio__zenless-card__body">
        <h3
          className={[
            "portfolio__zenless-card__title",
            titleEllipsis ? "portfolio__zenless-card__title--ellipsis" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {title}
        </h3>
        {description != null && <p className="portfolio__zenless-card__desc">{description}</p>}
        {metric != null && (
          <div className="portfolio__zenless-card__metric">
            <span className="portfolio__zenless-card__metric-value">{metric.value}</span>
            <span className="portfolio__zenless-card__metric-label">{metric.label}</span>
          </div>
        )}
      </div>

      {/* 右：trailing 槽（可选） */}
      {trailing != null && <span className="portfolio__zenless-card__trailing">{trailing}</span>}
    </motion.article>
  );
}
