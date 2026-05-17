import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

// Void 主题切换 / 页面切换的呼应效果 — 全屏粒子流 burst（与 Works hover / Featured 切换同语言）
// 中心向四周扩散的冷青粒子 + 极轻 vignette dim 收尾
// reduced-motion 下不出现

interface Props {
  trigger: number;
  durationMs?: number;
}

const PARTICLE_COUNT = 64;

export default function VoidRipple({ trigger, durationMs = 900 }: Props) {
  const reduced = useReducedMotion();
  const [seed, setSeed] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (trigger === 0) return;
    setSeed((s) => s + 1);
    setActive(true);
    const t = setTimeout(() => setActive(false), durationMs + 200);
    return () => clearTimeout(t);
  }, [trigger, durationMs, reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {active && <RippleBurst key={seed} durationMs={durationMs} />}
    </AnimatePresence>
  );
}

function RippleBurst({ durationMs }: { durationMs: number }) {
  // 锁随机种子保证粒子方向稳定
  const seeds = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 320 + Math.random() * 520; // px，覆盖大半屏幕
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        delay: (i / PARTICLE_COUNT) * 0.12,
        size: 2 + Math.random() * 2.5,
      };
    });
  }, []);

  const durationSec = durationMs / 1000;

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* 粒子从屏幕中心向四周扩散 */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 0,
          height: 0,
        }}
      >
        {seeds.map((p, i) => (
          <span
            key={i}
            style={
              {
                position: "absolute",
                left: 0,
                top: 0,
                width: p.size,
                height: p.size,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
                borderRadius: "50%",
                background: "var(--theme-accent)",
                boxShadow: `0 0 ${p.size * 3}px var(--theme-accent)`,
                animation: `void-ui--card-particle ${durationSec}s ${p.delay}s ease-out forwards`,
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      {/* 中心 flash — 极短 */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: "50%",
          background: "var(--theme-accent)",
          boxShadow:
            "0 0 24px var(--theme-accent), 0 0 48px color-mix(in srgb, var(--theme-accent) 50%, transparent)",
        }}
      />
      {/* vignette dim */}
      <motion.div
        initial={{ opacity: 0.45 }}
        animate={{ opacity: 0 }}
        transition={{ duration: durationSec, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, transparent 30%, rgba(5,6,10,0.5) 100%)",
        }}
      />
    </motion.div>
  );
}
