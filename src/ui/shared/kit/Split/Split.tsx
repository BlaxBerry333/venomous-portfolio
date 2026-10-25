import type { ReactNode } from "react";
import "./Split.scss";

interface SplitProps {
  aside: ReactNode;
  align?: "start" | "end";
  side?: "start" | "end";
  children: ReactNode;
}

export function Split({ aside, align = "start", side = "end", children }: SplitProps) {
  const names = ["ui-split", `ui-split--${align}`];
  if (side === "start") names.push("ui-split--aside-first");
  return (
    <div className={names.join(" ")}>
      <div className="ui-split__main">{children}</div>
      <div className="ui-split__aside">{aside}</div>
    </div>
  );
}
