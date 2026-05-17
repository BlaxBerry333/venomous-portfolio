import { motion, useScroll, useSpring, useTransform } from "framer-motion";

// 全局页面滚动进度 — 固定在 header 下方
// 与 Work Detail 原有的章节进度条共用同一视觉语言（粒子拖尾 + 冷青）

// 进度条延迟显示：滚动量 < REVEAL_THRESHOLD 比例时不显示，避免滚 1px 就闪条
// 0.08 ≈ 第一屏滚下 8% 才出来
const REVEAL_THRESHOLD = 0.08;

export default function VoidPageProgress() {
  const { scrollYProgress } = useScroll();
  // 整条 opacity：跨 threshold 渐入，避免硬切
  const opacity = useTransform(scrollYProgress, [REVEAL_THRESHOLD * 0.6, REVEAL_THRESHOLD], [0, 1]);
  // scaleX 从阈值开始映射到 0→1，让条出现时是从 0 开始填，不是直接跳到 8%
  const filled = useTransform(scrollYProgress, [REVEAL_THRESHOLD, 1], [0, 1], { clamp: true });
  const progress = useSpring(filled, { stiffness: 90, damping: 20 });
  const leadLeft = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 60, // 紧贴 header 底
        left: 0,
        right: 0,
        height: 2,
        zIndex: 49, // 略低于 header(50) 以免被 header 阴影盖错；高于普通内容
        pointerEvents: "none",
        opacity,
      }}
    >
      {/* 已经走过的轨道 */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, transparent, color-mix(in srgb, var(--theme-accent) 50%, transparent) 20%, var(--theme-accent))",
          transformOrigin: "0 50%",
          scaleX: progress,
          boxShadow: "0 0 6px var(--theme-accent)",
        }}
      />
      {/* 领先粒子拖尾 — 5 颗 */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: leadLeft,
          width: 0,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              right: i * 6,
              width: 4 - i * 0.6,
              height: 4 - i * 0.6,
              borderRadius: "50%",
              background: "var(--theme-accent)",
              boxShadow: "0 0 12px var(--theme-accent)",
              opacity: 1 - i * 0.18,
              transform: "translateY(-50%)",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
