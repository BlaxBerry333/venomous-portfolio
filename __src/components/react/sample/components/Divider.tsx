import type { ReactNode } from "react";
import { TextStrong } from "./Text";
import { C } from "./tokens";

// 分割线：横线 — TextStrong — 横线
// 不传 children 时退化为纯横线（贯穿全宽）
export default function Divider({ children }: { children?: ReactNode }) {
  if (!children) {
    return (
      <span
        style={{
          display: "block",
          width: "100%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          boxShadow: `0 0 8px ${C.accent}`,
        }}
      />
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span
        style={{
          width: 60,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.accent})`,
          boxShadow: `0 0 8px ${C.accent}`,
        }}
      />
      <TextStrong>{children}</TextStrong>
      <span
        style={{
          width: 60,
          height: 1,
          background: `linear-gradient(90deg, ${C.accent}, transparent)`,
          boxShadow: `0 0 8px ${C.accent}`,
        }}
      />
    </div>
  );
}
