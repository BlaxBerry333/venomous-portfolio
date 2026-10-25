import type { ReactNode } from "react";
import "./Stack.scss";

interface StackProps {
  gap?: "xs" | "s" | "m" | "l";
  direction?: "column" | "row";
  align?: "start" | "center" | "end";
  stagger?: boolean;
  children: ReactNode;
}

export function Stack({
  gap = "m",
  direction = "column",
  align,
  stagger = false,
  children,
}: StackProps) {
  const names = ["ui-stack", `ui-stack--${direction}`, `ui-stack--${gap}`];
  if (align) names.push(`ui-stack--${align}`);
  if (stagger) names.push("ui-stack--stagger");
  return <div className={names.join(" ")}>{children}</div>;
}
