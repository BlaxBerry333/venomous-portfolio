import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useId, useRef, useState } from "react";

// Void 风格星图（SkillStar）
// 中心标签 + 周围卫星 + SVG 连接线；hover 节点/标签/线 → 路径高亮 + 高速彗星 + 节点放大；
// 整体 3D tilt 跟随光标。reduced-motion 自动关闭粒子/tilt。

interface Props {
  label: string;
  skills: string[];
  delay?: number;
  reduced?: boolean;
  size?: number;
  radius?: number;
}

export default function VoidSkillStar({
  label,
  skills,
  delay = 0,
  reduced = false,
  size = 380,
  radius = 140,
}: Props) {
  const SIZE = size;
  const RADIUS = radius;
  const uid = useId();
  const pathId = (i: number) => `star-path-${uid}-${i}`;
  const [hovered, setHovered] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const rotX = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const transform = useTransform(
    [rotX, rotY],
    ([x, y]) => `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg)`,
  );

  const positions = skills.map((_, i) => {
    const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * RADIUS + SIZE / 2,
      y: Math.sin(angle) * RADIUS + SIZE / 2,
    };
  });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const el = wrapperRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotY.set(px * 18);
    rotX.set(-py * 18);
  }
  function handleLeave() {
    setHovered(null);
    rotX.set(0);
    rotY.set(0);
  }

  return (
    <motion.div
      ref={wrapperRef}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        position: "relative",
        aspectRatio: "1/1",
        width: "100%",
        maxWidth: SIZE,
        transform,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden
      >
        <defs>
          {positions.map((_, i) => (
            <path
              key={`path-${i}`}
              id={pathId(i)}
              d={`M ${SIZE / 2},${SIZE / 2} L ${positions[i].x},${positions[i].y}`}
              fill="none"
            />
          ))}
        </defs>

        {positions.map((p, i) => {
          const isHovered = hovered === i;
          const isDimmed = hovered !== null && !isHovered;
          return (
            <g key={i}>
              <line
                x1={SIZE / 2}
                y1={SIZE / 2}
                x2={p.x}
                y2={p.y}
                stroke="var(--theme-accent)"
                strokeOpacity={isHovered ? 0.95 : isDimmed ? 0.08 : 0.22}
                strokeWidth={isHovered ? 1.6 : 1}
                strokeDasharray={isHovered ? undefined : "2 4"}
                style={{ transition: "stroke-opacity 220ms, stroke-width 220ms" }}
              />
              <line
                x1={SIZE / 2}
                y1={SIZE / 2}
                x2={p.x}
                y2={p.y}
                stroke="transparent"
                strokeWidth={14}
                style={{ cursor: "pointer", pointerEvents: "stroke" }}
                onMouseEnter={() => setHovered(i)}
              />
            </g>
          );
        })}

        {!reduced &&
          positions.map((_, i) => {
            const isDimmed = hovered !== null && hovered !== i;
            return (
              <circle
                key={`flow-${i}`}
                r={2}
                fill="var(--theme-accent)"
                opacity={isDimmed ? 0.15 : 0.9}
                style={{ transition: "opacity 220ms" }}
              >
                <animateMotion
                  dur={`${2.8 + (i % 3) * 0.4}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.18}s`}
                >
                  <mpath href={`#${pathId(i)}`} />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values={isDimmed ? "0;0.15;0.15;0" : "0;1;1;0"}
                  keyTimes="0;0.1;0.85;1"
                  dur={`${2.8 + (i % 3) * 0.4}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.18}s`}
                />
              </circle>
            );
          })}

        {!reduced && hovered !== null && (
          <g key={`comet-${hovered}`}>
            <circle r={3.5} fill="var(--theme-accent)" opacity={1}>
              <animateMotion dur="0.7s" repeatCount="indefinite">
                <mpath href={`#${pathId(hovered)}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.15;0.85;1"
                dur="0.7s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r={2.2} fill="var(--theme-accent)" opacity={0.6}>
              <animateMotion dur="0.7s" repeatCount="indefinite" begin="0.06s">
                <mpath href={`#${pathId(hovered)}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.6;0.6;0"
                keyTimes="0;0.15;0.85;1"
                dur="0.7s"
                repeatCount="indefinite"
                begin="0.06s"
              />
            </circle>
            <circle r={1.4} fill="var(--theme-accent)" opacity={0.35}>
              <animateMotion dur="0.7s" repeatCount="indefinite" begin="0.12s">
                <mpath href={`#${pathId(hovered)}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.35;0.35;0"
                keyTimes="0;0.15;0.85;1"
                dur="0.7s"
                repeatCount="indefinite"
                begin="0.12s"
              />
            </circle>
          </g>
        )}

        {positions.map((p, i) => {
          const isHovered = hovered === i;
          const isDimmed = hovered !== null && !isHovered;
          return (
            <g key={`node-g-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : 3}
                fill="var(--theme-accent)"
                opacity={isDimmed ? 0.25 : 1}
                style={{
                  transition: "r 220ms, opacity 220ms",
                  filter: isHovered
                    ? "drop-shadow(0 0 4px rgba(107,216,230,0.95)) drop-shadow(0 0 12px rgba(107,216,230,0.6)) drop-shadow(0 0 24px rgba(107,216,230,0.35))"
                    : "none",
                }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={24}
                fill="transparent"
                style={{ cursor: "pointer", pointerEvents: "all" }}
                onMouseEnter={() => setHovered(i)}
              />
            </g>
          );
        })}

        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={hovered !== null ? 6 : 5}
          fill="var(--theme-accent)"
          style={{
            transition: "r 220ms",
            filter:
              hovered !== null
                ? "drop-shadow(0 0 4px rgba(107,216,230,0.95)) drop-shadow(0 0 14px rgba(107,216,230,0.6)) drop-shadow(0 0 28px rgba(107,216,230,0.35))"
                : "none",
          }}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={hovered !== null ? 14 : 10}
          fill="none"
          stroke="var(--theme-accent)"
          strokeOpacity={hovered !== null ? 0.7 : 0.4}
          style={{ transition: "r 220ms, stroke-opacity 220ms" }}
        />
      </svg>

      <p
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) translateY(24px)",
          fontFamily: "var(--theme-font-mono)",
          fontSize: 11,
          color: "var(--theme-accent)",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          textAlign: "center",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {label}
      </p>

      {positions.map((p, i) => {
        const isHovered = hovered === i;
        const isDimmed = hovered !== null && !isHovered;
        return (
          <span
            key={i}
            onMouseEnter={() => setHovered(i)}
            style={{
              position: "absolute",
              left: `${(p.x / SIZE) * 100}%`,
              top: `${(p.y / SIZE) * 100}%`,
              transform: `translate(-50%, -50%) translateY(-16px) ${isHovered ? "scale(1.1)" : "scale(1)"}`,
              transformOrigin: "center",
              fontFamily: "var(--theme-font-mono)",
              fontSize: 12,
              color: isHovered
                ? "var(--theme-accent)"
                : isDimmed
                  ? "var(--theme-fg-muted)"
                  : "var(--theme-fg)",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              background: "var(--theme-bg)",
              padding: "2px 8px",
              cursor: "pointer",
              opacity: isDimmed ? 0.45 : 1,
              transition: "color 220ms, opacity 220ms, transform 220ms",
              textShadow: isHovered
                ? "0 0 6px rgba(107,216,230,0.9), 0 0 18px rgba(107,216,230,0.55), 0 0 36px rgba(107,216,230,0.3)"
                : "none",
              border: isHovered
                ? "1px solid color-mix(in srgb, var(--theme-accent) 60%, transparent)"
                : "1px solid transparent",
            }}
          >
            {skills[i]}
          </span>
        );
      })}
    </motion.div>
  );
}
