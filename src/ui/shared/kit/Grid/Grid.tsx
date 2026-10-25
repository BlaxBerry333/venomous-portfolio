import type { ReactNode } from "react";
import "./Grid.scss";

interface GridProps {
  columns?: 2 | 3 | 4 | 5;
  stagger?: boolean;
  children: ReactNode;
}

export function Grid({ columns = 3, stagger = false, children }: GridProps) {
  const names = ["ui-grid", `ui-grid--${columns}`];
  if (stagger) names.push("ui-grid--stagger");
  return <div className={names.join(" ")}>{children}</div>;
}
