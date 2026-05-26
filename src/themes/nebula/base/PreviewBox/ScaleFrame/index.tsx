import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * PreviewBox.ScaleFrame —— 给 PreviewBox 用的「等比缩放画框」。
 *
 * 背景：PreviewBox.WorkMedia 内部 Mock 的字号/padding/行高按 `baseWidth`
 * 硬编码成 px。直接把外层拉宽 → 字小、padding 不够；直接 maxWidth 限死 →
 * 视觉太小且响应不到屏宽。
 *
 * 这里用 ResizeObserver 实测外层宽度，scale = 实测宽 / baseWidth：
 *   - 容器 > baseWidth：等比放大（桌面端详情页用 ~672px → 1.6×）
 *   - 容器 < baseWidth：等比缩小（移动端 360px → 0.86×），比例不崩
 *
 * 内层始终以 baseWidth px 渲染，aspect 决定外层占位高，避免 scale 不撑空间。
 */

interface Props {
  /** PreviewBox 子元素（通常是 PreviewBox.WorkMedia / PreviewBox.Image） */
  children: ReactNode;
  /** 内部 Mock 的设计基准宽度，默认 420（WorkCard 实际渲染宽度） */
  baseWidth?: number;
  /** 外层最大宽度上限，默认 672（≈ 1.6× baseWidth） */
  maxWidth?: number;
  /** 宽高比，默认 "16 / 10"（与 Mock 默认 aspect 一致） */
  aspect?: string;
}

export default function ScaleFrame({
  children,
  baseWidth = 420,
  maxWidth = 672,
  aspect = "16 / 10",
}: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!outerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(w / baseWidth);
    });
    ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, [baseWidth]);

  return (
    <div
      ref={outerRef}
      style={{
        width: "100%",
        maxWidth: `${maxWidth}px`,
        marginInline: "auto",
        aspectRatio: aspect,
        overflow: "hidden",
      }}
    >
      <div
        style={
          {
            width: `${baseWidth}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            ["--card-padding" as string]: "0px",
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
