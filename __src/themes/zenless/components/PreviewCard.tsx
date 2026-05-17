import { motion, type HTMLMotionProps, type MotionStyle } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import "./PreviewCard.scss";
import Tag from "./Tag";

// Zenless 任务卡 — works 页"任务情报"卡片同款
// 结构：
//   - 顶部封面（aspectRatio 16/10，可选 blur，底部渐变）
//   - 左上 badge chip（平行四边形）
//   - 文字区：status（icon + label，accent 色，mono）+ 主标题（display uppercase）+ subtitle + 5 段竖条装饰
//
// 样式：BEM via PreviewCard.scss
//   - block:    portfolio__zenless-preview-card
//   - element:  portfolio__zenless-preview-card__{cover,badge,body,status,title,subtitle,skills}
//   - element modifier: __cover--blurred, __title--with-status, __title--clamped

export type ZenlessPreviewCardColor = "orange" | "green" | "purple";

export interface ZenlessPreviewCardStatus {
  label: ReactNode;
}

export interface ZenlessPreviewCardProps
  extends Omit<HTMLMotionProps<"article">, "ref" | "title" | "color"> {
  /** 封面图 URL */
  cover: string;
  /** 主标题 */
  title: ReactNode;
  /** 标题最大行数，超出末行省略号；默认 2；传 0 关闭夹断（任意行展开） */
  titleClamp?: number;
  /** 副标 */
  subtitle?: ReactNode;
  /** 配色档位 */
  color: ZenlessPreviewCardColor;
  /** 左上 badge chip 文字（如 "S" / "A" / "SS"） */
  badge: ReactNode;
  /** 状态行（icon + label，accent 色 mono） */
  status?: ZenlessPreviewCardStatus;
  /** 技术栈 chip（小 outlined Tag 列表）；不传则不渲染 skills 区 */
  skills?: string[];
  /** skills 最多展示几个（超出截断），默认 5 */
  skillsMax?: number;
  /** 是否对封面做 blur + grayscale（NDA 类） */
  blurred?: boolean;
  /** 卡片在列表中的索引（用于入场 stagger 延迟） */
  index?: number;
  /** 关闭默认 hover 上浮动画 */
  disableHover?: boolean;
}

const COLOR_TABLE: Record<ZenlessPreviewCardColor, string> = {
  orange: "#FF6B00",
  green: "var(--theme-accent)",
  purple: "#8B5CF6",
};

export default function PreviewCard({
  cover,
  title,
  titleClamp = 2,
  subtitle,
  color,
  badge,
  status,
  skills,
  skillsMax = 5,
  blurred = false,
  index = 0,
  disableHover = false,
  className,
  style,
  initial,
  whileInView,
  whileHover,
  viewport,
  transition,
  ...motionProps
}: ZenlessPreviewCardProps) {
  const ac = COLOR_TABLE[color];

  const cssVars: Record<string, string> = {
    "--portfolio__zenless-preview-card--ac": ac,
  };

  const coverVars: CSSProperties = {};
  (coverVars as Record<string, string>)["--portfolio__zenless-preview-card__cover--image"] =
    `url(${cover})`;

  const titleVars: CSSProperties = {};
  if (titleClamp > 0)
    (titleVars as Record<string, string>)["--portfolio__zenless-preview-card__title--clamp"] =
      String(titleClamp);

  return (
    <motion.article
      className={["portfolio__zenless-preview-card", className].filter(Boolean).join(" ")}
      initial={initial ?? { opacity: 0, y: 24 }}
      whileInView={whileInView ?? { opacity: 1, y: 0 }}
      whileHover={whileHover ?? (disableHover ? undefined : { y: -6 })}
      viewport={viewport ?? { once: true, amount: 0.2 }}
      transition={
        transition ?? { duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: (index % 6) * 0.04 }
      }
      style={{ ...cssVars, ...style } as MotionStyle}
      {...motionProps}
    >
      {/* 封面 */}
      <div
        className={[
          "portfolio__zenless-preview-card__cover",
          blurred ? "portfolio__zenless-preview-card__cover--blurred" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={coverVars}
      >
        {/* 左上 badge chip — 用 Tag md contained 复用 */}
        <Tag
          size="md"
          variant="contained"
          color={color}
          className="portfolio__zenless-preview-card__badge"
        >
          {badge}
        </Tag>
      </div>

      {/* 文字区 */}
      <div className="portfolio__zenless-preview-card__body">
        {status != null && (
          <span className="portfolio__zenless-preview-card__status">{status.label}</span>
        )}
        <h3
          className={[
            "portfolio__zenless-preview-card__title",
            status != null ? "portfolio__zenless-preview-card__title--with-status" : "",
            titleClamp > 0 ? "portfolio__zenless-preview-card__title--clamped" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={titleVars}
        >
          {title}
        </h3>
        {subtitle != null && (
          <p className="portfolio__zenless-preview-card__subtitle">{subtitle}</p>
        )}

        {/* 技术栈 chip 列表（小 outlined Tag） */}
        {skills && skills.length > 0 && (
          <div className="portfolio__zenless-preview-card__skills">
            {skills.slice(0, skillsMax).map((s) => (
              <Tag key={s} size="sm" variant="outlined" color={color}>
                {s}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
