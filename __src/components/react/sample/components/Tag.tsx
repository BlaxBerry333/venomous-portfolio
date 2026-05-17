import type { ReactNode } from "react";
import { C, FONT_MONO } from "./tokens";

// 小标签：cyan 细边 + cyan 文字（uppercase）
export default function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontFamily: FONT_MONO,
        fontSize: 10,
        letterSpacing: "0.2em",
        padding: "3px 8px",
        border: `1px solid ${C.border}`,
        color: C.accent,
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}
