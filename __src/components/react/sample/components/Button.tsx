import { useState, type CSSProperties, type ReactNode } from "react";
import { alpha, C, FONT_MONO, TextGlow1 } from "./tokens";

type Variant = "solid" | "outline";

// 实心：默认 accent 背景 + 黑字（强调主操作）
//        hover → 背景渐变到白，press → 同 hover 但 boxShadow 收紧
// 描边：默认透明 + accent 细边 + accent 文字辉光（次操作）
//        hover → 边框变亮 + 背景 accent 6% 染色
export default function Button({
  variant = "solid",
  href,
  onClick,
  children,
  style,
}: {
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  const base: CSSProperties = {
    padding: "14px 30px",
    fontFamily: FONT_MONO,
    fontSize: 12,
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    textDecoration: "none",
    display: "inline-block",
    cursor: "pointer",
    transition: "background 200ms ease, box-shadow 200ms ease, transform 120ms ease",
    border: "none",
  };

  let variantStyle: CSSProperties;
  if (variant === "solid") {
    // 默认 cyan 实心；hover/pressed 切换到白色
    const isLit = hover || pressed;
    variantStyle = {
      color: C.bg,
      background: isLit ? C.fg : C.accent,
      fontWeight: 800,
      boxShadow: pressed
        ? // press 收紧：发光范围变小，模拟按下感
          `0 0 0 1px ${C.accent}, 0 0 8px ${C.accent}`
        : hover
          ? `0 0 0 1px ${C.accent}, 0 0 24px ${C.accent}, 0 0 48px ${alpha(C.accent, 0.4)}`
          : `0 0 0 1px ${C.accent}, 0 0 14px ${alpha(C.accent, 0.6)}`,
      transform: pressed ? "translateY(1px)" : "translateY(0)",
    };
  } else {
    // outline：默认透明 + accent 细边；hover 边框亮 + 背景 accent 6% 染色
    variantStyle = {
      color: C.fg,
      border: `1px solid ${hover || pressed ? C.accent : C.border}`,
      background: pressed ? alpha(C.accent, 0.12) : hover ? alpha(C.accent, 0.06) : "transparent",
      textShadow: TextGlow1,
      transform: pressed ? "translateY(1px)" : "translateY(0)",
    };
  }

  const merged = { ...base, ...variantStyle, ...style };

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPressed(false);
    },
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
  };

  if (href) {
    return (
      <a href={href} style={merged} {...handlers}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} style={merged} {...handlers}>
      {children}
    </button>
  );
}
