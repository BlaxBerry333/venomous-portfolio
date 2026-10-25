import type { ReactNode } from "react";
import { Text } from "../Text/Text";
import "./Panel.scss";

interface PanelProps {
  tag?: string;
  compact?: boolean;
  children: ReactNode;
}

export function Panel({ tag, compact = false, children }: PanelProps) {
  return (
    <div className={compact ? "ui-panel ui-panel--compact" : "ui-panel"}>
      {tag && <Text level="label" text={tag} />}
      {children}
    </div>
  );
}
