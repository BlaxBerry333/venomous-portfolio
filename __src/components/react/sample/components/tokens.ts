// =====================================================================
// Sample 设计令牌 —— 全部组件统一从这里取色 / 字体 / 辉光
// 命名采用语义化：bg / fg / accent / muted / border / borderSoft
// 换主题色时只改 ACCENT 常量；border / 辉光 / 组件内半透色都通过 alpha() 派生
// =====================================================================

const ACCENT = "#2bf0ff";

// 工具：把 hex / rgb 转 rgba，便于按需取 accent 的半透色
// 仅支持 #RRGGBB / #RGB / rgb()，超出范围回退到原字符串
export function alpha(color: string, a: number): string {
  if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  const m = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (m) return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${a})`;
  return color;
}

export const C = {
  bg: "#000",
  fg: "#ffffff",
  accent: ACCENT,
  muted: "rgba(255,255,255,0.55)",
  border: alpha(ACCENT, 0.3),
  borderSoft: "rgba(255,255,255,0.10)",
} as const;

export const FONT_DISPLAY = '"Zen Kaku Gothic New", "Noto Sans JP", -apple-system, sans-serif';
export const FONT_MONO = '"JetBrains Mono", ui-monospace, "SF Mono", monospace';

// 文字辉光三档（与 Title1 / 2 / 3 对应）
// Glow1 = 基线（柔和三层），Glow2 / Glow3 在此基础上递减
export const TextGlow1 = `
  0 0 4px rgba(255,255,255,0.8),
  0 0 12px ${alpha(ACCENT, 0.7)},
  0 0 28px ${alpha(ACCENT, 0.35)}
`;
export const TextGlow2 = `
  0 0 3px rgba(255,255,255,0.7),
  0 0 9px ${alpha(ACCENT, 0.5)},
  0 0 20px ${alpha(ACCENT, 0.22)}
`;
export const TextGlow3 = `
  0 0 2px rgba(255,255,255,0.55),
  0 0 6px ${alpha(ACCENT, 0.32)}
`;
