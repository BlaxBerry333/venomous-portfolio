import { clsx } from "@/utils/styles";
import type { CSSProperties, ReactNode } from "react";
import "./index.scss";

interface Props {
  variant?: "body" | "strong" | "label" | "muted";
  as?: "p" | "span" | "div";
  style?: CSSProperties;
  children: ReactNode;
}

export default function Text({ variant = "body", as: Tag = "span", style, children }: Props) {
  return (
    <Tag
      className={clsx("portfolio--nebula-text", `portfolio--nebula-text--${variant}`)}
      style={style}
    >
      {children}
    </Tag>
  );
}
