import { clsx } from "@/utils/styles";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import "./index.scss";

type Variant = "solid" | "outline";

type ButtonAsButton = {
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

type ButtonAsLink = {
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href">;

type Props = (ButtonAsButton | ButtonAsLink) & {
  variant?: Variant;
  disabled?: boolean;
  children: ReactNode;
};

export default function Button({ variant = "solid", disabled = false, children, ...rest }: Props) {
  const className = clsx(
    "portfolio--nebula-button",
    variant !== "solid" && `portfolio--nebula-button--${variant}`,
    disabled && "portfolio--nebula-button--disabled",
  );

  const isLink = "href" in rest && rest.href !== undefined;

  const content = (
    <>
      <span className="portfolio--nebula-button__label">{children}</span>
      {isLink && (
        <span className="portfolio--nebula-button__arrow" aria-hidden="true">
          →
        </span>
      )}
    </>
  );

  if (isLink) {
    // 链接元素无法真正 disabled，渲染为不可交互的 span
    if (disabled) {
      return (
        <span className={className} aria-disabled="true">
          {content}
        </span>
      );
    }
    return (
      <a {...(rest as ButtonAsLink)} className={className}>
        {content}
      </a>
    );
  }

  return (
    <button {...(rest as ButtonAsButton)} className={className} disabled={disabled}>
      {content}
    </button>
  );
}
