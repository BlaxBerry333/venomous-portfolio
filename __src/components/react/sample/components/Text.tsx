import type { CSSProperties, ReactNode } from "react";
import { alpha, C, FONT_DISPLAY, FONT_MONO } from "./tokens";

type TextProps = {
  children: ReactNode;
  as?: "span" | "p" | "div";
  style?: CSSProperties;
};

// normal：正文 —— Display 字体、白色、无辉光
export function Text({ children, as: Tag = "p", style }: TextProps) {
  const merged: CSSProperties = {
    fontFamily: FONT_DISPLAY,
    fontSize: 15,
    color: C.fg,
    lineHeight: 1.9,
    letterSpacing: "0.03em",
    margin: 0,
    ...style,
  };
  return <Tag style={merged}>{children}</Tag>;
}

// strong：HeroSubline 语调 —— Mono、accent + 紫色二级辉光、uppercase、宽字距
// 紫色二级辉光是 Hero / Divider 的辨识度签名，组件内硬编码（不进 token 体系）
const STRONG_GLOW = `
  0 0 4px rgba(255,255,255,0.8),
  0 0 12px ${alpha(C.accent, 0.7)},
  0 0 28px rgba(214,58,255,0.4)
`;
export function TextStrong({ children, as: Tag = "span", style }: TextProps) {
  const merged: CSSProperties = {
    fontFamily: FONT_MONO,
    fontSize: 13,
    color: C.fg,
    letterSpacing: "0.4em",
    textTransform: "uppercase",
    textShadow: STRONG_GLOW,
    whiteSpace: "nowrap",
    ...style,
  };
  return <Tag style={merged}>{children}</Tag>;
}

// label：小型标记，如 "/ NORMAL" "/ DISPLAY · Zen Kaku" —— Mono、cyan、letter-spacing 0.3em
// 用于字段标签 / 组件分组 hint / Demo 上方说明
export function TextLabel({ children, as: Tag = "span", style }: TextProps) {
  const merged: CSSProperties = {
    fontFamily: FONT_MONO,
    fontSize: 10,
    letterSpacing: "0.3em",
    color: C.accent,
    textTransform: "uppercase",
    textShadow: `0 0 8px ${C.accent}`,
    ...style,
  };
  return <Tag style={merged}>{children}</Tag>;
}

// muted：描述性副文本，如卡片副标 "リアルタイム 3D ポートフォリオ"
// Display 字体、淡白色、无辉光，与 Text 区别在颜色更弱、字号略小
export function TextMuted({ children, as: Tag = "span", style }: TextProps) {
  const merged: CSSProperties = {
    fontFamily: FONT_DISPLAY,
    fontSize: 14,
    color: C.muted,
    letterSpacing: "0.04em",
    lineHeight: 1.6,
    ...style,
  };
  return <Tag style={merged}>{children}</Tag>;
}
