import { useMemo } from "react";

// Void 通用粒子流：一组发光小点从面板中心区域向外扩散后淡出
// 用法：
//   - Works 卡片 hover：count=10, spread="upRight", radius=[120,200], loop=true
//   - Featured 切换转场：count=30, spread="all", radius=[260,560], loop=false, durationMs=900
//
// 实现：纯 DOM + CSS 关键帧（CSS variables 控制 dx/dy 终点），零 GPU 重栈
// 单次模式：不挂 infinite，CSS animation-fill-mode: forwards 让粒子停在 100% 帧（已 opacity:0），完全不可见
// loop 模式：animation: infinite 持续喷发

export type VoidStreamSpread = "upRight" | "all";

interface Props {
  count?: number;
  /** [min, max] 飞散距离 px */
  radius?: [number, number];
  /** 起点扰动半径百分比（围绕中心） */
  originJitter?: number;
  /** 单次时长（ms）；loop 时即每轮时长 */
  durationMs?: number;
  /** 整体粒子尺寸（px） */
  size?: number;
  /** 扩散范围 */
  spread?: VoidStreamSpread;
  /** 是否无限循环（false = 单次播完就停） */
  loop?: boolean;
  /** 整批粒子的 stagger（s） */
  stagger?: number;
  /** 自定义 z-index，默认 3 */
  zIndex?: number;
}

export default function VoidParticleStream({
  count = 14,
  radius = [120, 200],
  originJitter = 20,
  durationMs = 1400,
  size = 3,
  spread = "all",
  loop = true,
  stagger = 0.05,
  zIndex = 3,
}: Props) {
  // 用 useMemo 锁随机种子，保证 React strict mode 双 mount 期间方向稳定
  const seeds = useMemo(() => {
    const upRightCenter = -Math.PI / 4;
    const upRightRange = Math.PI / 3;
    return Array.from({ length: count }, (_, i) => {
      let angle: number;
      if (spread === "upRight") {
        angle = upRightCenter + (Math.random() - 0.5) * upRightRange;
      } else {
        angle = Math.random() * Math.PI * 2;
      }
      const [rmin, rmax] = radius;
      const dist = rmin + Math.random() * (rmax - rmin);
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        delay: i * stagger,
        sx: 50 + (Math.random() - 0.5) * originJitter * 2,
        sy: 50 + (Math.random() - 0.5) * originJitter * 2,
      };
    });
  }, [count, radius, originJitter, stagger, spread]);

  const durationSec = durationMs / 1000;
  const animationMode = loop ? "infinite" : "forwards";

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex,
        overflow: "hidden",
      }}
    >
      {seeds.map((p, i) => (
        <span
          key={i}
          style={
            {
              position: "absolute",
              left: `${p.sx}%`,
              top: `${p.sy}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "var(--theme-accent)",
              boxShadow: `0 0 ${size * 2}px rgba(107,216,230,0.95), 0 0 ${size * 5}px rgba(107,216,230,0.6), 0 0 ${size * 10}px rgba(107,216,230,0.3)`,
              animation: `void-ui--card-particle ${durationSec}s ${p.delay}s ease-out ${animationMode}`,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
