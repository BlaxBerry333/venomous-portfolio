import type { CSSProperties, ReactNode } from "react";
import "./Card.scss";

// Void 风 Card —— 3 个 variant 共用一个组件
//
// variant：
//   info-row   单行带 ◆ mono label + 主文，左侧色边（独立小卡）
//   list-item  横长 list item：leading + title/desc + trailing（Mobile dialog 候选）
//   slab       方块卡：顶部 leading + 主标 + desc + footer
//              传 rows 时切换为 "多行 ◆ label + value" 形态（行间分隔线）
//
// 槽位（按 variant 渲染所需的子集）：
//   label / title / desc / leading / trailing / footer / rows / children
//
// 样式：BEM via Card.scss
//   - block:    portfolio__void-card
//   - element:  portfolio__void-card__{label,title,desc,leading,trailing,footer,rows,row,row-label,row-value}
//   - variant modifier:  --{info-row|list-item|slab}
//   - color modifier:    --color-{accent|accent-2|success|warn}
//   - state modifier:    --active, --hoverable

export type VoidCardVariant = "info-row" | "list-item" | "slab";
export type VoidCardColor = "accent" | "accent-2" | "success" | "warn";

/** slab variant 的多行条目：label + value 直接铺在 slab 里，行间细横线分隔 */
export interface VoidCardRow {
  label: ReactNode;
  value: ReactNode;
  /** 该行 ◆ 颜色档（默认跟随 card 的 color） */
  color?: VoidCardColor;
}

export interface VoidCardProps {
  variant: VoidCardVariant;
  color?: VoidCardColor;
  /** 选中态（常驻 hover 视觉，hover 时仍叠加） */
  active?: boolean;
  /** 启用 hover 反馈（默认 false：纯展示卡）*/
  hoverable?: boolean;
  /** ◆ mono 小字 label（info-row / panel / slab 使用） */
  label?: ReactNode;
  /** 主标题（info-row 行内文 / list-item 第二列首行 / slab 大字） */
  title?: ReactNode;
  /** 描述（list-item / slab） */
  desc?: ReactNode;
  /** 左侧槽（list-item icon 字符 / slab 顶部 meta） */
  leading?: ReactNode;
  /** 右侧槽（list-item 箭头 / 状态） */
  trailing?: ReactNode;
  /** 底部槽（slab 状态行） */
  footer?: ReactNode;
  /** slab variant：传入后切换为 "多行 ◆ label + value" 形态（行间分隔线） */
  rows?: VoidCardRow[];
  /** 在 variant 末尾追加自定义节点 */
  children?: ReactNode;
  /** 如传 href 则渲染为 <a>（list-item 常用） */
  href?: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

export default function VoidCard({
  variant,
  color = "accent",
  active = false,
  hoverable = false,
  label,
  title,
  desc,
  leading,
  trailing,
  footer,
  rows,
  children,
  href,
  onClick,
  className,
  style,
  ariaLabel,
}: VoidCardProps) {
  const classes = [
    "portfolio__void-card",
    `portfolio__void-card--${variant}`,
    `portfolio__void-card--color-${color}`,
    active ? "portfolio__void-card--active" : "",
    hoverable ? "portfolio__void-card--hoverable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 根据 variant 渲染槽位 — 不传的槽不输出，避免空标签
  const renderSlots = () => {
    if (variant === "info-row") {
      return (
        <>
          {label != null && <span className="portfolio__void-card__label">{label}</span>}
          {title != null && <p className="portfolio__void-card__title">{title}</p>}
          {children}
        </>
      );
    }

    if (variant === "list-item") {
      return (
        <>
          {leading != null && (
            <span aria-hidden className="portfolio__void-card__leading">
              {leading}
            </span>
          )}
          {(title != null || desc != null) && (
            <div className="portfolio__void-card__body">
              {title != null && <p className="portfolio__void-card__title">{title}</p>}
              {desc != null && <p className="portfolio__void-card__desc">{desc}</p>}
            </div>
          )}
          {trailing != null && <span className="portfolio__void-card__trailing">{trailing}</span>}
          {children}
        </>
      );
    }

    // slab —— 传 rows 时切换为多行 label/value 形态（行间分隔线）；否则常规 title+desc 卡
    const hasRows = rows && rows.length > 0;
    return (
      <>
        {leading != null && <div className="portfolio__void-card__leading">{leading}</div>}
        {label != null && <span className="portfolio__void-card__label">{label}</span>}
        {title != null && <p className="portfolio__void-card__title">{title}</p>}
        {desc != null && <p className="portfolio__void-card__desc">{desc}</p>}
        {hasRows && (
          <div className="portfolio__void-card__rows">
            {rows!.map((row, i) => {
              const rowStyle = row.color
                ? ({
                    ["--portfolio__void-card__row--ac" as never]: `var(--theme-${
                      row.color === "accent"
                        ? "accent"
                        : row.color === "accent-2"
                          ? "accent-2"
                          : row.color === "success"
                            ? "success"
                            : "warn"
                    })`,
                  } as CSSProperties)
                : undefined;
              return (
                <div key={i} className="portfolio__void-card__row" style={rowStyle}>
                  <span className="portfolio__void-card__row-label">{row.label}</span>
                  <p className="portfolio__void-card__row-value">{row.value}</p>
                </div>
              );
            })}
          </div>
        )}
        {children}
        {footer != null && <div className="portfolio__void-card__footer">{footer}</div>}
      </>
    );
  };

  if (href) {
    return (
      <a className={classes} style={style} href={href} onClick={onClick} aria-label={ariaLabel}>
        {renderSlots()}
      </a>
    );
  }

  return (
    <div className={classes} style={style} onClick={onClick} aria-label={ariaLabel}>
      {renderSlots()}
    </div>
  );
}
