import type { CSSProperties, ReactNode } from "react";
import { C, FONT_DISPLAY, TextGlow1, TextGlow2, TextGlow3 } from "./tokens";

// 标题三档 —— Title1/2/3，默认对应 h1/h2/h3
// 通过 as prop 可换标签：
//   - 降级语义（避免一页多 h1）→ "h2" / "h3"
//   - 当作纯视觉大字（不进 a11y heading outline）→ "span" / "div"
type TitleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";

type TitleProps = {
  children: ReactNode;
  as?: TitleTag;
  style?: CSSProperties;
};

function renderTitle(Tag: TitleTag, style: CSSProperties, children: ReactNode) {
  return <Tag style={style}>{children}</Tag>;
}

// 一档：section 主标，clamp 48-96px，TextGlow1 柔和 cyan
export function Title1({ children, as = "h1", style }: TitleProps) {
  const merged: CSSProperties = {
    fontFamily: FONT_DISPLAY,
    fontSize: "clamp(48px, 7vw, 96px)",
    color: C.fg,
    margin: 0,
    letterSpacing: "0.04em",
    lineHeight: 1,
    fontWeight: 800,
    textShadow: TextGlow1,
    ...style,
  };
  return renderTitle(as, merged, children);
}

// 二档：强调标题，36px，TextGlow2 厚重 cyan（最亮）
export function Title2({ children, as = "h2", style }: TitleProps) {
  const merged: CSSProperties = {
    fontFamily: FONT_DISPLAY,
    fontSize: 36,
    color: C.fg,
    margin: 0,
    letterSpacing: "0.04em",
    lineHeight: 1.1,
    fontWeight: 800,
    textShadow: TextGlow2,
    ...style,
  };
  return renderTitle(as, merged, children);
}

// 三档：小标题，24px，TextGlow3 极轻 cyan
export function Title3({ children, as = "h3", style }: TitleProps) {
  const merged: CSSProperties = {
    fontFamily: FONT_DISPLAY,
    fontSize: 24,
    color: C.fg,
    margin: 0,
    letterSpacing: "0.02em",
    lineHeight: 1.2,
    fontWeight: 700,
    textShadow: TextGlow3,
    ...style,
  };
  return renderTitle(as, merged, children);
}
