import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Void 主题专用：always-on 背景星尘场
// 极轻量 r3f points，1500 粒子，缓慢自摆动 + 全局鼠标视差（独立于 r3f 事件系统，避免与 Hero r3f Canvas 抢事件）
// 仅在 data-theme="void" 时渲染；reduced-motion 直接降级成 CSS 静态星点

const STARDUST_COUNT = 1500;

// 模块级共享鼠标坐标，window 全局监听一次即可
const sharedMouse = { x: 0, y: 0 };
let mouseListenerAttached = false;
function ensureMouseListener() {
  if (mouseListenerAttached || typeof window === "undefined") return;
  mouseListenerAttached = true;
  window.addEventListener(
    "mousemove",
    (e) => {
      sharedMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      sharedMouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true },
  );
}

function StardustField() {
  const ref = useRef<THREE.Points>(null);
  const targetRot = useRef({ x: 0, y: 0 });
  const positions = useMemo(() => {
    const arr = new Float32Array(STARDUST_COUNT * 3);
    for (let i = 0; i < STARDUST_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, []);
  const sizes = useMemo(() => {
    const arr = new Float32Array(STARDUST_COUNT);
    for (let i = 0; i < STARDUST_COUNT; i++) arr[i] = 0.4 + Math.random() * 1.4;
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // 鼠标视差目标 + 自摆动叠加
    const swayY = Math.sin(t * 0.05) * 0.03;
    const swayX = Math.cos(t * 0.06) * 0.02;
    targetRot.current.y = sharedMouse.x * 0.06 + swayY;
    targetRot.current.x = -sharedMouse.y * 0.04 + swayX;
    // 平滑 lerp
    ref.current.rotation.y += (targetRot.current.y - ref.current.rotation.y) * 0.04;
    ref.current.rotation.x += (targetRot.current.x - ref.current.rotation.x) * 0.04;
    ref.current.position.y = Math.sin(t * 0.1) * 0.05;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={STARDUST_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={STARDUST_COUNT}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#6BD8E6"
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function VoidStardust() {
  const reduced = useReducedMotion();
  const [theme, setTheme] = useState<string | undefined>(undefined);

  useEffect(() => {
    const html = document.documentElement;
    setTheme(html.dataset.theme);
    const obs = new MutationObserver(() => setTheme(html.dataset.theme));
    obs.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (theme === "void" && !reduced) ensureMouseListener();
  }, [theme, reduced]);

  if (theme !== "void") return null;

  if (reduced) {
    return (
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          opacity: 0.4,
          backgroundImage:
            "radial-gradient(1px 1px at 23% 17%, #6BD8E6 1px, transparent 2px), radial-gradient(1px 1px at 78% 41%, #6BD8E6 1px, transparent 2px), radial-gradient(1px 1px at 51% 73%, #6BD8E6 1px, transparent 2px), radial-gradient(1px 1px at 8% 89%, #6BD8E6 1px, transparent 2px), radial-gradient(1px 1px at 92% 12%, #6BD8E6 1px, transparent 2px)",
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        // 关键：禁用 r3f 默认事件系统，避免和 Hero 的 r3f Canvas 互抢 document 事件监听
        events={undefined}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <StardustField />
      </Canvas>
    </div>
  );
}
