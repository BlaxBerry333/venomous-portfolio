import { motion } from "framer-motion";
import type React from "react";
import "./index.scss";

type ButtonProps = {
  children: React.ReactNode;
  /** 传了渲染 <a>（跳转）；不传渲染 <button>（纯按钮，不跳转）。 */
  href?: string;
  /** 禁用态 —— 不可交互、降不透明度。链接禁用时渲染为 <span>。 */
  disabled?: boolean;
  pulse?: boolean;
  variant?: "filled" | "outline";
  size?: "md" | "lg" | "xl";
  /**
   * 箭头指示。
   *   - right / left：显示对应方向箭头
   *   - none：不显示
   * 不传时：链接默认 right、纯按钮默认 none。
   */
  arrow?: "right" | "left" | "none";
  className?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export default function Button({
  children,
  href,
  disabled = false,
  pulse = false,
  variant = "filled",
  size = "md",
  arrow,
  className = "",
  target,
  rel,
  onClick,
}: ButtonProps) {
  const outerClass = [
    "portfolio--sanguine-button",
    `portfolio--sanguine-button--${variant}`,
    `portfolio--sanguine-button--${size}`,
    disabled && "portfolio--sanguine-button--disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isLink = href !== undefined;
  // arrow 不传时：链接默认 right、纯按钮默认 none
  const resolvedArrow = arrow ?? (isLink ? "right" : "none");
  const showArrow = resolvedArrow !== "none";
  const arrowGlyph = resolvedArrow === "left" ? "←" : "→";

  const inner = (
    <motion.span
      className="portfolio--sanguine-button__inner"
      animate={pulse ? { scale: [1, 1.025, 1] } : { scale: 1 }}
      transition={
        pulse ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }
      }
    >
      {showArrow && resolvedArrow === "left" && (
        <span
          className="portfolio--sanguine-button__arrow portfolio--sanguine-button__arrow--left"
          aria-hidden="true"
        >
          {arrowGlyph}
        </span>
      )}
      <span className="portfolio--sanguine-button__label">{children}</span>
      {showArrow && resolvedArrow === "right" && (
        <span
          className="portfolio--sanguine-button__arrow portfolio--sanguine-button__arrow--right"
          aria-hidden="true"
        >
          {arrowGlyph}
        </span>
      )}
    </motion.span>
  );

  // 链接禁用：<a> 无法真正 disabled，渲染为不可交互的 <span>
  if (isLink && disabled) {
    return (
      <span className={outerClass} aria-disabled="true">
        {inner}
      </span>
    );
  }

  if (isLink) {
    return (
      <a className={outerClass} href={href} target={target} rel={rel} onClick={onClick}>
        {inner}
      </a>
    );
  }

  return (
    <button className={outerClass} type="button" disabled={disabled} onClick={onClick}>
      {inner}
    </button>
  );
}
