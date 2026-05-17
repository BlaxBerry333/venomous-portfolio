import { clsx } from "@/utils/styles";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import "./index.scss";

type ChipAsButton = {
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

type ChipAsLink = {
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href">;

export type ChipVariant = "solid" | "outline";

type Props = (ChipAsButton | ChipAsLink) & {
  variant?: ChipVariant;
  /**
   * 非交互模式：渲染为 <span> 而非 <button>/<a>。
   * 用于把 Chip 嵌进已经是 <a> 的容器（如整张可点击的卡片）——
   * HTML 不允许嵌套可聚焦元素，static 模式规避这个问题。
   */
  static?: boolean;
  children: ReactNode;
};

export default function Chip({ variant = "solid", static: isStatic, children, ...rest }: Props) {
  const className = clsx(
    "portfolio--nebula-chip",
    `portfolio--nebula-chip--${variant}`,
    isStatic && "portfolio--nebula-chip--static",
  );

  const isLink = !isStatic && "href" in rest && rest.href !== undefined;

  const content = (
    <>
      <span className="portfolio--nebula-chip__label">{children}</span>
      {isLink && (
        <span className="portfolio--nebula-chip__arrow" aria-hidden="true">
          →
        </span>
      )}
    </>
  );

  // 非交互：渲染为 span，不接任何事件 / href 属性
  if (isStatic) {
    return <span className={className}>{content}</span>;
  }

  if (isLink) {
    return (
      <a {...(rest as ChipAsLink)} className={className}>
        {content}
      </a>
    );
  }

  return (
    <button {...(rest as ChipAsButton)} className={className}>
      {content}
    </button>
  );
}
