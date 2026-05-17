import { motion, useReducedMotion } from "framer-motion";
import { forwardRef, type CSSProperties, type ReactNode } from "react";
import "./Button.scss";

// Zenless 风通用按钮 — 抽自 home 页 Skill Tree 切换 chip
// 关键样式：
//   - clipPath 平行四边形 polygon(<skew>px 0, 100% 0, calc(100% - <skew>px) 100%, 0 100%)
//   - 主标签：display 字体、900、letter-spacing 0.15em、uppercase
//   - active：荧光绿底 + 黑字；inactive：elevated 底 + 半透明边
//
// 样式：BEM via Button.scss
//   - block:    portfolio__zenless-button
//   - element:  portfolio__zenless-button__inner
//   - modifier: --{sm|md|lg}, --{contained|outlined|tab}, --active, --disabled,
//               --hoverable, --filled-hoverable

export type ZenlessButtonVariant = "tab" | "contained" | "outlined";
export type ZenlessButtonAnimation = "none" | "nudge" | "pulse";

export interface ZenlessButtonProps {
  children: ReactNode;
  /** tab 是否激活（仅 tab 变体生效） */
  active?: boolean;
  /** contained = 实底（强调按钮）；outlined = 透明描边；tab = home Skill Tree 同款 */
  variant?: ZenlessButtonVariant;
  /** 动画：nudge = 右向循环位移（CTA / continue 用）；pulse = 透明度呼吸 */
  animation?: ZenlessButtonAnimation;
  /** 按钮尺寸 */
  size?: "sm" | "md" | "lg";
  /** 强制最小宽度（覆盖默认） */
  minWidth?: number | string;
  className?: string;
  style?: CSSProperties;
  ariaSelected?: boolean;
  role?: string;
  type?: "button" | "submit" | "reset";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = forwardRef<HTMLElement, ZenlessButtonProps>(function ZenlessButton(
  {
    children,
    active = false,
    variant = "contained",
    animation = "none",
    size = "md",
    minWidth,
    className,
    style,
    ariaSelected,
    role,
    type = "button",
    href,
    onClick,
    disabled,
  },
  ref,
) {
  const reduced = useReducedMotion();

  const isFilled = variant === "contained" || (variant === "tab" && active);
  const hoverable = !disabled && !isFilled;

  const cssVars: Record<string, string> = {};
  if (minWidth !== undefined) {
    cssVars["--portfolio__zenless-button--min-width"] =
      typeof minWidth === "number" ? `${minWidth}px` : minWidth;
  }

  const mergedClassName = [
    "portfolio__zenless-button",
    `portfolio__zenless-button--${size}`,
    `portfolio__zenless-button--${variant}`,
    variant === "tab" && active ? "portfolio__zenless-button--active" : "",
    disabled ? "portfolio__zenless-button--disabled" : "",
    hoverable ? "portfolio__zenless-button--hoverable" : "",
    isFilled && !disabled ? "portfolio__zenless-button--filled-hoverable" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const animateProps = (() => {
    if (reduced || animation === "none") return undefined;
    if (animation === "nudge") {
      return {
        animate: { x: [0, 12, 0] },
        transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" as const },
      };
    }
    if (animation === "pulse") {
      return {
        animate: { opacity: [1, 0.78, 1] },
        transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" as const },
      };
    }
    return undefined;
  })();

  const inner = <span className="portfolio__zenless-button__inner">{children}</span>;

  const mergedStyle = { ...cssVars, ...style } as CSSProperties;

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={mergedClassName}
        style={mergedStyle}
        role={role}
        aria-selected={ariaSelected}
        onClick={onClick}
        {...(animateProps ?? {})}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={mergedClassName}
      style={mergedStyle}
      role={role}
      aria-selected={ariaSelected}
      onClick={onClick}
      disabled={disabled}
      {...(animateProps ?? {})}
    >
      {inner}
    </motion.button>
  );
});

export default Button;
