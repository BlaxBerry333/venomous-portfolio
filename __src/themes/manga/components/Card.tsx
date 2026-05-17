import { motion, type HTMLMotionProps, type MotionStyle } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import "./Card.scss";
import { mangaHoverWobble } from "./motionPresets";

// 漫画风分镜卡片：黑边 + 偏移硬阴影 + 右下大字水印 + 可选网点
// 适用于 Skill Codex（home Tech）/ BATTLE HISTORY（about）这类"分镜方块" 列表卡片。
//
// 样式：BEM via Card.scss
//   - block:    portfolio__manga-card (+ --{white|red|yellow|black}, --has-badge)
//   - element:  portfolio__manga-card__{clip,halftone,watermark,prefix,title,subtitle,badge}
//   - element modifier: __title--clamped, __prefix--placeholder, __badge--{top|bottom|red|...}
export type MangaCardColor = "red" | "yellow" | "black" | "white";

// 八卦水印池：罗马音名 → 字符。零语义符号，不和卡片文字内容冲突。
// 作为 Card 模块附带的内置数据对象导出，调用方按需取用：<MangaUI.Card watermark={BAGUA.QIAN} />
export const BAGUA = {
  QIAN: "☰", // 乾 / 天
  DUI: "☱", // 兑 / 泽
  LI: "☲", // 离 / 火
  ZHEN: "☳", // 震 / 雷
  XUN: "☴", // 巽 / 风
  KAN: "☵", // 坎 / 水
  GEN: "☶", // 艮 / 山
  KUN: "☷", // 坤 / 地
} as const;
export type BaguaName = keyof typeof BAGUA;

// Badge 贴纸配置 — 风格参考 about 页面「主人公 / CHEN」双角章
// 默认风格按位置自动选取（top 走红底-8deg 紧贴边角；bottom 走白底+硬阴影+4deg）
export interface MangaCardBadge {
  // 文本内容（也接受任意 ReactNode）
  text: ReactNode;
  // 配色，默认 top→"red" / bottom→"white"
  color?: MangaCardColor;
  // 旋转角（deg），默认 top→-8 / bottom→+4
  rotate?: number;
}

export interface MangaCardProps extends Omit<HTMLMotionProps<"div">, "ref" | "prefix" | "title"> {
  children?: ReactNode;
  color?: MangaCardColor;
  // 边框宽度（px），默认 3
  borderWidth?: number;
  // 阴影偏移（px），默认 6
  shadowOffset?: number;
  // 阴影颜色 — 不传时按 color 自动选取（black 卡 → accent；其余 → fg）
  shadowColor?: string;
  // 内边距（px），默认 14
  padding?: number;
  // 最小高度（px），默认 130
  minHeight?: number;
  // 右下大字水印 — 接受任意字符串/节点；如需八卦字符可使用本模块导出的 BAGUA 数据池：watermark={BAGUA.QIAN}
  watermark?: ReactNode;
  // 水印字号（px），默认 120
  watermarkSize?: number;
  // 水印颜色，默认跟随 accent
  watermarkColor?: string;
  // 水印描边颜色（默认随当前 fg）
  watermarkStrokeColor?: string;
  // 水印描边宽度（px），默认 2
  watermarkStrokeWidth?: number;
  // 水印不透明度，默认 0.6
  watermarkOpacity?: number;
  // 顶部小字（如 "No.01" / "2024" / "2024 - PRESENT"），mono 字体
  prefix?: ReactNode;
  // 标题（display 字体大写）
  title?: ReactNode;
  // 标题字号，默认 22
  titleSize?: number;
  // 标题最大行数，超出末行省略号；默认 2；传 0 关闭夹断（任意行展开）
  titleClamp?: number;
  // 标题下方副文（body 字体）
  subtitle?: ReactNode;
  // 是否铺网点底，默认 false
  halftone?: boolean;
  // 网点不透明度，默认 0.18
  halftoneOpacity?: number;
  // 静止旋转角（deg），默认 0；hover 时会基于此值叠加摇晃
  restRotate?: number;
  // hover 摇晃方向，默认 "auto"（按 restRotate 正负反向）
  hoverDirection?: "auto" | "+" | "-";
  // 关闭默认 hover 动画（如果调用方想完全自定义）
  disableHover?: boolean;
  // 左上角贴纸（"主人公"风格）— 默认红底-8deg 紧贴左上边角
  topBadge?: MangaCardBadge;
  // 右下角贴纸（"CHEN"风格）— 默认白底+硬阴影+4deg
  bottomBadge?: MangaCardBadge;
}

export default function Card({
  children,
  color = "white",
  borderWidth,
  shadowOffset,
  shadowColor,
  padding,
  minHeight,
  watermark,
  watermarkSize,
  watermarkColor,
  watermarkStrokeColor,
  watermarkStrokeWidth,
  watermarkOpacity,
  prefix,
  title,
  titleSize,
  titleClamp = 2,
  subtitle,
  halftone = false,
  halftoneOpacity,
  restRotate = 0,
  hoverDirection = "auto",
  disableHover = false,
  topBadge,
  bottomBadge,
  style,
  className,
  whileHover,
  initial,
  ...motionProps
}: MangaCardProps) {
  const defaultHover = disableHover
    ? undefined
    : mangaHoverWobble(restRotate, { direction: hoverDirection }).whileHover;
  // 给定 rotate 初值，framer hover 才能拿到明确的起点（避免 positionalValues 报错）
  const mergedInitial = initial === undefined ? { rotate: restRotate, scale: 1 } : initial;

  const hasBadge = topBadge != null || bottomBadge != null;

  // 卡片 CSS 变量
  const cardVars: Record<string, string> = {};
  if (borderWidth !== undefined)
    cardVars["--portfolio__manga-card--border-width"] = `${borderWidth}px`;
  if (shadowOffset !== undefined)
    cardVars["--portfolio__manga-card--shadow-offset"] = `${shadowOffset}px`;
  if (shadowColor !== undefined) cardVars["--portfolio__manga-card--shadow"] = shadowColor;
  if (padding !== undefined) cardVars["--portfolio__manga-card--padding"] = `${padding}px`;
  if (minHeight !== undefined) cardVars["--portfolio__manga-card--min-height"] = `${minHeight}px`;

  // halftone 子元素 CSS 变量
  const halftoneStyle: CSSProperties = {};
  if (halftoneOpacity !== undefined)
    (halftoneStyle as Record<string, string>)["--portfolio__manga-card__halftone--opacity"] =
      String(halftoneOpacity);

  // watermark 子元素 CSS 变量
  const wmStyle: CSSProperties = {};
  if (watermarkSize !== undefined)
    (wmStyle as Record<string, string>)["--portfolio__manga-card__watermark--size"] =
      `${watermarkSize}px`;
  if (watermarkStrokeWidth !== undefined)
    (wmStyle as Record<string, string>)["--portfolio__manga-card__watermark--stroke-width"] =
      `${watermarkStrokeWidth}px`;
  if (watermarkOpacity !== undefined)
    (wmStyle as Record<string, string>)["--portfolio__manga-card__watermark--opacity"] =
      String(watermarkOpacity);
  if (watermarkColor !== undefined)
    (wmStyle as Record<string, string>)["--portfolio__manga-card__watermark--color"] =
      watermarkColor;
  if (watermarkStrokeColor !== undefined)
    (wmStyle as Record<string, string>)["--portfolio__manga-card__watermark--stroke-color"] =
      watermarkStrokeColor;

  // title CSS 变量
  const titleStyle: CSSProperties = {};
  if (titleSize !== undefined)
    (titleStyle as Record<string, string>)["--portfolio__manga-card__title--size"] =
      `${titleSize}px`;
  if (titleClamp > 0)
    (titleStyle as Record<string, string>)["--portfolio__manga-card__title--clamp"] =
      String(titleClamp);

  const renderBadge = (b: MangaCardBadge, position: "top" | "bottom") => {
    const badgeColor: MangaCardColor = b.color ?? (position === "top" ? "red" : "white");
    const rotate = b.rotate ?? (position === "top" ? -8 : 4);

    const badgeVars: CSSProperties = {};
    (badgeVars as Record<string, string>)["--portfolio__manga-card__badge--rotate"] =
      `${rotate}deg`;

    return (
      <span
        aria-hidden
        className={[
          "portfolio__manga-card__badge",
          `portfolio__manga-card__badge--${position}`,
          `portfolio__manga-card__badge--${badgeColor}`,
        ].join(" ")}
        style={badgeVars}
      >
        {b.text}
      </span>
    );
  };

  const cardClass = [
    "portfolio__manga-card",
    `portfolio__manga-card--${color}`,
    hasBadge ? "portfolio__manga-card--has-badge" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      className={cardClass}
      style={{ ...cardVars, ...style } as MotionStyle}
      initial={mergedInitial}
      whileHover={whileHover ?? defaultHover}
      {...motionProps}
    >
      {(halftone || watermark != null) && (
        <div aria-hidden className="portfolio__manga-card__clip">
          {halftone && (
            <div aria-hidden className="portfolio__manga-card__halftone" style={halftoneStyle} />
          )}
          {watermark != null && (
            <span aria-hidden className="portfolio__manga-card__watermark" style={wmStyle}>
              {watermark}
            </span>
          )}
        </div>
      )}
      {/* prefix 占位 — title/subtitle/prefix 三者均缺省时（纯容器场景）整段不渲染；
          否则即便 prefix 为 null 也保留占位，避免 grid 中卡片高度/对齐错乱 */}
      {(prefix != null || title != null || subtitle != null) && (
        <p
          className={[
            "portfolio__manga-card__prefix",
            prefix == null ? "portfolio__manga-card__prefix--placeholder" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden={prefix == null ? true : undefined}
        >
          {prefix ?? " "}
        </p>
      )}
      {title != null && (
        <p
          className={[
            "portfolio__manga-card__title",
            titleClamp > 0 ? "portfolio__manga-card__title--clamped" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={titleStyle}
        >
          {title}
        </p>
      )}
      {subtitle != null && <p className="portfolio__manga-card__subtitle">{subtitle}</p>}
      {children}
      {/* badge 跟着 motion.div 一起做 hover 摇晃；卡片 overflow 设为 visible 时不会被裁切 */}
      {topBadge != null && renderBadge(topBadge, "top")}
      {bottomBadge != null && renderBadge(bottomBadge, "bottom")}
    </motion.div>
  );
}
