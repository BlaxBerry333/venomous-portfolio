import { MangaUI } from "@/themes/manga/components";
import type { Theme } from "@/types";
import type { ReactNode } from "react";

interface Props {
  theme: Theme;
  index: number;
  total: number;
  label: string;
  jpLabel?: string;
  children: ReactNode;
  rankColor?: string;
  /** zenless 模式下：当外部 sidebar 已经显示 PHASE chip + label 时，隐藏 panel 自带的 chip 行 */
  hideHeader?: boolean;
}

export default function PanelFrame({
  theme,
  index,
  total,
  label,
  jpLabel,
  children,
  rankColor,
  hideHeader,
}: Props) {
  const num = String(index).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");

  // 自适应高度：横向模式下父级有固定高度（inset:0），用 100% 填满；
  // 垂直模式下用 min-height 保证内容可见但不强制 100vh
  const sizeStyle = {
    width: "100%",
    height: "100%",
    minHeight: "min(720px, calc(100vh - 60px))",
  };

  if (theme === "manga") {
    return (
      <div
        className="panel-frame panel-frame--manga"
        style={{
          ...sizeStyle,
          background: "transparent",
          position: "relative",
          padding: "var(--space-2xl) var(--space-2xl)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflow: "visible",
        }}
      >
        <MangaUI.Title2
          num={num}
          unit="話"
          label={jpLabel}
          rotate={-2}
          style={{ position: "relative", zIndex: 2, flexShrink: 0 }}
        />
        <div style={{ flex: 1, position: "relative", zIndex: 2, minHeight: 0 }}>{children}</div>
      </div>
    );
  }

  if (theme === "zenless") {
    const accent = rankColor || "var(--theme-accent)";
    return (
      <div
        className="panel-frame panel-frame--zenless"
        style={{
          ...sizeStyle,
          background: "transparent",
          position: "relative",
          padding: "var(--space-2xl) var(--space-2xl)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflow: "visible",
        }}
      >
        {!hideHeader && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              position: "relative",
              zIndex: 5,
              marginTop: 8,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                padding: "6px 14px",
                background: accent,
                color: "var(--theme-bg)",
                fontFamily: "var(--theme-font-display)",
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: "0.2em",
                clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
              }}
            >
              PHASE {num} / {totalStr}
            </span>
            <span
              style={{
                fontFamily: "var(--theme-font-mono)",
                fontSize: 11,
                color: accent,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              ▸ {label}
            </span>
          </div>
        )}
        <div style={{ flex: 1, position: "relative", zIndex: 3, minHeight: 0 }}>{children}</div>
      </div>
    );
  }

  // void (default)
  return (
    <div
      className="panel-frame panel-frame--void"
      style={{
        ...sizeStyle,
        background: "transparent",
        position: "relative",
        padding: "var(--space-2xl) var(--space-2xl)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        overflow: "visible",
      }}
    >
      <span aria-hidden className="void-ui--corner tl" />
      <span aria-hidden className="void-ui--corner tr" />
      <span aria-hidden className="void-ui--corner bl" />
      <span aria-hidden className="void-ui--corner br" />

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 16,
          flexShrink: 0,
          position: "relative",
          zIndex: 2,
        }}
      >
        <span
          style={{
            padding: "4px 10px",
            border: "1px solid var(--theme-accent)",
            color: "var(--theme-accent)",
            fontFamily: "var(--theme-font-mono)",
            fontSize: 11,
            letterSpacing: "0.3em",
            clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
            background: "color-mix(in srgb, var(--theme-accent) 6%, transparent)",
          }}
        >
          PHASE {num}/{totalStr}
        </span>
        <span
          style={{
            fontFamily: "var(--theme-font-mono)",
            fontSize: 11,
            color: "var(--theme-accent-2)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            textShadow: "none",
          }}
        >
          ◆ {label}
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}
