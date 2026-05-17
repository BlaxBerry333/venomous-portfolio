import { useState, type CSSProperties, type ReactNode } from "react";
import "./Button.scss";
import { VOID_TAG_STYLE } from "./Tag";

// Void 风格按钮 —— 视觉与 about/Constellation 的 SkillToken 一致
// variant: contained（实底荧光） / outlined（描边发光）
// 渲染为 <button> 或 <a>（传 href 时）
//
// 样式：BEM via Button.scss（仅 layout 基线；hover 视觉走 React state 注入 inline style）
//   - block:    portfolio__void-button (+ --disabled)

export type VoidButtonVariant = "contained" | "outlined";

export interface VoidButtonProps {
  variant?: VoidButtonVariant;
  // 链接：传则渲染 <a>
  href?: string;
  target?: string;
  rel?: string;
  // 按钮：默认渲染 <button>
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  role?: string;
  ariaSelected?: boolean;
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function Button({
  variant = "outlined",
  href,
  target,
  rel,
  onClick,
  type = "button",
  disabled,
  role,
  ariaSelected,
  ariaLabel,
  children,
  className,
  style,
}: VoidButtonProps) {
  const [hovered, setHovered] = useState(false);
  const s = VOID_TAG_STYLE[variant === "contained" ? "primary" : "daily"];

  const sharedClass = [
    "portfolio__void-button",
    disabled ? "portfolio__void-button--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const sharedStyle: CSSProperties = {
    fontWeight: s.weight,
    color: s.color,
    background: s.bg,
    border: `1px solid ${s.border}`,
    boxShadow:
      hovered && !disabled
        ? "0 0 24px color-mix(in srgb, var(--theme-accent) 50%, transparent)"
        : s.glow,
    transform: hovered && !disabled ? "translateY(-2px)" : "translateY(0)",
    ...style,
  };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        role={role}
        aria-selected={ariaSelected}
        aria-label={ariaLabel}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        className={sharedClass}
        style={sharedStyle}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      role={role}
      aria-selected={ariaSelected}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={sharedClass}
      style={sharedStyle}
    >
      {children}
    </button>
  );
}
