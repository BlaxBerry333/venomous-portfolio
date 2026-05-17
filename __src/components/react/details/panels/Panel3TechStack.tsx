import type { Work } from "@/data/works";
import { MangaUI } from "@/themes/manga/components";
import { ZenlessUI } from "@/themes/zenless/components";
import type { Theme } from "@/types";
import { Float, Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import PanelFrame from "../PanelFrame";
import "./Panel3TechStack.scss";
interface Props {
  work: Work;
  active: boolean;
  theme: Theme;
}

function spherePoints(n: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(
      new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius),
    );
  }
  return pts;
}

const TAG_COLORS = ["red", "yellow", "white"] as const;
type TagColor = (typeof TAG_COLORS)[number];

function StackSphere({ stack, active, theme }: { stack: string[]; active: boolean; theme: Theme }) {
  const groupRef = useRef<THREE.Group>(null);
  const points = useMemo(() => spherePoints(stack.length, 2.0), [stack.length]);
  // 给每个 tech 锁定一个随机色，避免重渲染时跳色
  const tagColors = useMemo<TagColor[]>(
    () => stack.map(() => TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]),
    [stack],
  );

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    if (active) {
      // 左右轻微摆动（约 ±15°），不再 360° 旋转
      g.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * (Math.PI / 12);
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((p, i) => {
        const tech = stack[i];
        const delayMs = i * 40;
        return (
          <Float
            key={tech}
            speed={1.2}
            rotationIntensity={0.2}
            floatIntensity={0.4}
            position={[p.x, p.y, p.z]}
          >
            <Html center transform occlude={false} distanceFactor={6}>
              {theme === "manga" ? (
                <MangaUI.Tag
                  color={tagColors[i]}
                  size="sm"
                  restRotate={0}
                  style={{
                    animation: `portfolio__panel-3-tech-stack--pop-in 600ms cubic-bezier(0.34,1.56,0.64,1) ${delayMs}ms backwards`,
                  }}
                >
                  {tech}
                </MangaUI.Tag>
              ) : (
                <span
                  style={{
                    padding: theme === "zenless" ? "8px 16px" : "8px 14px",
                    background: "var(--theme-elevated)",
                    color: "var(--theme-fg)",
                    border: `1px solid color-mix(in srgb, var(--theme-fg) 30%, transparent)`,
                    fontFamily: "var(--theme-font-mono)",
                    fontSize: 13,
                    whiteSpace: "nowrap",
                    borderRadius: "var(--theme-radius)",
                    animation: `portfolio__panel-3-tech-stack--pop-in 600ms cubic-bezier(0.34,1.56,0.64,1) ${delayMs}ms backwards`,
                    letterSpacing: theme === "zenless" ? "0.05em" : 0,
                    clipPath:
                      theme === "zenless" ? "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" : "none",
                    textTransform: theme === "zenless" ? "uppercase" : "none",
                    display: "inline-block",
                  }}
                >
                  {tech}
                </span>
              )}
            </Html>
          </Float>
        );
      })}
    </group>
  );
}

export default function Panel3TechStack({ work, active, theme }: Props) {
  const reduced = useReducedMotion();

  return (
    <PanelFrame
      theme={theme}
      index={3}
      total={9}
      label="Tech Stack"
      jpLabel="技 · 装備"
      hideHeader={theme === "zenless"}
    >
      {/* 用 negative margin 抵消 PanelFrame 的 padding，让 Canvas 撑满整个 panel；
          R3F 内部 wrapper 写死 overflow:hidden 无法绕过，扩大可视区让 Tag 不被切边 */}
      <div
        className="wd-tech-stage"
        style={{
          position: "relative",
          height: "calc(100% + var(--space-2xl) * 2)",
          width: "calc(100% + var(--space-2xl) * 2)",
          margin: "calc(var(--space-2xl) * -1)",
        }}
      >
        {theme === "zenless" ? (
          <ZenlessUI.Title2
            phase="03 / 09"
            title="Loadout"
            titleSize="clamp(32px, 5vw, 72px)"
            style={{
              position: "absolute",
              top: "var(--space-2xl)",
              left: "var(--space-2xl)",
              zIndex: 5,
            }}
          />
        ) : theme === "manga" ? (
          <MangaUI.Title1
            style={{
              position: "absolute",
              top: "var(--space-2xl)",
              left: "var(--space-2xl)",
              zIndex: 5,
            }}
          >
            Arsenal
          </MangaUI.Title1>
        ) : (
          <h2
            style={{
              position: "absolute",
              top: "var(--space-2xl)",
              left: "var(--space-2xl)",
              fontFamily: "var(--theme-font-display)",
              fontWeight: 900,
              fontSize: "clamp(32px, 5vw, 72px)",
              letterSpacing: "-0.03em",
              color: "var(--theme-fg)",
              margin: 0,
              lineHeight: 1,
              zIndex: 5,
            }}
          >
            Stack
          </h2>
        )}
        {reduced ? (
          <div
            className="wd-tech-fallback"
            style={{
              position: "absolute",
              inset: 0,
              padding: "var(--space-2xl)",
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {work.techStack.map((t) => (
              <span
                key={t}
                style={{
                  padding: "10px 16px",
                  background: "var(--theme-elevated)",
                  border: "1px solid var(--theme-fg)",
                  fontFamily: "var(--theme-font-mono)",
                  color: "var(--theme-fg)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        ) : (
          <Canvas
            className="wd-tech-canvas"
            style={{ position: "absolute", inset: 0 }}
            camera={{ position: [0, 0, 5], fov: 60 }}
            dpr={[1, 1.5]}
          >
            <ambientLight intensity={0.6} />
            <StackSphere stack={work.techStack} active={active} theme={theme} />
          </Canvas>
        )}
      </div>
    </PanelFrame>
  );
}
