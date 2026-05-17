import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import Card, { type MangaCardBadge } from "./Card";
import "./Timeline.scss";

// 漫画风纵向时间线
// PC 布局：[date 贴纸] | spine | [内容卡............]
// 移动端布局：date 贴纸下沉到 card 正上方（inline），spine 收窄到 left:19
//
// 内容卡基于 MangaUI.Card 做容器，date / card 的 rotate 跨断点保持。
//
// 样式：BEM via Timeline.scss
//   - block:    portfolio__manga-timeline
//   - element:  portfolio__manga-timeline__{list,spine,row,date,cardwrap}
export interface MangaTimelineItem {
  /** 时间标签（如 "2024" / "2024/12/12" / "2024 — NOW"） */
  date: string;
  /** 主标题 */
  title: ReactNode;
  /** 副标题（可选） */
  caption?: ReactNode;
  /** 卡片右下贴纸（如 "NOW"），透传到 MangaUI.Card 的 bottomBadge */
  bottomBadge?: MangaCardBadge;
  /** 卡片左上贴纸，透传到 MangaUI.Card 的 topBadge */
  topBadge?: MangaCardBadge;
}

export interface MangaTimelineProps {
  items: MangaTimelineItem[];
  /** 内容卡最大宽度（px），避免内容少时空白过大。默认 640 */
  maxCardWidth?: number;
  /** row 之间的间距（px），默认 56 */
  gap?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Timeline({
  items,
  maxCardWidth,
  gap,
  className,
  style,
}: MangaTimelineProps) {
  const reduced = useReducedMotion();

  const cssVars: Record<string, string> = {};
  if (gap !== undefined) cssVars["--portfolio__manga-timeline--gap"] = `${gap}px`;

  const cardwrapVars: CSSProperties = {};
  if (maxCardWidth !== undefined) {
    (cardwrapVars as Record<string, string>)["--portfolio__manga-timeline__cardwrap--max-width"] =
      `${maxCardWidth}px`;
  }

  return (
    <div
      className={["portfolio__manga-timeline", className].filter(Boolean).join(" ")}
      style={{ ...cssVars, ...style } as CSSProperties}
    >
      <span aria-hidden className="portfolio__manga-timeline__spine" />

      <div className="portfolio__manga-timeline__list">
        {items.map((it, i) => {
          const cardRot = i % 2 === 0 ? -1 : 1;
          const dateRot = i % 2 === 0 ? -2 : 2;
          // bottomBadge 默认走红色，醒目（如 "NOW"）；调用方可在 item 上覆写
          const bottomBadge = it.bottomBadge
            ? { color: "red" as const, ...it.bottomBadge }
            : undefined;

          const dateStyle: CSSProperties = {};
          (dateStyle as Record<string, string>)["--portfolio__manga-timeline__date--rotate"] =
            `${dateRot}deg`;

          return (
            <motion.div
              key={`${it.date}-${i}`}
              initial={reduced ? false : { opacity: 0, x: 24 }}
              whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="portfolio__manga-timeline__row"
            >
              <span aria-hidden className="portfolio__manga-timeline__date" style={dateStyle}>
                {it.date}
              </span>

              <div className="portfolio__manga-timeline__cardwrap" style={cardwrapVars}>
                <Card
                  color="white"
                  halftone
                  halftoneOpacity={0.18}
                  restRotate={cardRot}
                  shadowOffset={8}
                  borderWidth={4}
                  padding={20}
                  minHeight={0}
                  title={it.title}
                  titleSize={26}
                  titleClamp={0}
                  topBadge={it.topBadge}
                  bottomBadge={bottomBadge}
                  subtitle={
                    it.caption ? (
                      <span
                        style={{
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        ▸ {it.caption}
                      </span>
                    ) : undefined
                  }
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
